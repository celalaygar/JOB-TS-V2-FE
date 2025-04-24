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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  Trash2,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  UserPlus,
  Bug,
  Lightbulb,
  BookOpen,
  GitBranch,
  Filter,
  ShieldCheck,
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
import { ProjectRolesManagement } from "@/components/projects/project-roles/project-roles-management"
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

  const [activeTab, setActiveTab] = useState("overview")
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
                  : ""
            }`}
          >
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("roles")}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Manage Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-500 focus:text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Information about the project.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Description</p>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Start Date</p>
                <p className="text-sm text-muted-foreground">{project.startDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">End Date</p>
                <p className="text-sm text-muted-foreground">{project.endDate}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Statistics</CardTitle>
              <CardDescription>Overview of project progress.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-2xl font-bold">{openTasks}</p>
                <p className="text-sm text-muted-foreground">Open Tasks</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-2xl font-bold">{inProgressTasks}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-2xl font-bold">{reviewTasks}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1">
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Tasks</h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCreateTaskDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <div className="px-2 py-1">
                    <h4 className="mb-2 text-sm font-medium">Search</h4>
                    <Input
                      type="search"
                      placeholder="Search tasks..."
                      value={taskFilters.search}
                      onChange={(e) => setTaskFilters({ ...taskFilters, search: e.target.value })}
                    />
                  </div>
                  <div className="px-2 py-1">
                    <h4 className="mb-2 text-sm font-medium">Status</h4>
                    <Select
                      value={taskFilters.status}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, status: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="to-do">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="px-2 py-1">
                    <h4 className="mb-2 text-sm font-medium">Priority</h4>
                    <Select
                      value={taskFilters.priority}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, priority: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="px-2 py-1">
                    <h4 className="mb-2 text-sm font-medium">Assignee</h4>
                    <Select
                      value={taskFilters.assignee}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, assignee: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {project.team.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="px-2 py-1">
                    <h4 className="mb-2 text-sm font-medium">Task Type</h4>
                    <Select
                      value={taskFilters.taskType}
                      onValueChange={(value) => setTaskFilters({ ...taskFilters, taskType: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select task type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="subtask">Subtask</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{task.title}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTask(task)
                            setEditTaskDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTask(task)
                            setDeleteTaskDialogOpen(true)
                          }}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardDescription>{task.description}</CardDescription>
                  <div className="flex items-center gap-2">
                    {getTaskTypeIcon(task.taskType)}
                    <Badge variant="secondary">{task.taskType}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{task.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{task.priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Team Members</h2>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {project.team.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <span>{member.email}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <ProjectRolesManagement projectId={projectId} />
        </TabsContent>
      </Tabs>

      <EditProjectDialog open={editDialogOpen} setOpen={setEditDialogOpen} project={project} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CreateTaskDialog open={createTaskDialogOpen} setOpen={setCreateTaskDialogOpen} projectId={projectId} />

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite User to Project</DialogTitle>
            <DialogDescription>Invite a user to join the project team.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Select User
                </Label>
                <Select value={selectedUserToInvite} onValueChange={setSelectedUserToInvite}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {usersNotInTeam.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Or enter email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Invite User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTaskDialogOpen} onOpenChange={setDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task and remove all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
