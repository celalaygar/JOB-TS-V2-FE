"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react" // Added useMemo
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
// Removed Shadcn UI Select imports
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bug, Lightbulb, BookOpen, GitBranch, Loader2 } from "lucide-react"
import type { Task } from "@/lib/redux/features/tasks-slice"
import type { TaskType } from "@/types/task"
import { toast } from "@/hooks/use-toast"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { GET_PROJECT_USERS, PROJECT_URL, SPRINT_NON_COMPLETED_GET_ALL_URL } from "@/lib/service/BasePath"
import { Project, ProjectUser } from "@/types/project"
import { Sprint } from "@/types/sprint"

// Import react-select
import Select from "react-select"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentTaskId?: string
  projectList?: Project[] | [] // Now used directly for project dropdown
}

// Define a common interface for react-select options
interface SelectOption {
  value: string;
  label: string;
}

export function CreateTaskDialog({ open, onOpenChange, parentTaskId, projectList }: CreateTaskDialogProps) {
  const dispatch = useDispatch()
  // projects is no longer needed from Redux if projectList is passed as a prop
  // const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users) // Still use users from Redux for assignee data
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([]); // Changed to setProjectUsers
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[] | []>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "" as string | null, // Allow null for react-select
    assignee: "" as string | null, // Allow null for react-select
    priority: "Medium" as string, // Allow string for react-select
    taskType: "feature" as TaskType | null, // Allow null for react-select
    sprint: "" as string | null, // Allow null for react-select
    parentTask: (parentTaskId || "") as string | null, // Allow null for react-select
  })

  // Options for react-select components
  const projectOptions: SelectOption[] = useMemo(() =>
    (projectList || []).map(p => ({ value: p.id, label: p.name })),
    [projectList]
  );

  const assigneeOptions: SelectOption[] = useMemo(() =>
    (projectUsers || []).map(user => ({ value: user.id, label: user.email })),
    [projectUsers]
  );

  const priorityOptions: SelectOption[] = useMemo(() => [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ], []);

  const taskTypeOptions: SelectOption[] = useMemo(() => [
    { value: "bug", label: "Bug", icon: <Bug className="mr-2 h-4 w-4 text-red-500" /> },
    { value: "feature", label: "Feature", icon: <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> },
    { value: "story", label: "Story", icon: <BookOpen className="mr-2 h-4 w-4 text-purple-500" /> },
    { value: "subtask", label: "Subtask", icon: <GitBranch className="mr-2 h-4 w-4 text-gray-500" /> },
  ], []);

  const sprintOptions: SelectOption[] = useMemo(() =>
    (sprintList || []).map(sprint => ({ value: sprint.id, label: sprint.name })),
    [sprintList]
  );

  const parentTaskOptions: SelectOption[] = useMemo(() =>
    allTasks
      .filter((task) => task.taskType !== "subtask" && (formData.project ? task.project === formData.project : true))
      .map(task => ({ value: task.id, label: `${task.taskNumber} - ${task.title}` })),
    [allTasks, formData.project]
  );


  // If parentTaskId is provided, pre-fill project from parent task
  useEffect(() => {
    if (parentTaskId) {
      const parentTask = allTasks.find((task) => task.id === parentTaskId)
      if (parentTask) {
        setFormData((prev) => ({
          ...prev,
          project: parentTask.project,
          taskType: "subtask", // Subtask by default when parentTaskId is present
          parentTask: parentTaskId,
        }))
        // Ensure users and sprints for the parent task's project are loaded
        if (parentTask.project) {
          getProjectUsers(parentTask.project);
          getSprint(parentTask.project);
        }
      }
    }
  }, [parentTaskId, allTasks])


  const handleChange = useCallback((field: keyof typeof formData, value: string | SelectOption | null) => {
    let actualValue: string | null;

    if (typeof value === 'object' && value !== null && 'value' in value) {
      actualValue = value.value;
    } else if (typeof value === 'string' || value === null) {
      actualValue = value;
    } else {
      actualValue = null; // Should not happen with current usage, but for type safety
    }

    setFormData((prev) => ({ ...prev, [field]: actualValue }));

    if (field === "project" && typeof actualValue === 'string' && actualValue !== "all") {
      getProjectUsers(actualValue);
      getSprint(actualValue);
    }
  }, []); // No dependencies for useCallback, as it takes all required params.


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.project || !formData.assignee || !formData.taskType ||
      (formData.taskType === "subtask" && !formData.parentTask)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedProjectData = projectList?.find((p) => p.id === formData.project) || { name: "" }; // Get project name
    const selectedAssigneeData = users.find((user) => user.id === formData.assignee);

    const { title, description, project, assignee, priority, taskType, sprint, parentTask } = formData

    // Generate a prefix based on task type
    let prefix = ""
    switch (taskType) {
      case "bug":
        prefix = "BUG"
        break
      case "feature":
        prefix = "FTR"
        break
      case "story":
        prefix = "STORY"
        break
      case "subtask":
        prefix = "SUB"
        break
      default:
        prefix = "PBI"
    }

    const randomNumber = Math.floor(Math.random() * 10000)
    const taskNumber = `${prefix}-${randomNumber}`

    const newTask: Task = {
      id: `task-${Date.now()}`,
      taskNumber,
      title,
      description,
      status: "to-do", // Initial status
      priority: priority as "High" | "Medium" | "Low",
      taskType: taskType as TaskType,
      project: project!, // Assert non-null as validated above
      projectName: selectedProjectData.name,
      assignee: {
        id: assignee!, // Assert non-null as validated above
        name: selectedAssigneeData?.name || "",
        avatar: selectedAssigneeData?.avatar || "",
        initials: selectedAssigneeData?.initials || "",
      },
      sprint: sprint || undefined,
      createdAt: new Date().toISOString(),
      comments: [],
      parentTaskId: parentTask || undefined,
    }

    dispatch(addTask(newTask))
    toast({
      title: "Task Created",
      description: `Task "${newTask.taskNumber} - ${newTask.title}" has been successfully created.`,
    });
    onOpenChange(false)
    setFormData({
      title: "",
      description: "",
      project: null,
      assignee: null,
      priority: "Medium",
      taskType: "feature",
      sprint: null,
      parentTask: null,
    })
  }

  // getProjectUsers is now useCallback'ed
  const getProjectUsers = useCallback(async (projectId: string) => {
    if (!projectId) {
      setProjectUsers([]);
      return;
    }
    setLoading(true);
    try {
      const response: ProjectUser[] = await BaseService.request(`${GET_PROJECT_USERS}/${projectId}`, {
        method: httpMethods.GET,
      });
      setProjectUsers(response);
      toast({
        title: `Project Users Loaded`,
        description: `Users for project ${projectId} have been retrieved.`,
      });
    } catch (error: any) {
      console.error('Failed to get project users:', error);
      toast({
        title: `Failed to Load Project Users`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies for useCallback, as projectId is passed as an argument.

  // getSprint is now useCallback'ed
  const getSprint = useCallback(async (projectId: string) => {
    if (!projectId) {
      setSprintList([]);
      return;
    }
    setLoadingSprints(true);
    try {
      const response: Sprint[] = await BaseService.request(`${SPRINT_NON_COMPLETED_GET_ALL_URL}/${projectId}`, {
        method: httpMethods.GET,
      });
      setSprintList(response);
      toast({
        title: "Sprints Loaded",
        description: `Sprints for project ${projectId} have been retrieved.`,
      });
    } catch (error: any) {
      console.error("Failed to load sprints:", error);
      toast({
        title: "Failed to Load Sprints",
        description: error.message || "An error occurred while loading sprints.",
        variant: "destructive",
      });
    } finally {
      setLoadingSprints(false);
    }
  }, []); // No dependencies for useCallback, as projectId is passed as an argument.



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your project. Fill out the details below.</DialogDescription>
          </DialogHeader>
          {
            loading || loadingSprints ? // Combined loading states for overall form loading
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
              :
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
                      value={formData.description || ""} // Handle null
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
                      required
                      isDisabled={!!parentTaskId} // Disable if parent task is provided
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
                        isDisabled={!!parentTaskId}
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
                        isDisabled={!!parentTaskId} // Disable if parent task is provided
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
                        isDisabled={!formData.project || assigneeOptions.length === 0} // Disable if no project selected
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
                        isDisabled={!formData.project || sprintOptions.length === 0} // Disable if no project selected
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
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}