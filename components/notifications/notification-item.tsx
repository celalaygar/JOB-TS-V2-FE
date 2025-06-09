"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  MoreHorizontal,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { NotificationDetailsDialog } from "./notification-details-dialog" // Import NotificationDetailsDialog

interface NotificationItemProps {
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
  onMarkAsRead: () => void
  onDelete: () => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const handleClick = () => {
    if (!notification.read) {
      setShowDetailsDialog(true)
    } else {
      // For read notifications, navigate directly to the issue
      router.push(`/issues?issue=${notification.issueId}`)
    }
  }

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

  return (
    <>
      <div
        className={`
          p-4 rounded-lg border transition-colors cursor-pointer
          ${notification.read
            ? "border-[var(--fixed-card-border)] bg-[var(--fixed-card-bg)]"
            : "border-[var(--fixed-primary)] bg-[var(--fixed-primary)]/5"
          }
        `}
        onClick={handleClick}
      >
        <div className="flex items-start gap-4">
          <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className={`font-medium ${!notification.read ? "text-[var(--fixed-primary)]" : ""}`}>
                  {notification.title}
                </h3>
                <p className="text-sm text-[var(--fixed-sidebar-muted)] mt-1 line-clamp-2">{notification.message}</p>
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && <Badge className="bg-[var(--fixed-primary)] text-white">New</Badge>}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onMarkAsRead()
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/issues?issue=${notification.issueId}`)
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-[var(--fixed-danger)]"
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmDelete(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.name} />
                  <AvatarFallback>{notification.sender.initials}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{notification.sender.name}</span>
              </div>

              <div className="text-xs text-[var(--fixed-sidebar-muted)]">
                {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
              </div>

              <div className="text-xs text-[var(--fixed-sidebar-muted)] truncate">Issue: {notification.issueTitle}</div>
            </div>
          </div>
        </div>
      </div>

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
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
                setConfirmDelete(false)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NotificationDetailsDialog
        notification={notification}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
      />
    </>
  )
}
