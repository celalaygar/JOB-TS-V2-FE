"use client"

import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LeaveRequest } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"
import { leaveTypeOptions } from "@/data/leave-type-options"

interface LeaveRequestTableProps {
  requests: LeaveRequest[]
  onEdit: (request: LeaveRequest) => void
  onDelete: (request: LeaveRequest) => void
}

export function LeaveRequestTable({ requests, onEdit, onDelete }: LeaveRequestTableProps) {
  const { translations, language } = useLanguage()

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  // Format date range
  const formatDateRange = (startDate: Date, endDate: Date) => {
    const start = format(startDate, "PPP", { locale: language === "tr" ? trLocale : undefined })
    const end = format(endDate, "PPP", { locale: language === "tr" ? trLocale : undefined })
    return `${start} - ${end}`
  }

  if (requests.length === 0) {
    return <p className="text-center py-6 text-muted-foreground">{translations.requests.leave.noRequests}</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.requests.leave.tableHeaders.title}</TableHead>
            <TableHead>{translations.requests.leave.tableHeaders.leaveType}</TableHead>
            <TableHead>{translations.requests.leave.tableHeaders.dateRange}</TableHead>
            <TableHead>{translations.requests.leave.tableHeaders.status}</TableHead>
            <TableHead className="text-right">{translations.requests.leave.tableHeaders.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const leaveTypeOption = leaveTypeOptions.find((opt) => opt.value === request.leaveType)
            const leaveTypeLabel = leaveTypeOption
              ? language === "en"
                ? leaveTypeOption.en
                : `${leaveTypeOption.tr} - ${leaveTypeOption.en}`
              : request.leaveType

            return (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>{leaveTypeLabel}</TableCell>
                <TableCell>{formatDateRange(request.startDate, request.endDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {
                      translations.requests.leave.status[
                        request.status as keyof typeof translations.requests.leave.status
                      ]
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(request)}
                      disabled={request.status !== "pending"}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{translations.requests.leave.actions.edit}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(request)}
                      disabled={request.status !== "pending"}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{translations.requests.leave.actions.delete}</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
