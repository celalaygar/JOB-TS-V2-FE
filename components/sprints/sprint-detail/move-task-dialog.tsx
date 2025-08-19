"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { tasks as dummyTasks } from "@/data/tasks"

interface MoveTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    taskId: string
}

export function MoveTaskDialog({ open, onOpenChange, taskId }: MoveTaskDialogProps) {
    const dispatch = useDispatch()
    const sprints = useSelector((state: RootState) => state.sprints.sprints)

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
                sprint: dummyTask.sprint,
            }
            : null)

    const [destination, setDestination] = useState<string | null>(null)

    useEffect(() => {
        if (task) {
            setDestination(task.sprint || null)
        }
    }, [task])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!task) return

        // If it's a Redux task, update it in Redux
        if (reduxIssue) {
            dispatch(
                updateIssue({
                    id: taskId,
                    changes: {
                        sprint: destination,
                        updatedAt: new Date().toISOString(),
                    },
                }),
            )
        } else {
            // For demo purposes, we'll just close the dialog
            // In a real app, you would update the task in your data source
            console.log("Task moved:", {
                id: taskId,
                destination,
            })
        }

        onOpenChange(false)
    }

    if (!task) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Move Task</DialogTitle>
                        <DialogDescription>Move this task to another sprint or to the backlog.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="mb-4">
                            <h3 className="text-sm font-medium">Task</h3>
                            <p className="text-sm text-muted-foreground">{task.title}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="destination">Destination</Label>
                            <Select
                                value={destination || "backlog"}
                                onValueChange={(value) => setDestination(value === "backlog" ? null : value)}
                            >
                                <SelectTrigger id="destination">
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="backlog">Backlog</SelectItem>
                                    {sprints.map((sprint) => (
                                        <SelectItem key={sprint.id} value={sprint.id}>
                                            {sprint.name} ({sprint.status})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[var(--fixed-primary)] text-white">
                            Move Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}