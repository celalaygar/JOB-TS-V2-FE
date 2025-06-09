"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/lib/redux/features/auth-slice"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { updateProject } from "@/lib/redux/features/projects-slice"
import type { RootState } from "@/lib/redux/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { LanguageSelector } from "@/components/language-selector"
import { InvitationDetailsDialog } from "@/components/notifications/invitation-details-dialog"
import { NotificationDetailsDialog } from "@/components/notifications/notification-details-dialog"

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
  const recentNotifications = notifications.slice(0, 5)
  const recentInvitations = invitations.slice(0, 5)

  const totalUnread = unreadNotifications.length + pendingInvitations.length

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

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
      <div className="flex-1 md:grow-0 md:w-64 lg:w-80">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-[var(--fixed-background)] pl-8 md:w-[200px] lg:w-[300px] border-[var(--fixed-card-border)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LanguageSelector />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-[var(--fixed-header-fg)]">
              <Bell className="h-5 w-5" />
              {totalUnread > 0 && (
                <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-[var(--fixed-primary)] text-white text-[10px]">
                  {totalUnread}
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
                Invitations ({pendingInvitations.length})
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
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-[var(--fixed-primary)]"></div>
                            )}
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
              ) : recentInvitations.length > 0 ? (
                recentInvitations.map((invitation) => (
                  <DropdownMenuItem
                    key={invitation.id}
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => setSelectedInvitation(invitation)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={invitation.senderAvatar || "/placeholder.svg"} alt={invitation.senderName} />
                        <AvatarFallback>{invitation.senderInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{invitation.projectName}</p>
                          {invitation.status === "pending" && (
                            <div className="h-2 w-2 rounded-full bg-[var(--fixed-warning)]"></div>
                          )}
                        </div>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] truncate">
                          Invitation from {invitation.senderName}
                        </p>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] mt-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full h-8 w-8 border border-[var(--fixed-card-border)]"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name || "User"} />
                <AvatarFallback>{currentUser?.initials || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedInvitation && (
        <InvitationDetailsDialog
          invitation={selectedInvitation}
          open={!!selectedInvitation}
          onOpenChange={(open) => {
            if (!open) setSelectedInvitation(null)
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
          currentUser={currentUser}
        />
      )}
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
