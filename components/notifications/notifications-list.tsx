"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { markAsRead, deleteNotification } from "@/lib/redux/features/notifications-slice"
import { NotificationItem } from "@/components/notifications/notification-item"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"

interface NotificationsListProps {
  filter: "all" | "unread" | "mentions"
  searchQuery: string
}

export function NotificationsList({ filter, searchQuery }: NotificationsListProps) {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  // Apply filters
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by type
    if (filter === "unread" && notification.read) return false
    if (filter === "mentions" && notification.type !== "mention") return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.issueTitle.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort by date (newest first)
  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id))
  }

  if (sortedNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-[var(--fixed-secondary)] p-4 rounded-full mb-4">
          <Inbox className="h-8 w-8 text-[var(--fixed-sidebar-muted)]" />
        </div>
        <h3 className="text-lg font-medium mb-1">No notifications found</h3>
        <p className="text-[var(--fixed-sidebar-muted)] max-w-md">
          {filter === "all"
            ? "You don't have any notifications yet. They'll appear here when you receive them."
            : filter === "unread"
              ? "You don't have any unread notifications. Great job staying on top of things!"
              : "You don't have any mentions. When someone mentions you, it will appear here."}
        </p>
        {filter !== "all" && (
          <Button
            variant="outline"
            className="mt-4 border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
            onClick={() => window.location.reload()}
          >
            View all notifications
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={() => handleMarkAsRead(notification.id)}
          onDelete={() => handleDelete(notification.id)}
        />
      ))}
    </div>
  )
}
