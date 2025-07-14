"use client"

import { use, useCallback, useEffect, useState } from "react"
import { NotificationsHeader } from "@/components/notifications/notifications-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { InvitationsList } from "@/components/notifications/invitations-list"
import { InvitationStatus, Invitation } from "@/types/invitation"
import { getAllInvitationsByPendingHelper, getAllInvitationsCountByInvitationStatusHelper } from "@/lib/service/api-helpers"

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread" | "mentions" | "invitations">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false)
  const [invitationCount, setInvitationCount] = useState<number>(0)


  const getAllInvitationsCount = useCallback(async () => {
    const response: number | null = await getAllInvitationsCountByInvitationStatusHelper(InvitationStatus.PENDING, {
      setLoading: setNotificationLoading
    })
    if (typeof response === "number") {
      setInvitationCount((prevCount) => prevCount + response)
    }
  }, [])

  useEffect(() => {
    getAllInvitationsCount()
  }, [getAllInvitationsCount])

  return notificationLoading ?
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
    :
    <>

      <div className="space-y-6">
        <NotificationsHeader
          invitationCount={invitationCount}
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filter === "invitations" ? (
          <InvitationsList
            searchQuery={searchQuery} />
        ) : (
          <NotificationsList filter={filter} searchQuery={searchQuery} />
        )}
      </div>
    </>

}
