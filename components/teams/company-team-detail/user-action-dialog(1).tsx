"use client"

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
import { useLanguage } from "@/lib/i18n/context"
import type { TeamMember } from "@/data/company-teams"

interface UserActionDialogProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  member: TeamMember
  onConfirm: () => void
}

export function UserActionDialog({ open, onClose, title, description, member, onConfirm }: UserActionDialogProps) {
  const { translations } = useLanguage()

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            <div className="mt-4 p-4 border rounded-md bg-muted/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">{translations.teams?.companyTeams.memberName}</p>
                  <p className="text-sm break-words">{member.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{translations.teams?.companyTeams.memberEmail}</p>
                  <p className="text-sm break-words">{member.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{translations.teams?.companyTeams.memberRole}</p>
                  <p className="text-sm">{member.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{translations.teams?.companyTeams.memberStatus}</p>
                  <p className="text-sm">{member.status}</p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="w-full sm:w-auto">
            {translations.requests?.overtime.actions.cancel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="w-full sm:w-auto">
            {title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
