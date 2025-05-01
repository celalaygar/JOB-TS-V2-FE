"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"

interface LeaveApprovalsHeaderProps {
  pendingCount: number
}

export function LeaveApprovalsHeader({ pendingCount }: LeaveApprovalsHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">{translations.sidebar.leaveApprovals}</h1>
        <p className="text-muted-foreground">Review and approve leave requests from your team members</p>
      </div>
      <div className="mt-4 md:mt-0">
        <Badge className="bg-orange-500 text-white">{pendingCount} Pending</Badge>
      </div>
    </div>
  )
}
