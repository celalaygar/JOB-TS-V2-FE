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

interface ActivateCompanyDialogProps {
  companyId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivateCompanyDialog({ companyId, open, onOpenChange }: ActivateCompanyDialogProps) {
  const { translations } = useLanguage()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const company = useSelector((state: RootState) => state.companies.companies.find((c) => c.id === companyId))

  const handleActivate = () => {
    if (company) {
      const updatedCompany = {
        ...company,
        status: "active",
        updatedAt: new Date().toISOString(),
      }

      dispatch(updateCompany(updatedCompany))

      toast({
        title: translations.companies?.companyActivated,
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
          <AlertDialogTitle>{translations.companies?.activateCompany}</AlertDialogTitle>
          <AlertDialogDescription>
            {translations.companies?.activateCompanyConfirm}
            <div className="mt-2 font-medium">{company.name}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleActivate} className="bg-green-600 hover:bg-green-700">
            Activate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
