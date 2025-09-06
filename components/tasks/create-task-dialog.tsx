"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addTask } from "@/lib/redux/features/tasks-slice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bug, Lightbulb, BookOpen, GitBranch, Loader2 } from "lucide-react"
import { ProjectTaskPriority, ProjectTaskType, type ProjectTask, type TaskCreateRequest, type TaskType } from "@/types/task"
import { toast } from "@/hooks/use-toast"
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project"
import { Sprint } from "@/types/sprint"

import Select from "react-select"

import { createProjectTaskHelper, getAllProjectTaskStatusHelper, getNonCompletedSprintsHelper, getActiveProjectUsersHelper, getSprintsHelper } from "@/lib/service/api-helpers"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentTask: ProjectTask | null
  projectList?: Project[] | []
  fetchData?: () => void
}

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function CreateTaskDialog({ open, onOpenChange, parentTask, projectList, fetchData }: CreateTaskDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  const [loadingProjectUsers, setLoadingProjectUsers] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[] | []>([]);
  const [projectTaskStatuses, setProjectTaskStatuses] = useState<ProjectTaskStatus[]>([])
  const [loadingTaskStatus, setLoadingTaskStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectTaskStatus: "" as string,
    project: "" as string | null,
    assignee: "" as string | null,
    priority: "Medium" as string,
    taskType: "feature" as TaskType | null,
    sprint: "" as string | null,
    parentTask: (parentTask?.id || "") as string | null,
  })

  const projectOptions: SelectOption[] = useMemo(() =>
    (projectList || []).map(p => ({ value: p.id, label: p.name })),
    [projectList]
  );

  const assigneeOptions: SelectOption[] = useMemo(() =>
    (projectUsers || []).map(user => ({ value: user.userId, label: user.email })),
    [projectUsers]
  );

  const projectTaskStatusList: SelectOption[] = useMemo(() =>
    (projectTaskStatuses || []).map(status => ({ value: status.id, label: status.label })),
    [projectTaskStatuses]
  );


  const priorityOptions: SelectOption[] = useMemo(() => [
    { value: ProjectTaskPriority.CRITICAL, label: "Critical" },
    { value: ProjectTaskPriority.HIGH, label: "High" },
    { value: ProjectTaskPriority.MEDIUM, label: "Medium" },
    { value: ProjectTaskPriority.LOW, label: "Low" },
  ], []);


  const taskTypeOptions: SelectOption[] = useMemo(() => [
    { value: ProjectTaskType.BUG, label: "Bug", icon: <Bug className="mr-2 h-4 w-4 text-red-500" /> },
    { value: ProjectTaskType.FEATURE, label: "Feature", icon: <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> },
    { value: ProjectTaskType.STORY, label: "Story", icon: <BookOpen className="mr-2 h-4 w-4 text-purple-500" /> },
    { value: ProjectTaskType.STORY, label: "Subtask", icon: <GitBranch className="mr-2 h-4 w-4 text-gray-500" /> },
  ], []);

  const sprintOptions: SelectOption[] = useMemo(() =>
    (sprintList || []).map(sprint => ({ value: sprint.id, label: sprint.name })),
    [sprintList]
  );


  const parentTaskOptions: SelectOption[] = useMemo(() => {
    const filteredTasks = allTasks?.filter(
      (task) => task.taskType !== "SUBTASK" && (formData.project ? task.createdProject.id === formData.project : true)
    );

    // parentTaskOptions'ı oluştur
    let options = filteredTasks?.map(task => ({
      value: task.id,
      label: `${task.taskNumber} - ${task.title}`
    }));

    if (parentTask && !options.some(option => option.value === parentTask.id)) {
      options = [{
        value: parentTask.id,
        label: `${parentTask.taskNumber} - ${parentTask.title}`
      }, ...options]; // Parent görevi en üste ekleyebiliriz
    }

    return options;
  }, [allTasks, formData.project, parentTask]); // parentTask bağımlılığını eklemeyi unutmayın

  const formatTaskTypeLabel = ({ label, icon }: SelectOption) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <span>{label}</span>
    </div>
  );


  const handleChange = useCallback((field: keyof typeof formData, value: string | SelectOption | null) => {
    let actualValue: string | null;

    if (typeof value === 'object' && value !== null && 'value' in value) {
      actualValue = value.value;
    } else if (typeof value === 'string' || value === null) {
      actualValue = value;
    } else {
      actualValue = null;
    }

    setFormData((prev) => ({ ...prev, [field]: actualValue }));

    if (field === "project" && typeof actualValue === 'string' && actualValue !== "all") {
      handleGetProjectUsers(actualValue);
      handleGetSprints(actualValue);
      fetchAllProjectTaskStatus(actualValue);
    }
  }, []);

  const handleGetProjectUsers = useCallback(async (projectId: string) => {
    const usersData = await getActiveProjectUsersHelper(projectId, { setLoading: setLoadingProjectUsers });
    if (usersData) {
      setProjectUsers(usersData);
    } else {
      setProjectUsers([]);
    }
  }, []);

  const handleGetSprints = useCallback(async (projectId: string) => {
    const sprintsData = await getNonCompletedSprintsHelper(projectId, { setLoading: setLoadingSprints });
    if (sprintsData) {
      setSprintList(sprintsData);
    } else {
      setSprintList([]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.project || !formData.assignee || !formData.taskType ||
      (formData.taskType === "subtask" && !formData.parentTask)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }


    const { title, description, project, projectTaskStatus, assignee, priority, taskType, sprint, parentTask } = formData

    const newTask: TaskCreateRequest = {
      id: null,
      taskNumber: null,
      title,
      description,
      projectTaskStatusId: projectTaskStatus,
      priority: priority as "High" | "Medium" | "Low",
      taskType: taskType as TaskType,
      projectId: project,
      assigneeId: assignee!,
      assignee: null,
      sprintId: sprint || undefined,
      parentTaskId: parentTask || undefined,
    }


    const response = await createProjectTaskHelper(newTask, { setLoading });
    if (response) {
      //dispatch(addTask(newTask))

      onOpenChange(false)
      setFormData({
        title: "",
        description: "",
        projectTaskStatus: "",
        project: null,
        assignee: null,
        priority: "Medium",
        taskType: "feature",
        sprint: null,
        parentTask: null,
      })
    }

    if (fetchData !== undefined) {
      fetchData();
    }
  }


  const fetchAllProjectTaskStatus = useCallback(async (projectId: string) => {
    setProjectTaskStatuses([]); // Clear previous statuses
    const statusesData = await getAllProjectTaskStatusHelper(projectId, { setLoading: setLoadingTaskStatus });
    if (statusesData) {
      setProjectTaskStatuses(statusesData);
    } else {
      setProjectTaskStatuses([]);
    }
  }, []);


  useEffect(() => {
    if (parentTask?.id) {
      setFormData((prev) => ({
        ...prev,
        project: parentTask.createdProject.id,
        taskType: "subtask",
        parentTask: parentTask.id,
      }));
      if (parentTask.createdProject) {
        handleGetProjectUsers(parentTask.createdProject.id);
        handleGetSprints(parentTask.createdProject.id);
        fetchAllProjectTaskStatus(parentTask.createdProject.id);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        project: null,
        taskType: "feature",
        parentTask: null,
      }));
      setProjectUsers([]);
      setSprintList([]);
      setProjectTaskStatuses([]);
    }
  }, [parentTask, handleGetProjectUsers, handleGetSprints, fetchAllProjectTaskStatus]);


  const overallLoading = loading || loadingProjectUsers || loadingSprints || loadingTaskStatus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project. Fill out the details below.</DialogDescription>
          </DialogHeader>
          {
            overallLoading ? (
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Describe the task in detail"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="project">Project</Label>
                    <Select
                      id="project"
                      options={projectOptions}
                      value={projectOptions.find(option => option.value === formData.project)}
                      onChange={(option) => handleChange("project", option)}
                      placeholder="Select project"
                      isDisabled={parentTask}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="projectTaskStatus">Project Task Status</Label>
                    <Select
                      id="projectTaskStatus"
                      options={projectTaskStatusList}
                      value={projectTaskStatusList.find(option => option.value === formData.projectTaskStatus)}
                      onChange={(option) => handleChange("projectTaskStatus", option)}
                      placeholder="Select project"
                      required
                    />
                  </div>


                  {parentTask && <div className="grid gap-2">
                    <Label htmlFor="parentTask">Parent Task</Label>
                    <Select
                      id="parentTask"
                      options={parentTaskOptions}
                      value={parentTaskOptions.find(option => option.value === formData.parentTask)}
                      onChange={(option) => handleChange("parentTask", option)}
                      placeholder={"Select parent task"}
                      isDisabled={!!parentTask}
                      isClearable
                    />
                  </div>}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="taskType">Task Type</Label>
                      <Select
                        id="taskType"
                        options={taskTypeOptions}
                        value={taskTypeOptions.find(option => option.value === formData.taskType)}
                        onChange={(option) => handleChange("taskType", option)}
                        placeholder="Select task type"
                        formatOptionLabel={formatTaskTypeLabel}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="assignee">Assignee</Label>
                      <Select
                        id="assignee"
                        options={assigneeOptions}
                        value={assigneeOptions.find(option => option.value === formData.assignee)}
                        onChange={(option) => handleChange("assignee", option)}
                        placeholder="Assign to"
                        required
                        isClearable
                        isDisabled={!formData.project || assigneeOptions.length === 0}
                        noOptionsMessage={() => "Select a project first to see assignees."}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        id="priority"
                        options={priorityOptions}
                        value={priorityOptions.find(option => option.value === formData.priority)}
                        onChange={(option) => handleChange("priority", option)}
                        placeholder="Select priority"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sprint">Sprint</Label>
                      <Select
                        id="sprint"
                        options={sprintOptions}
                        value={sprintOptions.find(option => option.value === formData.sprint)}
                        onChange={(option) => handleChange("sprint", option)}
                        placeholder="Select sprint"
                        isClearable
                        isDisabled={!formData.project || sprintOptions.length === 0}
                        noOptionsMessage={() => "Select a project first to see sprints."}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </>
            )
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}
