"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { selectProject, removeProject } from "@/lib/redux/features/projects-slice"
import { removeTask } from "@/lib/redux/features/tasks-slice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Trash2,
  Plus,
  ArrowUpDown,
  Settings,
  MoreHorizontal,
  UserPlus,
  Bug,
  Lightbulb,
  BookOpen,
  GitBranch,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { addNotification } from "@/lib/redux/features/notifications-slice"
import { addInvitation } from "@/lib/redux/features/invitations-slice"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import type { TaskType } from "@/types/task"

export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const projectId = params.id as string

  const project = useSelector((state: RootState) => state.projects.projects.find((p) => p.id === projectId))
  const allTasks = useSelector((state: RootState) => state.tasks?.tasks || [])
  const tasks = allTasks.filter((task) => task.project === projectId)
  const users = useSelector((state: RootState) => state.users.users)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false)
  const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedUserToInvite, setSelectedUserToInvite] = useState("")

  // Filtering state
  const [taskFilters, setTaskFilters] = useState({
    search: "",
    status: "",
    priority: "",
    assignee: "",
    taskType: "",
  })

  useEffect(() => {
    if (projectId) {
      dispatch(selectProject(projectId))
    }
  }, [projectId, dispatch])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button asChild>
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    )
  }

  // Handle project deletion
  const handleDeleteProject = () => {
    dispatch(removeProject(projectId))
    router.push("/projects")
  }

  // Handle task deletion
  const handleDeleteTask = () => {
    if (selectedTask) {
      dispatch(removeTask(selectedTask.id))
      setDeleteTaskDialogOpen(false)
      setSelectedTask(null)
    }
  }

  // Handle user invitation
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()

    // If a user is selected from the dropdown
    if (selectedUserToInvite) {
      const userToInvite = users.find((user) => user.id === selectedUserToInvite)

      if (userToInvite) {
        // Check if user is already in the team
        const isAlreadyInTeam = project.team.some((member) => member.name === userToInvite.name)

        if (isAlreadyInTeam) {
          alert("This user is already a member of the project team.")
          return
        }

        // Create invitation
        dispatch(
          addInvitation({
            id: `invitation-${Date.now()}`,
            type: "project",
            projectId: project.id,
            projectName: project.name,
            recipientId: userToInvite.id,
            recipientName: userToInvite.name,
            recipientEmail: userToInvite.email,
            senderId: currentUser?.id || "",
            senderName: currentUser?.name || "",
            senderAvatar: currentUser?.avatar || "",
            senderInitials: currentUser?.initials || "",
            status: "pending",
            createdAt: new Date().toISOString(),
          }),
        )

        // Add notification for the invited user
        dispatch(
          addNotification({
            id: `notification-${Date.now()}`,
            type: "invitation",
            title: "Project Invitation",
            message: `You have been invited to join the project "${project.name}"`,
            issueId: "",
            issueTitle: "",
            sender: {
              id: currentUser?.id || "",
              name: currentUser?.name || "",
              avatar: currentUser?.avatar || "",
              initials: currentUser?.initials || "",
            },
            date: new Date().toISOString(),
            read: false,
          }),
        )
      }
    }
    // If an email is entered
    else if (inviteEmail) {
      // Create invitation with email
      dispatch(
        addInvitation({
          id: `invitation-${Date.now()}`,
          type: "project",
          projectId: project.id,
          projectName: project.name,
          recipientId: "",
          recipientName: "",
          recipientEmail: inviteEmail,
          senderId: currentUser?.id || "",
          senderName: currentUser?.name || "",
          senderAvatar: currentUser?.avatar || "",
          senderInitials: currentUser?.initials || "",
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      )
    }

    setInviteDialogOpen(false)
    setInviteEmail("")
    setSelectedUserToInvite("")
  }

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (
      taskFilters.search &&
      !task.title.toLowerCase().includes(taskFilters.search.toLowerCase()) &&
      !task.description.toLowerCase().includes(taskFilters.search.toLowerCase())
    ) {
      return false
    }

    // Status filter
    if (taskFilters.status && taskFilters.status !== "all" && task.status !== taskFilters.status) {
      return false
    }

    // Priority filter
    if (taskFilters.priority && taskFilters.priority !== "all" && task.priority !== taskFilters.priority) {
      return false
    }

    // Assignee filter
    if (taskFilters.assignee && taskFilters.assignee !== "all" && task.assignee.id !== taskFilters.assignee) {
      return false
    }

    // Task Type filter
    if (taskFilters.taskType && taskFilters.taskType !== "all" && task.taskType !== taskFilters.taskType) {
      return false
    }

    return true
  })

  // Calculate project statistics
  const openTasks = tasks?.filter((task) => task.status === "to-do").length || 0
  const inProgressTasks = tasks?.filter((task) => task.status === "in-progress").length || 0
  const reviewTasks = tasks?.filter((task) => task.status === "review").length || 0
  const completedTasks = tasks?.filter((task) => task.status === "done").length || 0

  // Get users not in the project team
  const usersNotInTeam = users.filter(
    (user) => !project.team.some((member) => member.name === user.name) && user.id !== currentUser?.id,
  )

  // Helper function to get task type icon
  const getTaskTypeIcon = (taskType: TaskType) => {
    switch (taskType) {
      case "bug":
        return <Bug className="h-4 w-4 text-red-500" />
      case "feature":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "story":
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case "subtask":
        return <GitBranch className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{project.name}</h1>
          <Badge
            className={`ml-2 ${
              project.status === "Completed"
                ? "bg-[var(--fixed-success)] text-white"
                : project.status === "In Progress"
                  ? "bg-[var(--fixed-primary)] text-white"
                  : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
            }`}
          >
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
          <Link href={`/projects/${projectId}/status-management`}>
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)] bg-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Statuses
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-danger)]"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="fixed-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                    Project details and progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-[var(--fixed-sidebar-fg)]">{project.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>Overall Completion</div>
                    <div className="font-medium">{project.progress}%</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[var(--fixed-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--fixed-primary)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col p-3 rounded-md bg-[var(--fixed-secondary)]">
                  <div className="flex items-center text-sm text-[var(--fixed-sidebar-muted)] mb-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Open
                  </div>
                  <div className="text-xl font-bold">{openTasks}</div>
                </div>
                <div className="flex flex-col p-3 rounded-md bg-[var(--fixed-secondary)]">
                  <div className="flex items-center text-sm text-[var(--fixed-sidebar-muted)] mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    In Progress
                  </div>
                  <div className="text-xl font-bold">{inProgressTasks}</div>
                </div>
                <div className="flex flex-col p-3 rounded-md bg-[var(--fixed-secondary)]">
                  <div className="flex items-center text-sm text-[var(--fixed-sidebar-muted)] mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    In Review
                  </div>
                  <div className="text-xl font-bold">{reviewTasks}</div>
                </div>
                <div className="flex flex-col p-3 rounded-md bg-[var(--fixed-secondary)]">
                  <div className="flex items-center text-sm text-[var(--fixed-sidebar-muted)] mb-1">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Completed
                  </div>
                  <div className="text-xl font-bold">{completedTasks}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="fixed-card">
            <CardHeader className="pb-0">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Project Tasks</CardTitle>
                  <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                    All tasks for this project
                  </CardDescription>
                </div>
                <Button
                  className="bg-[var(--fixed-primary)] text-white"
                  size="sm"
                  onClick={() => setCreateTaskDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      placeholder="Search tasks..."
                      value={taskFilters.search}
                      onChange={(e) => setTaskFilters({ ...taskFilters, search: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Select
                      value={taskFilters.status}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="to-do">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">In Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={taskFilters.priority}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={taskFilters.taskType}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, taskType: value })}
                    >
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Task Type" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="bug">
                          <div className="flex items-center">
                            <Bug className="h-4 w-4 mr-2 text-red-500" />
                            Bug
                          </div>
                        </SelectItem>
                        <SelectItem value="feature">
                          <div className="flex items-center">
                            <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                            Feature
                          </div>
                        </SelectItem>
                        <SelectItem value="story">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                            Story
                          </div>
                        </SelectItem>
                        <SelectItem value="subtask">
                          <div className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-2 text-gray-500" />
                            Subtask
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-[var(--fixed-secondary)] text-sm font-medium">
                    <div className="col-span-5 md:col-span-5 flex items-center">
                      <span>Task</span>
                      <ArrowUpDown className="ml-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                    </div>
                    <div className="col-span-2 hidden md:flex items-center">
                      <span>Type</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex items-center">
                      <span>Status</span>
                    </div>
                    <div className="col-span-2 hidden md:flex items-center">
                      <span>Priority</span>
                    </div>
                    <div className="col-span-3 md:col-span-2 flex items-center">
                      <span>Assignee</span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <span className="sr-only">Actions</span>
                    </div>
                  </div>

                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-[var(--fixed-secondary)] transition-colors"
                      >
                        <div className="col-span-5 md:col-span-5">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="font-medium hover:underline text-[var(--fixed-primary)]"
                          >
                            {task.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {task.taskNumber}
                            </Badge>
                            <p className="text-xs text-[var(--fixed-sidebar-muted)] truncate">
                              {task.description.substring(0, 50)}
                              {task.description.length > 50 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 hidden md:flex items-center">
                          <div className="flex items-center gap-1">
                            {getTaskTypeIcon(task.taskType)}
                            <span className="capitalize">{task.taskType}</span>
                          </div>
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <Badge
                            className={`
                              ${task.status === "to-do" ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]" : ""}
                              ${task.status === "in-progress" ? "bg-[var(--fixed-primary)] text-white" : ""}
                              ${task.status === "review" ? "bg-[var(--fixed-warning)] text-white" : ""}
                              ${task.status === "done" ? "bg-[var(--fixed-success)] text-white" : ""}
                            `}
                          >
                            {task.status === "to-do"
                              ? "To Do"
                              : task.status === "in-progress"
                                ? "In Progress"
                                : task.status === "review"
                                  ? "In Review"
                                  : "Done"}
                          </Badge>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <Badge
                            className={`
                              ${task.priority === "High" ? "bg-[var(--fixed-danger)] text-white" : ""}
                              ${task.priority === "Medium" ? "bg-[var(--fixed-warning)] text-white" : ""}
                              ${task.priority === "Low" ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]" : ""}
                            `}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="col-span-3 md:col-span-2 flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate">{task.assignee.name}</span>
                        </div>
                        <div className="col-span-1 flex items-center justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/tasks/${task.id}`} className="flex items-center cursor-pointer">
                                  <FileText className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/tasks/${task.id}/edit`} className="flex items-center cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task)
                                  setDeleteTaskDialogOpen(true)
                                }}
                                className="text-[var(--fixed-danger)]"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-[var(--fixed-sidebar-muted)]">No tasks found matching your filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="fixed-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription className="text-[var(--fixed-sidebar-muted)]">Project team members</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                onClick={() => setInviteDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                    </div>
                  </div>
                ))}

                {project.team.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-[var(--fixed-sidebar-muted)]">No team members assigned.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="fixed-card">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-[var(--fixed-primary)] text-white" asChild>
                <Link href={`/tasks?project=${projectId}`}>View All Tasks</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                onClick={() => setCreateTaskDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Task
              </Button>
              <Button
                variant="outline"
                className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                onClick={() => setInviteDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team Members
              </Button>
              <Button
                variant="outline"
                className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                asChild
              >
                <Link href={`/projects/${projectId}/status-management`} className="flex items-center justify-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Task Statuses
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <EditProjectDialog projectId={projectId} open={editDialogOpen} onOpenChange={setEditDialogOpen} />

      {/* Delete Project Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-[var(--fixed-danger)] text-white hover:bg-[var(--fixed-danger)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Task Dialog */}
      <CreateTaskDialog open={createTaskDialogOpen} onOpenChange={setCreateTaskDialogOpen} parentTaskId={undefined} />

      {/* Delete Task Confirmation Dialog */}
      <AlertDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-[var(--fixed-danger)] text-white hover:bg-[var(--fixed-danger)]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleInviteUser}>
            <DialogHeader>
              <DialogTitle>Invite Team Members</DialogTitle>
              <DialogDescription>
                Invite users to join this project. You can select existing users or invite by email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="user-select">Select User</Label>
                <Select
                  value={selectedUserToInvite}
                  onValueChange={(value) => {
                    setSelectedUserToInvite(value)
                    setInviteEmail("")
                  }}
                >
                  <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersNotInTeam.length > 0 ? (
                      usersNotInTeam.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>
                        No available users to invite
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[var(--fixed-card-border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[var(--fixed-sidebar-muted)]">Or invite by email</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email-invite">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email-invite"
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value)
                      setSelectedUserToInvite("")
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedUserToInvite && !inviteEmail}>
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
