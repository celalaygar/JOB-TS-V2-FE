"use client"

import { useCallback, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateInvitationStatus, removeInvitation } from "@/lib/redux/features/invitations-slice"
import { InvitationDetailsDialog } from "@/components/notifications/invitation-details-dialog"
import type { Invitation } from "@/lib/redux/features/invitations-slice"
import type { Project } from "@/types/project"
import { SentInvitationsList } from "./sent-invitations-list"
import { Loader2 } from "lucide-react"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import { getAllInvitationsHelper } from "@/lib/service/api-helpers" // Import the new helper

interface ProjectSentInvitationsTabProps {
    project: Project
}

export function ProjectSentInvitationsTab({ project }: ProjectSentInvitationsTabProps) {
    const dispatch = useDispatch()
    const authUser = useAuthUser();
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<Invitation[]>([]);

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

                <SentInvitationsList invitations={invitations} onInvitationClick={handleInvitationClick} />

                {selectedInvitation && (
                    <InvitationDetailsDialog
                        onResetInvitations={fetchAllInvitations}
                        invitation={selectedInvitation}
                        open={detailDialogOpen}
                        onOpenChange={setDetailDialogOpen}
                        onAccept={handleAcceptInvitation}
                        onDecline={handleDeclineInvitation}
                        onRemove={handleRemoveInvitation}
                        currentUser={authUser?.user}
                    />
                )}
            </div>
        </>
    )
}
