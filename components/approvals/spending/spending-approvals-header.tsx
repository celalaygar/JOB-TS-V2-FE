"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"

interface SpendingApprovalsHeaderProps {
  pendingCount: number
}

export function SpendingApprovalsHeader({ pendingCount }: SpendingApprovalsHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{translations.sidebar.spendingApprovals}</h1>
        <p className="text-muted-foreground">Review and approve spending requests from your team members</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Badge className="bg-orange-500 text-white">{pendingCount} Pending</Badge>
      </div>
    </div>
  )
}
