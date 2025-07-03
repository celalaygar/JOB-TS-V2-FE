"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateTask } from "@/lib/redux/features/tasks-slice" // Keep for Redux state update if needed, but primary update will be via API
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
import type { ProjectTask, TaskType, TaskUpdateRequest } from "@/types/task" // Assuming TaskUpdateRequest type
import { toast } from "@/hooks/use-toast"
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project"
import { Sprint } from "@/types/sprint"

import Select from "react-select"

import {
  getProjectUsersHelper,
  getNonCompletedSprintsHelper,
  getAllProjectTaskStatusHelper,
  updateProjectTaskHelper,
} from "@/lib/service/api-helpers"
import type { Task } from "@/types/task" // Import Task type if not already

interface EditTaskDialogProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => VideoFacingModeEnum
  fetchData: () => void // Function to refresh task list after edit
  projectList?: Project[] | []
}

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function EditTaskDialog({ taskId, open, onOpenChange, projectList, fetchData }: EditTaskDialogProps) {
  const dispatch = useDispatch()
  const allTasks = useSelector((state: RootState) => state.tasks.tasks) // Used for parent task options
  const taskDetails: ProjectTask = useSelector((state: RootState) => state.tasks.tasks.find((task) => task.id === taskId))

  const [loadingTask, setLoadingTask] = useState(true); // Loading state for initial task fetch
  const [loadingProjectUsers, setLoadingProjectUsers] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[] | []>([]);
  const [projectTaskStatuses, setProjectTaskStatuses] = useState<ProjectTaskStatus[]>([])
  const [loadingTaskStatus, setLoadingTaskStatus] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Loading for update operation

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectTaskStatusId: "" as string, // Changed from 'status' to 'projectTaskStatus'
    projectId: "" as string | null,
    assigneeId: "" as string | null,
    priority: "Medium" as string,
    taskType: "feature" as TaskType | null,
    sprint: "" as string | null,
    parentTask: "" as string | null,
  })

  // Options for react-select
  const projectOptions: SelectOption[] = useMemo(() =>
    (projectList || []).map(p => ({ value: p.id, label: p.name })),
    [projectList]
  );

  const assigneeOptions: SelectOption[] = useMemo(() =>
    (projectUsers || []).map(user => ({ value: user.id, label: user.email })),
    [projectUsers]
  );
  const projectTaskStatusList: SelectOption[] = useMemo(() =>
    (projectTaskStatuses || []).map(status => ({ value: status.id, label: status.label })),
    [projectTaskStatuses]
  );

  const priorityOptions: SelectOption[] = useMemo(() => [
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
    { value: "LOW", label: "Low" },
  ], []);

  const taskTypeOptions: SelectOption[] = useMemo(() => [
    { value: "BUG", label: "Bug", icon: <Bug className="mr-2 h-4 w-4 text-red-500" /> },
    { value: "FEATURE", label: "Feature", icon: <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> },
    { value: "STORY", label: "Story", icon: <BookOpen className="mr-2 h-4 w-4 text-purple-500" /> },
    { value: "SUBTASK", label: "Subtask", icon: <GitBranch className="mr-2 h-4 w-4 text-gray-500" /> },
  ], []);

  const sprintOptions: SelectOption[] = useMemo(() =>
    (sprintList || []).map(sprint => ({ value: sprint.id, label: sprint.name })),
    [sprintList]
  );

  const parentTaskOptions: SelectOption[] = useMemo(() =>
    allTasks
      .filter((task) => task.id !== taskId && task.taskType !== "subtask" && (formData.projectId ? task.project === formData.projectId : true))
      .map(task => ({ value: task.id, label: `${task.taskNumber} - ${task.title}` })),
    [allTasks, taskId, formData.projectId]
  );

  const formatTaskTypeLabel = ({ label, icon }: SelectOption) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon}
      <span>{label}</span>
    </div>
  );

  // Fetch task details and populate form
  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (open && taskId) {
        setLoadingTask(true);
        if (taskDetails) {
          setFormData({
            title: taskDetails.title || "",
            description: taskDetails.description || "",
            projectTaskStatusId: taskDetails.projectTaskStatus.id || "",
            projectId: taskDetails.createdProject.id || null,
            assigneeId: taskDetails.assignee.id || null,
            priority: taskDetails.priority || "Medium",
            taskType: taskDetails.taskType || "feature",
            sprint: taskDetails.sprint.id || null,
            parentTask: taskDetails.parentTaskId || null,
          });
          if (taskDetails.createdProject.id) {
            handleGetProjectUsers(taskDetails.createdProject.id);
            handleGetSprints(taskDetails.createdProject.id);
            fetchAllProjectTaskStatus(taskDetails.createdProject.id);
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load task details.",
            variant: "destructive",
          });
        }
        setLoadingTask(false);
      }
    };
    fetchTaskDetails();
  }, [open, taskId]);


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

    // When project changes, fetch relevant data for the new project
    if (field === "project" && typeof actualValue === 'string' && actualValue !== "all") {
      setFormData((prev) => ({ ...prev, assigneeId: null, sprint: null, projectTaskStatusId: "" })); // Clear assignee, sprint, status on project change
      handleGetProjectUsers(actualValue);
      handleGetSprints(actualValue);
      fetchAllProjectTaskStatus(actualValue);
    }
  }, []);

  const handleGetProjectUsers = useCallback(async (projectId: string) => {
    setLoadingProjectUsers(true);
    const usersData = await getProjectUsersHelper(projectId, { setLoading: setLoadingProjectUsers });
    if (usersData) {
      setProjectUsers(usersData);
    } else {
      setProjectUsers([]);
    }
    setLoadingProjectUsers(false);
  }, []);

  const handleGetSprints = useCallback(async (projectId: string) => {
    setLoadingSprints(true);
    const sprintsData = await getNonCompletedSprintsHelper(projectId, { setLoading: setLoadingSprints });
    if (sprintsData) {
      setSprintList(sprintsData);
    } else {
      setSprintList([]);
    }
    setLoadingSprints(false);
  }, []);

  const fetchAllProjectTaskStatus = useCallback(async (projectId: string) => {
    setLoadingTaskStatus(true);
    setProjectTaskStatuses([]); // Clear previous statuses
    const statusesData = await getAllProjectTaskStatusHelper(projectId, { setLoading: setLoadingTaskStatus });
    if (statusesData) {
      setProjectTaskStatuses(statusesData);
    } else {
      setProjectTaskStatuses([]);
    }
    setLoadingTaskStatus(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.projectId || !formData.assigneeId || !formData.taskType || !formData.projectTaskStatusId ||
      (formData.taskType === "subtask" && !formData.parentTask)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const { title, description, projectId, projectTaskStatusId, assigneeId, priority, taskType, sprint, parentTask } = formData

    const updatedTask: TaskUpdateRequest = {
      id: taskId,
      title,
      description,
      projectTaskStatusId: projectTaskStatusId,
      priority: priority as "High" | "Medium" | "Low",
      taskType: taskType as TaskType,
      projectId: projectId!,
      assigneeId: assigneeId!,
      sprintId: sprint || null, // Changed from undefined to null for consistency
      parentTaskId: parentTask || null, // Changed from undefined to null for consistency
    }


    setLoadingUpdate(true);
    const response = await updateProjectTaskHelper(taskId, updatedTask, { setLoading: setLoadingUpdate });

    if (response) {


      toast({
        title: "Task Updated",
        description: `Task "${updatedTask.title}" has been successfully updated.`,
      });
      fetchData(); // Refresh data in parent component
      onOpenChange(false);
    } else {
      toast({
        title: "Update Failed",
        description: "There was an error updating the task.",
        variant: "destructive",
      });
    }
    setLoadingUpdate(false);
  }

  const overallLoading = loadingTask || loadingProjectUsers || loadingSprints || loadingTaskStatus || loadingUpdate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the details of this task.</DialogDescription>
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
                      value={projectOptions.find(option => option.value === formData.projectId)}
                      onChange={(option) => handleChange("projectId", option)}
                      placeholder="Select project"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="projectTaskStatus">Project Task Status</Label>
                    <Select
                      id="projectTaskStatus"
                      options={projectTaskStatusList}
                      value={projectTaskStatusList.find(option => option.value === formData.projectTaskStatusId)}
                      onChange={(option) => handleChange("projectTaskStatusId", option)}
                      placeholder="Select status"
                      required
                      isDisabled={projectTaskStatuses.length === 0}
                      noOptionsMessage={() => "Select a project first to see statuses."}
                    />
                  </div>


                  {formData.taskType === "subtask" && (
                    <div className="grid gap-2">
                      <Label htmlFor="parentTask">Parent Task</Label>
                      <Select
                        id="parentTask"
                        options={parentTaskOptions}
                        value={parentTaskOptions.find(option => option.value === formData.parentTask)}
                        onChange={(option) => handleChange("parentTask", option)}
                        placeholder="Select parent task"
                        isClearable
                      />
                    </div>
                  )}

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
                        id="assigneeId"
                        options={assigneeOptions}
                        value={assigneeOptions.find(option => option.value === formData.assigneeId)}
                        onChange={(option) => handleChange("assigneeId", option)}
                        placeholder="Assign to"
                        required
                        isClearable
                        isDisabled={!formData.projectId || assigneeOptions.length === 0}
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
                        isDisabled={!formData.projectId || sprintOptions.length === 0}
                        noOptionsMessage={() => "Select a project first to see sprints."}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </>
            )
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}