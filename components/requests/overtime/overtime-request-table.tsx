"use client"

import { format } from "date-fns"
import { Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/context"
import type { OvertimeRequest } from "@/data/overtime-requests"

interface OvertimeRequestTableProps {
  requests: OvertimeRequest[]
  onEdit: (request: OvertimeRequest) => void
  onDelete: (id: string) => void
  isEditable?: (request: OvertimeRequest) => boolean
}

export function OvertimeRequestTable({ requests, onEdit, onDelete, isEditable }: OvertimeRequestTableProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  // Format date and time for display
  const formatDateTime = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    // If same day
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      return `${format(startDate, "PPP")} · ${format(startDate, "p")} - ${format(endDate, "p")}`
    }

    // Different days
    return `${format(startDate, "PPP")} ${format(startDate, "p")} - ${format(endDate, "PPP")} ${format(endDate, "p")}`
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t.status.pending,
      approved: t.status.approved,
      rejected: t.status.rejected,
    }

    return statusMap[status] || status
  }

  // Get reason text
  const getReasonText = (reasonKey: string) => {
    const reasonMap: Record<string, string> = {
      projectDeadline: t.reasons.projectDeadline,
      maintenance: t.reasons.maintenance,
      emergency: t.reasons.emergency,
      specialProject: t.reasons.specialProject,
      other: t.reasons.other,
    }

    return reasonMap[reasonKey] || reasonKey
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">{t.noRequests}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">{t.tableHeaders.title}</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">{t.tableHeaders.description}</th>
            <th className="text-left py-3 px-4 font-medium">{t.tableHeaders.dateTime}</th>
            <th className="text-left py-3 px-4 font-medium hidden md:table-cell">{t.tableHeaders.reason}</th>
            <th className="text-left py-3 px-4 font-medium">{t.tableHeaders.status}</th>
            <th className="text-right py-3 px-4 font-medium">{t.tableHeaders.actions}</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b">
              <td className="py-3 px-4">{request.title}</td>
              <td className="py-3 px-4 hidden md:table-cell">
                {request.description.length > 50 ? `${request.description.substring(0, 50)}...` : request.description}
              </td>
              <td className="py-3 px-4">{formatDateTime(request.startDateTime, request.endDateTime)}</td>
              <td className="py-3 px-4 hidden md:table-cell">{getReasonText(request.reason)}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    request.status,
                  )}`}
                >
                  {getStatusText(request.status)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(request)}
                    disabled={request.status !== "pending" || (isEditable && !isEditable(request))}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t.actions.edit}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(request.id)}
                    disabled={request.status !== "pending" || (isEditable && !isEditable(request))}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">{t.actions.delete}</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
