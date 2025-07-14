"use client"

import { use, useCallback, useEffect, useState } from "react"
import { NotificationsHeader } from "@/components/notifications/notifications-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { InvitationsList } from "@/components/notifications/invitations-list"
import { InvitationStatus, Invitation } from "@/types/invitation"
import { getAllInvitationsByPendingHelper } from "@/lib/service/api-helpers"

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread" | "mentions" | "invitations">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)


  const getAllInvitationsByPending = useCallback(async () => {
    setInvitations([]);
    const invitationsData: Invitation[] = await getAllInvitationsByPendingHelper({ setLoading });
    if (invitationsData) {
      setInvitations(invitationsData);
    }
  }, [])

  useEffect(() => {
    getAllInvitationsByPending()
  }, [getAllInvitationsByPending])


  return loading ?
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
    :
    <>

      <div className="space-y-6">
        <NotificationsHeader
          invitations={invitations}
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filter === "invitations" ? (
          <InvitationsList
            invitations={invitations}
            searchQuery={searchQuery} resetPage={getAllInvitationsByPending} />
        ) : (
          <NotificationsList filter={filter} searchQuery={searchQuery} />
        )}
      </div>
    </>

}
