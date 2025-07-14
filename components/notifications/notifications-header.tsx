"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCheck, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { markAllAsRead, deleteAllRead } from "@/lib/redux/features/notifications-slice"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Invitation } from "@/types/invitation"

interface NotificationsHeaderProps {
  filter: "all" | "unread" | "mentions" | "invitations"
  onFilterChange: (filter: "all" | "unread" | "mentions" | "invitations") => void
  searchQuery: string
  onSearchChange: (query: string) => void
  invitationCount?: number
}

export function NotificationsHeader({ invitationCount, filter, onFilterChange, searchQuery, onSearchChange }: NotificationsHeaderProps) {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  const unreadCount = notifications.filter((n) => !n.read).length
  const mentionsCount = notifications.filter((n) => n.type === "mention").length

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleDeleteAllRead = () => {
    dispatch(deleteAllRead())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-[var(--fixed-sidebar-muted)]">Stay updated on task changes, comments, and mentions.</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                disabled={notifications.filter((n) => n.read).length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Read
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Read Notifications</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all read notifications. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteAllRead}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <div className="flex overflow-x-auto sm:overflow-visible bg-[var(--fixed-secondary)] rounded-md p-1 text-sm font-medium">
            <div
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-sm cursor-pointer transition-colors whitespace-nowrap text-center
        ${filter === "all" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => onFilterChange("all")}
            >
              All
            </div>
            <div
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-sm cursor-pointer transition-colors whitespace-nowrap text-center
        ${filter === "unread" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => onFilterChange("unread")}
            >
              Unread ({unreadCount})
            </div>
            <div
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-sm cursor-pointer transition-colors whitespace-nowrap text-center
        ${filter === "mentions" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => onFilterChange("mentions")}
            >
              Mentions ({mentionsCount})
            </div>
            <div
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-sm cursor-pointer transition-colors whitespace-nowrap text-center
        ${filter === "invitations" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => onFilterChange("invitations")}
            >
              Invitations ({invitationCount})
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
          <Input
            type="search"
            placeholder="Search notifications..."
            className="w-full pl-8 border-[var(--fixed-card-border)]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
