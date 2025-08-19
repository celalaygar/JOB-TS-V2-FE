"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateTask } from "@/lib/redux/features/tasks-slice"
import type { RootState } from "@/lib/redux/store"

interface AssignTaskToUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    taskId: string
    sprintId: string
}

export function AssignTaskToUserDialog({ open, onOpenChange, taskId, sprintId }: AssignTaskToUserDialogProps) {
    const dispatch = useDispatch()
    const task = useSelector((state: RootState) => state.tasks.tasks.find((t) => t.id === taskId))
    const users = useSelector((state: RootState) => state.users.users)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    useEffect(() => {
        if (task && task.assignee) {
            setSelectedUserId(task.assignee)
        } else {
            setSelectedUserId(null)
        }
    }, [task])

    const filteredUsers = users.filter((user) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query)
        )
    })

    const handleAssign = () => {
        if (!task) return

        const updatedTask = {
            ...task,
            assignee: selectedUserId || undefined,
            updatedAt: new Date().toISOString(),
        }

        dispatch(updateTask(updatedTask))
        onOpenChange(false)
    }

    if (!task) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Assign Task to User</DialogTitle>
                    <DialogDescription>Assign the task "{task.title}" to a user from your team.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search Users</Label>
                        <Input
                            id="search"
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[300px] rounded-md border p-2">
                        <div className="space-y-2">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center space-x-3 rounded-md p-2 cursor-pointer ${selectedUserId === user.id ? "bg-primary/10" : "hover:bg-muted"
                                            }`}
                                        onClick={() => setSelectedUserId(user.id)}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                            <AvatarFallback>{user.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        {user.role && <div className="rounded-full bg-muted px-2 py-1 text-xs">{user.role}</div>}
                                    </div>
                                ))
                            ) : (
                                <div className="flex h-full items-center justify-center p-4">
                                    <p className="text-sm text-muted-foreground">No users found</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAssign}>Assign User</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}