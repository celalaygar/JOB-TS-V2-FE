"use client"
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
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { removeIssue } from "@/lib/redux/features/issues-slice"
import { tasks as dummyTasks } from "@/data/tasks"

interface DeleteTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    taskId: string
}

export function DeleteTaskDialog({ open, onOpenChange, taskId }: DeleteTaskDialogProps) {
    const dispatch = useDispatch()

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
            }
            : null)

    const handleDelete = () => {
        if (reduxIssue) {
            dispatch(removeIssue(taskId))
        } else {
            // For demo purposes, we'll just close the dialog
            // In a real app, you would delete the task from your data source
            console.log("Task deleted:", taskId)
        }

        onOpenChange(false)
    }

    if (!task) return null

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task
                        <span className="font-medium"> {task.title}</span> from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}