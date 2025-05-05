"use client"

import { useState } from "react"
import { NotificationsHeader } from "@/components/notifications/notifications-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { InvitationsList } from "@/components/notifications/invitations-list"

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread" | "mentions" | "invitations">("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <NotificationsHeader
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filter === "invitations" ? (
        <InvitationsList searchQuery={searchQuery} />
      ) : (
        <NotificationsList filter={filter} searchQuery={searchQuery} />
      )}
    </div>
  )
}
