"use client"

import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { Pencil, Trash2 } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SpendingRequest } from "@/data/spending-requests"
import { useLanguage } from "@/lib/i18n/context"
import { categoryOptions } from "@/data/spending-requests"

interface SpendingRequestTableProps {
  requests: SpendingRequest[]
  onEdit: (request: SpendingRequest) => void
  onDelete: (request: SpendingRequest) => void
  isFromPreviousYear: (request: SpendingRequest) => boolean
}

export function SpendingRequestTable({ requests, onEdit, onDelete, isFromPreviousYear }: SpendingRequestTableProps) {
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

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "PPP", { locale: language === "tr" ? trLocale : undefined })
  }

  if (requests.length === 0) {
    return <p className="text-center py-6 text-muted-foreground">{translations.requests.spending.noRequests}</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.requests.spending.tableHeaders.title}</TableHead>
            <TableHead>{translations.requests.spending.tableHeaders.category}</TableHead>
            <TableHead>{translations.requests.spending.tableHeaders.amount}</TableHead>
            <TableHead>{translations.requests.spending.tableHeaders.date}</TableHead>
            <TableHead>{translations.requests.spending.tableHeaders.status}</TableHead>
            <TableHead className="text-right">{translations.requests.spending.tableHeaders.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const categoryOption = categoryOptions.find((opt) => opt.value === request.category)
            const categoryLabel = categoryOption
              ? language === "en"
                ? categoryOption.en
                : categoryOption.tr
              : request.category

            const isPastRequest = isFromPreviousYear(request)
            const isEditable = !isPastRequest && request.status === "pending"

            return (
              <TableRow key={request.id} className={isPastRequest ? "opacity-80" : ""}>
                <TableCell className="font-medium">{request.title}</TableCell>
                <TableCell>{categoryLabel}</TableCell>
                <TableCell>{formatAmount(request.amount)}</TableCell>
                <TableCell>{formatDate(request.receiptDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {
                      translations.requests.spending.status[
                        request.status as keyof typeof translations.requests.spending.status
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
                      disabled={!isEditable}
                      title={isPastRequest ? translations.requests.spending.cannotEditPastRequest : ""}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{translations.requests.spending.actions.edit}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(request)}
                      disabled={!isEditable}
                      title={isPastRequest ? translations.requests.spending.cannotDeletePastRequest : ""}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{translations.requests.spending.actions.delete}</span>
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
