"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { CalendarDays, Clock } from "lucide-react"
import { tasks as dummyTasks } from "@/data/tasks"

interface ViewTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    taskId: string
}

export function ViewTaskDialog({ open, onOpenChange, taskId }: ViewTaskDialogProps) {
    // First try to find the task in the Redux store
    const reduxIssue = useSelector((state: RootState) => state.issues.issues.find((issue) => issue.id === taskId))

    // If not found in Redux, look in the dummy tasks
    const dummyTask = dummyTasks.find((task) => task.id === taskId)

    // Combine the data sources
    const task =
        reduxIssue ||
        (dummyTask
            ? {
                id: dummyTask.id,
                title: dummyTask.title,
                description: dummyTask.description,
                type: dummyTask.taskType,
                status: dummyTask.status,
                priority: dummyTask.priority.toLowerCase(),
                assignee: dummyTask.assignee?.id,
                createdAt: dummyTask.createdAt || new Date().toISOString(),
                updatedAt: dummyTask.updatedAt || new Date().toISOString(),
            }
            : null)

    const users = useSelector((state: RootState) => state.users.users)
    const assignedUser = task?.assignee ? users.find((user) => user.id === task.assignee) : null

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "todo":
            case "to-do":
                return "bg-slate-500"
            case "in-progress":
                return "bg-blue-500"
            case "review":
                return "bg-purple-500"
            case "done":
                return "bg-green-500"
            default:
                return "bg-slate-500"
        }
    }

    // Get priority badge color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low":
                return "bg-slate-500"
            case "medium":
                return "bg-blue-500"
            case "high":
                return "bg-amber-500"
            case "critical":
                return "bg-red-500"
            default:
                return "bg-slate-500"
        }
    }

    // Get type badge color
    const getTypeColor = (type: string) => {
        switch (type) {
            case "bug":
                return "bg-red-500"
            case "feature":
                return "bg-green-500"
            case "task":
                return "bg-blue-500"
            case "improvement":
                return "bg-purple-500"
            default:
                return "bg-slate-500"
        }
    }

    if (!task) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl">{task.title}</DialogTitle>
                        <div className="flex items-center gap-2">
                            <Badge className={`${getTypeColor(task.type)} text-white`}>
                                {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                            </Badge>
                            <Badge className={`${getStatusColor(task.status)} text-white`}>
                                {task.status === "todo"
                                    ? "To Do"
                                    : task.status === "in-progress"
                                        ? "In Progress"
                                        : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            </Badge>
                            <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground">Task ID: {task.id}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Description</h3>
                        <div className="text-sm rounded-md bg-muted p-3">{task.description || "No description provided."}</div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium mb-2">Assignee</h3>
                            {assignedUser ? (
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={assignedUser.avatar || "/placeholder.svg"} alt={assignedUser.name} />
                                        <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm">{assignedUser.name}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">Unassigned</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-2">Created</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>
                                    {new Date(task.createdAt || new Date()).toLocaleDateString()} at{" "}
                                    {new Date(task.createdAt || new Date()).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Updated */}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Last Updated</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                                {new Date(task.updatedAt || new Date()).toLocaleDateString()} at{" "}
                                {new Date(task.updatedAt || new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}