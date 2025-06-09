"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
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
import {
    MessageSquare,
    AtSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Check,
    Trash2,
    ExternalLink,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NotificationDetailsDialogProps {
    notification: {
        id: string
        type: "comment" | "mention" | "status" | "assignment" | "due_date"
        title: string
        message: string
        issueId: string
        issueTitle: string
        sender: {
            id: string
            name: string
            avatar: string
            initials: string
        }
        date: string
        read: boolean
    }
    open: boolean
    onOpenChange: (open: boolean) => void
    onMarkAsRead: () => void
    onDelete: () => void
}

export function NotificationDetailsDialog({
    notification,
    open,
    onOpenChange,
    onMarkAsRead,
    onDelete,
}: NotificationDetailsDialogProps) {
    const router = useRouter()
    const [confirmDelete, setConfirmDelete] = useState(false)

    // Get icon based on notification type
    const getIcon = () => {
        switch (notification.type) {
            case "comment":
                return <MessageSquare className="h-5 w-5 text-blue-500" />
            case "mention":
                return <AtSign className="h-5 w-5 text-purple-500" />
            case "status":
                if (notification.message.includes("Done")) {
                    return <CheckCircle2 className="h-5 w-5 text-green-500" />
                } else if (notification.message.includes("In Progress")) {
                    return <Clock className="h-5 w-5 text-blue-500" />
                } else if (notification.message.includes("Review")) {
                    return <FileText className="h-5 w-5 text-orange-500" />
                } else {
                    return <AlertCircle className="h-5 w-5 text-gray-500" />
                }
            case "assignment":
                return <FileText className="h-5 w-5 text-green-500" />
            case "due_date":
                return <Clock className="h-5 w-5 text-red-500" />
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />
        }
    }

    const handleViewIssue = () => {
        router.push(`/issues?issue=${notification.issueId}`)
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">{getIcon()}</div>
                            <span>{notification.title}</span>
                            {!notification.read && <Badge className="bg-[var(--fixed-primary)] text-white ml-2">New</Badge>}
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.name} />
                                <AvatarFallback>{notification.sender.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{notification.sender.name}</p>
                                <p className="text-sm text-[var(--fixed-sidebar-muted)]">Sender</p>
                            </div>
                        </div>

                        <div className="border-t border-[var(--fixed-card-border)] pt-4">
                            <h4 className="text-sm font-medium mb-1">Message</h4>
                            <p className="text-[var(--fixed-sidebar-fg)]">{notification.message}</p>
                        </div>

                        <div className="border-t border-[var(--fixed-card-border)] pt-4">
                            <h4 className="text-sm font-medium mb-1">Related Task</h4>
                            <p className="text-[var(--fixed-sidebar-fg)]">{notification.issueTitle}</p>
                        </div>
                    </div>

                    <DialogFooter className="flex sm:justify-between gap-2 mt-6">
                        <div className="flex gap-2">
                            {!notification.read && (
                                <Button variant="outline" onClick={onMarkAsRead}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as read
                                </Button>
                            )}
                            <Button variant="outline" className="text-[var(--fixed-danger)]" onClick={() => setConfirmDelete(true)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                        <Button onClick={handleViewIssue}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View task
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this notification? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-[var(--fixed-danger)] text-white"
                            onClick={() => {
                                onDelete()
                                setConfirmDelete(false)
                                onOpenChange(false)
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
