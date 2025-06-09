"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Check, X, Calendar, Building2, Users, Mail, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { AuthenticationUser } from "@/types/user"
import { Invitation, InvitationStatus } from "@/lib/redux/features/invitations-slice"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { toast } from "@/hooks/use-toast"
import { INVITATION_PROJECT } from "@/lib/service/BasePath"

interface InvitationDetailsDialogProps {
    invitation: Invitation
    open: boolean
    onOpenChange: (open: boolean) => void
    onResetInvitations: () => void
    /*
    onAccept: () => void
    onDecline: () => void
    onRemove: () => void
*/
    currentUser: AuthenticationUser | undefined
}

export function InvitationDetailsDialog({
    invitation,
    open,
    onOpenChange,
    onResetInvitations,
    //onAccept,
    //onDecline,
    //onRemove,
    currentUser,
}: InvitationDetailsDialogProps) {
    const [confirmRemove, setConfirmRemove] = useState(false)

    const getStatusColor = () => {
        switch (invitation.status) {
            case InvitationStatus.PENDING:
                return "bg-[var(--fixed-warning)] text-white"
            case InvitationStatus.ACCEPTED:
                return "bg-[var(--fixed-success)] text-white"
            case InvitationStatus.DECLINED:
                return "bg-[var(--fixed-danger)] text-white"
            default:
                return ""
        }
    }



    const [loading, setLoading] = useState(false);

    const acceptInvitations = async () => {
        setLoading(true)
        try {
            const response: Invitation[] = await BaseService.request(INVITATION_PROJECT + "/accept", {
                method: httpMethods.POST,
                body: { invitationId: invitation.id }
            })
            toast({
                title: `accept Invitations.`,
                description: `acceptInvitations `,
            })

        } catch (error: any) {
            if (error.status === 400 && error.message) {
                toast({
                    title: `accept Invitations failed. (400)`,
                    description: error.message,
                    variant: "destructive",
                })
            } else {
                console.error('accept Invitations failed:', error)
                toast({
                    title: `accept Invitations failed.`,
                    description: error.message,
                    variant: "destructive",
                })
            }
        }
        setLoading(false)
        //onAccept()
        onResetInvitations()
        onOpenChange(false)
    }

    const declineInvitations = async () => {
        setLoading(true)
        try {
            const response: Invitation[] = await BaseService.request(INVITATION_PROJECT + "/decline", {
                method: httpMethods.POST,
                body: { invitationId: invitation.id }
            })
            toast({
                title: `decline Invitations.`,
                description: `decline Invitations `,
            })

        } catch (error: any) {
            if (error.status === 400 && error.message) {
                toast({
                    title: `decline Invitations failed. (400)`,
                    description: error.message,
                    variant: "destructive",
                })
            } else {
                console.error('decline Invitations failed:', error)
                toast({
                    title: `decline Invitations failed.`,
                    description: error.message,
                    variant: "destructive",
                })
            }
        }
        setLoading(false)
        //onDecline()

        onResetInvitations()
        onOpenChange(false)
    }


    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>Project Invitation</span>
                            <Badge className={getStatusColor()}>
                                {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>
                    {
                        loading ?
                            <div className="grid gap-4 py-4">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                                </div>
                            </div>
                            :
                            <>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">
                                            <Building2 className="h-5 w-5 text-[var(--fixed-primary)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{invitation?.project?.name}</p>
                                            <p className="text-sm text-[var(--fixed-sidebar-muted)]">Project</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={invitation.senderAvatar || "/placeholder.svg"}
                                                alt={invitation.invitedBy?.firstname + " " + invitation?.invitedBy?.lastname} />
                                            <AvatarFallback>{invitation.senderInitials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{invitation?.invitedBy?.firstname + " " + invitation?.invitedBy?.lastname}</p>
                                            <p className="text-sm text-[var(--fixed-sidebar-muted)]">Sender</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">
                                            <Users className="h-5 w-5 text-[var(--fixed-sidebar-muted)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {invitation?.invitedUser?.id === currentUser?.id ? "You" : invitation?.invitedUser?.firstname + " " + invitation?.invitedUser?.lastname}
                                            </p>
                                            <p className="text-sm text-[var(--fixed-sidebar-muted)]">Recipient</p>
                                        </div>
                                    </div>

                                    {invitation?.invitedUser && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">
                                                <Mail className="h-5 w-5 text-[var(--fixed-sidebar-muted)]" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{invitation?.invitedUser?.email}</p>
                                                <p className="text-sm text-[var(--fixed-sidebar-muted)]">Email</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <div className="bg-[var(--fixed-secondary)] p-2 rounded-full">
                                            <Calendar className="h-5 w-5 text-[var(--fixed-sidebar-muted)]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
                                            </p>
                                            <p className="text-sm text-[var(--fixed-sidebar-muted)]">Sent</p>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="flex sm:justify-between gap-2 mt-6">
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            disabled={invitation.status === InvitationStatus.ACCEPTED}
                                            variant="outline"
                                            className="flex-1 border-[var(--fixed-card-border)] text-[var(--fixed-danger)]"
                                            onClick={() => {
                                                declineInvitations()
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Decline
                                        </Button>
                                        <Button
                                            disabled={invitation.status === InvitationStatus.ACCEPTED}
                                            className="flex-1 bg-[var(--fixed-success)] text-white hover:bg-[var(--fixed-success)]/90"
                                            onClick={() => {
                                                acceptInvitations()
                                            }}
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Accept
                                        </Button>
                                        <Button
                                            disabled={invitation.status === InvitationStatus.ACCEPTED}
                                            variant="outline"
                                            className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                                            onClick={() => setConfirmRemove(true)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </>
                    }
                </DialogContent>
            </Dialog>

            <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this invitation? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-[var(--fixed-danger)] text-white"
                            onClick={() => {
                                onRemove()
                                setConfirmRemove(false)
                                onOpenChange(false)
                            }}
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
