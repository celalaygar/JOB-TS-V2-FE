"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { InvitationDetailsDialog } from "@/components/notifications/invitation-details-dialog"
import type { Project } from "@/types/project"
import { Loader2 } from "lucide-react"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import { getAllInvitationsHelper } from "@/lib/service/api-helpers" // Import the new helper
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Mail, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Invitation, InvitationStatus } from "@/types/invitation"



interface ProjectSentInvitationsTabProps {
    project: Project
}

export function ProjectSentInvitationsTab({ project }: ProjectSentInvitationsTabProps) {
    const dispatch = useDispatch()
    const authUser = useAuthUser();
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isOpenInvitationDetails, setIsOpenInvitationDetails] = useState(false)

    const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)


    const handleInvitationClick = (invitation: Invitation) => {
        setSelectedInvitation(invitation)
        setDetailDialogOpen(true)
    }

    const handleAcceptInvitation = () => {
        if (selectedInvitation) {
            dispatch(
                updateInvitationStatus({
                    id: selectedInvitation.id,
                    status: "accepted",
                }),
            )
        }
    }

    const handleDeclineInvitation = () => {
        if (selectedInvitation) {
            dispatch(
                updateInvitationStatus({
                    id: selectedInvitation.id,
                    status: "declined",
                }),
            )
        }
    }

    const handleRemoveInvitation = () => {
        if (selectedInvitation) {
            dispatch(removeInvitation(selectedInvitation.id))
        }
    }

    const fetchAllInvitations = useCallback(async () => {
        setInvitations([]); // Clear existing invitations
        const invitationsData = await getAllInvitationsHelper(project.id, { setLoading });
        if (invitationsData) {
            setInvitations(invitationsData);
        }
    }, [project.id]);

    useEffect(() => {
        fetchAllInvitations();
    }, [fetchAllInvitations])
    const getStatusColor = (status: string) => {
        switch (status) {
            case InvitationStatus.PENDING:
                return "bg-[var(--fixed-warning)] text-white"
            case InvitationStatus.ACCEPTED:
                return "bg-[var(--fixed-success)] text-white"
            case InvitationStatus.DECLINED:
                return "bg-[var(--fixed-danger)] text-white"
            default:
                return "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)]"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return "⏳"
            case "ACCEPTED":
                return "✅"
            case "DECLINED":
                return "❌"
            default:
                return "📧"
        }
    }


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
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Sent Invitations</h2>
                        <p className="text-muted-foreground">Manage invitations sent for {project.name}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
                    </div>
                </div>

                <div className="space-y-4">
                    {invitations && invitations.map((invitation: Invitation) => (
                        <Card
                            key={invitation.id}
                            className="cursor-pointer hover:shadow-md transition-shadow border-[var(--fixed-card-border)]"
                            onClick={() => openInvitationDetailDialog(invitation)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="/placeholder.svg"
                                                alt={invitation.invitedUser.firstname + " " + invitation.invitedUser.lastname} />
                                            <AvatarFallback>
                                                {invitation.invitedUser.email
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-[var(--fixed-sidebar-fg)] truncate">
                                                    <b>invited User :</b> {invitation.invitedUser.firstname + " " + invitation.invitedUser.lastname}</h4>
                                                <Badge className={getStatusColor(invitation.status)}>
                                                    <span className="mr-1">{getStatusIcon(invitation.status)}</span>
                                                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-[var(--fixed-sidebar-muted)]">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{invitation.invitedUser.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-sm text-[var(--fixed-sidebar-muted)]">
                                            <User className="h-3 w-3" />
                                            <span><b>invited By : </b> {invitation.invitedBy.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

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
                            fetchAllInvitations()
                        }}
                    />
                )}
            </div>
        </>
    )
}
