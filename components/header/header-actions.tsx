"use client"

import { LanguageSelector } from "@/components/language-selector"
import { NotificationsDropdown } from "./notifications-dropdown"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { useCallback, useEffect, useState } from "react"
import { getAllInvitationsCountByInvitationStatusHelper } from "@/lib/service/api-helpers"
import { Invitation, InvitationStatus } from "@/types/invitation"

interface HeaderActionsProps {
}

export function HeaderActions({ }: HeaderActionsProps) {


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


  return (
    <div className="ml-auto flex items-center gap-2">
      <LanguageSelector />
      <NotificationsDropdown
        invitationCount={invitationCount}
        notificationLoading={notificationLoading}
      />
      <UserProfileDropdown />
    </div>
  )
}
