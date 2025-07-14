"use client"

import { useSelector, useDispatch } from "react-redux"
import { Invitation, InvitationStatus } from "@/lib/redux/features/invitations-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Mail, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { InvitationDetailsDialog } from "./invitation-details-dialog"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import { toast } from "@/hooks/use-toast"
import BaseService from "@/lib/service/BaseService"
import { INVITATION_BY_PENDING, INVITATION_BY_PROJECTID } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"
import { getAllInvitationsByPendingHelper } from "@/lib/service/api-helpers"

interface InvitationsListProps {
  searchQuery: string
}


export function InvitationsList({ searchQuery, }: InvitationsListProps) {
  const dispatch = useDispatch()
  const authUser = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Add this state at the beginning of the InvitationsList component
  const [isOpenInvitationDetails, setIsOpenInvitationDetails] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState<(typeof invitations)[0] | null>(null)

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
    if (a.status === InvitationStatus.PENDING && b.status !== InvitationStatus.PENDING) return -1
    if (a.status !== InvitationStatus.PENDING && b.status === InvitationStatus.PENDING) return 1

    // Then sort by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  /*
  
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
  */


  const getAllInvitationsByPending = async () => {
    setInvitations([]);
    const invitationsData = await getAllInvitationsByPendingHelper({ setLoading });
    if (invitationsData) {
      setInvitations(invitationsData);
    }
  }


  const getAllInvitations = useCallback(async () => {
    await getAllInvitationsByPending()
  }, [])

  useEffect(() => {
    getAllInvitations()
  }, [getAllInvitations])


  const openInvitationDetailDialog = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setIsOpenInvitationDetails(true)
  }

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="space-y-4">
        {!!sortedInvitations && sortedInvitations.map((invitation: Invitation) => (
          <Card
            key={invitation.id}
            className="fixed-card overflow-hidden cursor-pointer hover:border-[var(--fixed-primary)]/50 transition-colors"
            onClick={() => openInvitationDetailDialog(invitation)}
          >
            <CardContent className="p-0">
              <div className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={"/placeholder.svg"} alt={invitation.invitedBy.email} />
                    <AvatarFallback>{invitation.senderInitials}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">
                      Project Invitation: <span className="text-[var(--fixed-primary)]">{invitation.project.name}</span>
                    </h3>
                    <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                      {invitation.invitedBy.email} invited{" "}
                      {invitation.invitedUser.id === authUser?.user.id ? "you" : invitation.invitedUser.email} to join this project
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={`
                        ${invitation.status === InvitationStatus.PENDING ? "bg-[var(--fixed-warning)] text-white" : ""}
                        ${invitation.status === InvitationStatus.ACCEPTED ? "bg-[var(--fixed-success)] text-white" : ""}
                        ${invitation.status === InvitationStatus.DECLINED ? "bg-[var(--fixed-danger)] text-white" : ""}
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

                {invitation.status === InvitationStatus.PENDING && invitation.invitedUser.id === authUser?.user.id ? (
                  <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[var(--fixed-card-border)] text-[var(--fixed-danger)]"
                      onClick={(e) => {
                        e.stopPropagation()
                        openInvitationDetailDialog(invitation)
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[var(--fixed-success)] text-white hover:bg-[var(--fixed-success)]/90"
                      onClick={(e) => {
                        e.stopPropagation()
                        openInvitationDetailDialog(invitation)
                      }}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedInvitation(invitation)
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
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
          //onAccept={() => handleAcceptInvitation(selectedInvitation.id)}
          //onDecline={() => handleDeclineInvitation(selectedInvitation.id)}
          //onAccept={() => handleAcceptInvitation(selectedInvitation.id)}
          //onDecline={() => handleDeclineInvitation(selectedInvitation.id)}
          //onRemove={() => handleRemoveInvitation(selectedInvitation.id)} 
          />
        )}
      </div>
    </>
  )
}
