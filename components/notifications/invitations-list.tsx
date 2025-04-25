"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { updateProject } from "@/lib/redux/features/projects-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Mail, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface InvitationsListProps {
  searchQuery: string
}

export function InvitationsList({ searchQuery }: InvitationsListProps) {
  const dispatch = useDispatch()
  const invitations = useSelector((state: RootState) => state.invitations.invitations)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  // Filter invitations based on search query
  const filteredInvitations = invitations.filter((invitation) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        invitation.projectName.toLowerCase().includes(query) ||
        invitation.senderName.toLowerCase().includes(query) ||
        invitation.recipientName.toLowerCase().includes(query) ||
        invitation.recipientEmail.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Sort invitations by date (newest first) and status (pending first)
  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    // Sort by status first (pending comes first)
    if (a.status === "pending" && b.status !== "pending") return -1
    if (a.status !== "pending" && b.status === "pending") return 1

    // Then sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleAcceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId)
    if (invitation && currentUser) {
      // Update invitation status
      dispatch(updateInvitationStatus({ id: invitationId, status: "accepted" }))

      // Find the project
      const project = projects.find((p) => p.id === invitation.projectId)

      if (project) {
        // Add current user to project team if not already there
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

          // Update project with new team member
          dispatch(
            updateProject({
              id: project.id,
              changes: { team: updatedTeam },
            }),
          )
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

  if (sortedInvitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-[var(--fixed-secondary)] p-4 rounded-full mb-4">
          <Mail className="h-8 w-8 text-[var(--fixed-sidebar-muted)]" />
        </div>
        <h3 className="text-lg font-medium mb-1">No invitations found</h3>
        <p className="text-[var(--fixed-sidebar-muted)] max-w-md">
          You don't have any project invitations at the moment. When someone invites you to a project, it will appear
          here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedInvitations.map((invitation) => (
        <Card key={invitation.id} className="fixed-card overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={invitation.senderAvatar} alt={invitation.senderName} />
                  <AvatarFallback>{invitation.senderInitials}</AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">
                    Project Invitation: <span className="text-[var(--fixed-primary)]">{invitation.projectName}</span>
                  </h3>
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                    {invitation.senderName} invited{" "}
                    {invitation.recipientId === currentUser?.id ? "you" : invitation.recipientName} to join this project
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={`
                        ${invitation.status === "pending" ? "bg-[var(--fixed-warning)] text-white" : ""}
                        ${invitation.status === "accepted" ? "bg-[var(--fixed-success)] text-white" : ""}
                        ${invitation.status === "declined" ? "bg-[var(--fixed-danger)] text-white" : ""}
                      `}
                    >
                      {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-[var(--fixed-sidebar-muted)] flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {invitation.status === "pending" && invitation.recipientId === currentUser?.id ? (
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[var(--fixed-card-border)] text-[var(--fixed-danger)]"
                    onClick={() => handleDeclineInvitation(invitation.id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[var(--fixed-success)] text-white hover:bg-[var(--fixed-success)]/90"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                  onClick={() => handleRemoveInvitation(invitation.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
