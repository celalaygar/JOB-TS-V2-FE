"use client"

import { useDispatch, useSelector } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import { updateCompany } from "@/lib/redux/features/companies-slice"
import type { RootState } from "@/lib/redux/store"
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
import { useToast } from "@/hooks/use-toast"

interface DeactivateCompanyDialogProps {
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateCompanyDialog({ companyId, open, onOpenChange }: DeactivateCompanyDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const company = useSelector((state: RootState) => state.companies.companies.find((c) => c.id === companyId))

  const handleDeactivate = () => {
    if (company) {
      const updatedCompany = {
        ...company,
        status: "inactive",
        updatedAt: new Date().toISOString(),
      }

      dispatch(updateCompany(updatedCompany))

      toast({
        title: translations.companies?.companyDeactivated,
        description: new Date().toLocaleString(),
      })
    }

    onOpenChange(false)
  }

  if (!company) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translations.companies?.deactivateCompany}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.companies?.deactivateCompanyConfirm}
            <div className="mt-2 font-medium">{company.name}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeactivate} className="bg-orange-600 hover:bg-orange-700">
            Deactivate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
