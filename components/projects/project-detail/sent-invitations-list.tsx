"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Mail, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { InvitationStatus, type Invitation } from "@/lib/redux/features/invitations-slice"

interface SentInvitationsListProps {
    invitations: Invitation[]
    onInvitationClick: (invitation: Invitation) => void
}

export function SentInvitationsList({ invitations, onInvitationClick }: SentInvitationsListProps) {
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

    if (invitations.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Mail className="h-12 w-12 text-[var(--fixed-sidebar-muted)] mb-4" />
                    <h3 className="text-lg font-medium mb-2">No invitations sent</h3>
                    <p className="text-[var(--fixed-sidebar-muted)] text-center">
                        No invitations have been sent for this project yet.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {invitations && invitations.map((invitation: Invitation) => (
                <Card
                    key={invitation.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-[var(--fixed-card-border)]"
                    onClick={() => onInvitationClick(invitation)}
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
    )
}
