"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { deleteCompanyRole } from "@/lib/redux/features/company-roles-slice"

interface DeleteRoleDialogProps {
  roleId: string
  roleName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteRoleDialog({ roleId, roleName, open, onOpenChange }: DeleteRoleDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    dispatch(deleteCompanyRole(roleId))
    setIsDeleting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.companies?.deleteRole || "Delete Role"}</DialogTitle>
          <DialogDescription>
            {translations.companies?.deleteRoleConfirmation ||
              `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            {translations.common?.cancel || "Cancel"}
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? translations.common?.deleting || "Deleting..." : translations.common?.delete || "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
