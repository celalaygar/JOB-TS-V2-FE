"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { ChevronDown, Edit, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"
import type { LeaveRequest } from "@/types/leave-request"
import { leaveTypeOptions } from "@/data/leave-type-options"

interface LeaveRequestTableProps {
  requests: LeaveRequest[]
  onEdit: (request: LeaveRequest) => void
  onDelete: (request: LeaveRequest) => void
  isEditable?: (request: LeaveRequest) => boolean
}

export function LeaveRequestTable({ requests, onEdit, onDelete, isEditable = () => true }: LeaveRequestTableProps) {
  const { translations, language } = useLanguage()
  const [sortColumn, setSortColumn] = useState<string>("startDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Get leave type label
  const getLeaveTypeLabel = (type: string) => {
    const option = leaveTypeOptions.find((opt) => opt.value === type)
    return option ? (language === "en" ? option.en : option.tr) : type
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {translations.requests.leave.statusApproved}
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {translations.requests.leave.statusRejected}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {translations.requests.leave.statusPending}
          </Badge>
        )
    }
  }

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Sort requests
  const sortedRequests = [...requests].sort((a, b) => {
    let valueA, valueB

    switch (sortColumn) {
      case "title":
        valueA = a.title
        valueB = b.title
        break
      case "leaveType":
        valueA = getLeaveTypeLabel(a.leaveType)
        valueB = getLeaveTypeLabel(b.leaveType)
        break
      case "startDate":
        valueA = new Date(a.startDate).getTime()
        valueB = new Date(b.startDate).getTime()
        break
      case "endDate":
        valueA = new Date(a.endDate).getTime()
        valueB = new Date(b.endDate).getTime()
        break
      case "status":
        valueA = a.status
        valueB = b.status
        break
      default:
        valueA = new Date(a.startDate).getTime()
        valueB = new Date(b.startDate).getTime()
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("title")}>
              <div className="flex items-center">
                {translations.requests.leave.tableTitle}
                {sortColumn === "title" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("leaveType")}>
              <div className="flex items-center">
                {translations.requests.leave.tableType}
                {sortColumn === "leaveType" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
              <div className="flex items-center">
                {translations.requests.leave.tableStartDate}
                {sortColumn === "startDate" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("endDate")}>
              <div className="flex items-center">
                {translations.requests.leave.tableEndDate}
                {sortColumn === "endDate" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
              <div className="flex items-center">
                {translations.requests.leave.tableStatus}
                {sortColumn === "status" && (
                  <ChevronDown className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">{translations.requests.leave.tableActions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {translations.requests.leave.noRequests}
              </TableCell>
            </TableRow>
          ) : (
            sortedRequests.map((request) => {
              const canEdit = isEditable(request)
              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell>{getLeaveTypeLabel(request.leaveType)}</TableCell>
                  <TableCell>
                    {format(new Date(request.startDate), "dd/MM/yyyy", {
                      locale: language === "tr" ? trLocale : undefined,
                    })}
                    {request.startTime && ` ${request.startTime}`}
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.endDate), "dd/MM/yyyy", {
                      locale: language === "tr" ? trLocale : undefined,
                    })}
                    {request.endTime && ` ${request.endTime}`}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(request)}
                        disabled={!canEdit}
                        className={!canEdit ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{translations.requests.leave.edit}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(request)}
                        disabled={!canEdit}
                        className={!canEdit ? "opacity-50 cursor-not-allowed text-red-600" : "text-red-600"}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">{translations.requests.leave.delete}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
