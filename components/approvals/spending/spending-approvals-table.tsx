"use client"

import { useState } from "react"
import { Check, X, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"
import type { SpendingApprovalRequest } from "@/data/approval-requests"
import { SpendingApprovalDetailModal } from "./spending-approval-detail-modal"

interface SpendingApprovalsTableProps {
  requests: SpendingApprovalRequest[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function SpendingApprovalsTable({ requests, onApprove, onReject }: SpendingApprovalsTableProps) {
  const { translations, language } = useLanguage()
  const [selectedRequest, setSelectedRequest] = useState<SpendingApprovalRequest | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-yellow-500 text-white"
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")
  }

  const handleViewDetails = (request: SpendingApprovalRequest) => {
    setSelectedRequest(request)
    setDetailModalOpen(true)
  }

  if (requests.length === 0) {
    return <p className="text-center py-6 text-muted-foreground">No spending requests found matching your filters</p>
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.requester.name}</TableCell>
                <TableCell>{formatAmount(request.amount)}</TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{formatDate(request.receiptDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Approve"
                      onClick={() => onApprove(request.id)}
                      disabled={request.status !== "pending"}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="Reject"
                      onClick={() => onReject(request.id)}
                      disabled={request.status !== "pending"}
                    >
                      <X className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Reject</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      title="View Details"
                      onClick={() => handleViewDetails(request)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <SpendingApprovalDetailModal
          request={selectedRequest}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          onApprove={() => {
            onApprove(selectedRequest.id)
            setDetailModalOpen(false)
          }}
          onReject={() => {
            onReject(selectedRequest.id)
            setDetailModalOpen(false)
          }}
        />
      )}
    </>
  )
}
