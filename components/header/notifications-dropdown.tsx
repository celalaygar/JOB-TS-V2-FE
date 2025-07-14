"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector, useDispatch } from "react-redux"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { updateProject } from "@/lib/redux/features/projects-slice"
import type { RootState } from "@/lib/redux/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { InvitationDetailsDialog } from "@/components/notifications/invitation-details-dialog"
import { NotificationDetailsDialog } from "@/components/notifications/notification-details-dialog"
import { getAllInvitationsByPendingHelper } from "@/lib/service/api-helpers"
import { Invitation, InvitationStatus } from "@/types/invitation"
import { useAuthUser } from "@/lib/hooks/useAuthUser"

interface NotificationsDropdownProps {
  invitationCount: number
  notificationLoading?: boolean
}


export function NotificationsDropdown({ invitationCount, notificationLoading }: NotificationsDropdownProps) {
  const router = useRouter()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<"notifications" | "invitations">("notifications")
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const authUser = useAuthUser();
  const notifications = useSelector((state: RootState) => state.notifications.notifications)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const [isOpenInvitationDetails, setIsOpenInvitationDetails] = useState(false)

  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(false)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const pendingInvitations = invitations.filter((inv) => inv.status === InvitationStatus.PENDING)
  const recentNotifications = notifications.slice(0, 5)

  const getAllInvitationsByPending = useCallback(async () => {
    setInvitations([]);
    const invitationsData: Invitation[] | null = await getAllInvitationsByPendingHelper({ setLoading });
    if (invitationsData) {
      setInvitations(invitationsData);
    }
  }, [])

  useEffect(() => {
    getAllInvitationsByPending()
  }, [getAllInvitationsByPending])


  const totalUnread = unreadNotifications.length + pendingInvitations.length

  const handleAcceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId)
    if (invitation && authUser?.user) {
      dispatch(updateInvitationStatus({ id: invitationId, status: "accepted" }))

      const project = projects.find((p) => p.id === invitation.projectId)
      if (project) {
        const isAlreadyInTeam = project.team.some((member) => member.name === authUser?.user.name)
        if (!isAlreadyInTeam) {
          const updatedTeam = [
            ...project.team,
            {
              name: authUser?.user.name,
              avatar: authUser?.user.avatar || "/placeholder.svg",
              initials: authUser?.user.initials || authUser?.user.name.substring(0, 2).toUpperCase(),
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

  const openInvitationDetailDialog = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setIsOpenInvitationDetails(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-[var(--fixed-header-fg)]">
            <Bell className="h-5 w-5" />
            {invitationCount > 0 && (
              <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-[var(--fixed-primary)] text-white text-[10px]">
                {invitationCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {totalUnread > 0 && <Badge className="bg-[var(--fixed-primary)] text-white">{totalUnread} new</Badge>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Tab Navigation */}
          <div className="flex bg-[var(--fixed-secondary)] rounded-md p-1 m-2 text-sm font-medium">
            <div
              className={`flex-1 px-3 py-1.5 rounded-sm cursor-pointer transition-colors text-center
                ${activeTab === "notifications" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications ({unreadNotifications.length})
            </div>
            <div
              className={`flex-1 px-3 py-1.5 rounded-sm cursor-pointer transition-colors text-center
                ${activeTab === "invitations" ? "bg-white text-[var(--fixed-sidebar-fg)] shadow-sm" : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"}`}
              onClick={() => setActiveTab("invitations")}
            >
              Invitations ({invitationCount})
            </div>
          </div>

          <div className="max-h-[300px] overflow-auto">
            {activeTab === "notifications" ? (
              recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={notification.sender.avatar || "/placeholder.svg"}
                          alt={notification.sender.name}
                        />
                        <AvatarFallback>{notification.sender.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${!notification.read ? "text-[var(--fixed-primary)]" : ""}`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-[var(--fixed-primary)]"></div>}
                        </div>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] truncate">{notification.message}</p>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] mt-1">
                          {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">No notifications yet</p>
                </div>
              )
            ) : invitations.length > 0 ? (
              invitations.map((invitation: Invitation) => (
                <DropdownMenuItem
                  key={invitation.id}
                  className="py-2 px-3 cursor-pointer"
                  onClick={() => openInvitationDetailDialog(invitation)}
                >
                  <div className="flex items-start gap-2 w-full ">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={"/placeholder.svg"} alt={invitation.invitedBy.email} />
                      <AvatarFallback>{invitation.senderInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{invitation.project.name}</p>
                        {invitation.status === InvitationStatus.PENDING && (
                          <div className="h-2 w-2 rounded-full bg-[var(--fixed-warning)]"></div>
                        )}
                      </div>
                      <p className="text-xs  hover:text-white truncate">
                        Invitation from {invitation.invitedBy.email}
                      </p>
                      <p className="text-xs  hover:text-white mt-1">
                        {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-[var(--fixed-sidebar-muted)]">No invitations yet</p>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center font-medium" onClick={() => router.push("/notifications")}>
            View all {activeTab}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedInvitation && (
        <InvitationDetailsDialog
          invitation={selectedInvitation}
          open={isOpenInvitationDetails}
          onOpenChange={(open) => {
            if (!open) {
              setIsOpenInvitationDetails(false)
              setSelectedInvitation(null)
            }
          }}
          onResetInvitations={() => {
            setInvitations([])
            getAllInvitationsByPending()
          }}

          onAccept={() => {
            handleAcceptInvitation(selectedInvitation.id)
            setSelectedInvitation(null)
          }}
          onDecline={() => {
            handleDeclineInvitation(selectedInvitation.id)
            setSelectedInvitation(null)
          }}
          onRemove={() => {
            handleRemoveInvitation(selectedInvitation.id)
            setSelectedInvitation(null)
          }}
        />
      )}

    </>
  )
}
