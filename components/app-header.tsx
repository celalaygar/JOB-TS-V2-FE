"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/lib/redux/features/auth-slice"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { updateProject } from "@/lib/redux/features/projects-slice"
import type { RootState } from "@/lib/redux/store"
import { InvitationDetailsDialog } from "@/components/notifications/invitation-details-dialog"
import { NotificationDetailsDialog } from "@/components/notifications/notification-details-dialog"
import { HeaderSearch } from "./header/header-search"
import { HeaderActions } from "./header/header-actions"
import { Invitation } from "@/types/invitation"

export function AppHeader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"notifications" | "invitations">("notifications")
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const { toggleSidebar } = useSidebar()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const notifications = useSelector((state: RootState) => state.notifications.notifications)
  const invitations = useSelector((state: RootState) => state.invitations.invitations)
  const projects = useSelector((state: RootState) => state.projects.projects)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const pendingInvitations = invitations.filter((inv) => inv.status === "pending")



  const totalUnread = unreadNotifications.length + pendingInvitations.length


  const handleAcceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId)
    if (invitation && currentUser) {
      dispatch(updateInvitationStatus({ id: invitationId, status: "accepted" }))

      const project = projects.find((p) => p.id === invitation.projectId)
      if (project) {
        const isAlreadyInTeam = project.team.some((member) => member.name === currentUser.name)
        if (!isAlreadyInTeam) {
          const updatedTeam = [
            ...project.team,
            {
              name: currentUser.name,
              avatar: currentUser.avatar || "/placeholder.svg",
              initials: currentUser.initials || currentUser.name.substring(0, 2).toUpperCase(),
            },
          ]
          dispatch(updateProject({ id: project.id, changes: { team: updatedTeam } }))
        }
      }
    }
  }

  const handleDeclineInvitation = (invitationId: string) => {
    dispatch(updateInvitationStatus({ id: invitationId, status: "declined" }))
  }

  const handleRemoveInvitation = (invitationId: string) => {
    dispatch(removeInvitation(invitationId))
  }

  const handleMarkNotificationAsRead = (notificationId: string) => {
    // Add your notification mark as read logic here
    // dispatch(markNotificationAsRead(notificationId))
  }

  const handleDeleteNotification = (notificationId: string) => {
    // Add your notification delete logic here
    // dispatch(deleteNotification(notificationId))
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 fixed-header border-b px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden text-[var(--fixed-header-fg)]" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <HeaderSearch
        className="flex-1 md:grow-0 md:w-64 lg:w-80"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <HeaderActions />

      {selectedNotification && (
        <NotificationDetailsDialog
          notification={selectedNotification}
          open={!!selectedNotification}
          onOpenChange={(open) => {
            if (!open) setSelectedNotification(null)
          }}
          onMarkAsRead={() => {
            handleMarkNotificationAsRead(selectedNotification.id)
            setSelectedNotification(null)
          }}
          onDelete={() => {
            handleDeleteNotification(selectedNotification.id)
            setSelectedNotification(null)
          }}
        />
      )}
    </header>
  )
}
