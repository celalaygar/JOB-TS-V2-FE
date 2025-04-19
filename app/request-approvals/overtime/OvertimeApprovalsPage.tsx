"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { overtimeApprovalRequests } from "@/data/approval-requests"
import { OvertimeApprovalsHeader } from "@/components/approvals/overtime/overtime-approvals-header"
import { OvertimeApprovalsFilters } from "@/components/approvals/overtime/overtime-approvals-filters"
import { OvertimeApprovalsTable } from "@/components/approvals/overtime/overtime-approvals-table"
import { useToast } from "@/hooks/use-toast"

export function OvertimeApprovalsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState(overtimeApprovalRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [reasonFilter, setReasonFilter] = useState("all")

  const pendingCount = requests.filter((request) => request.status === "pending").length

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesReason = reasonFilter === "all" || request.reason === reasonFilter
    return matchesSearch && matchesStatus && matchesReason
  })

  const handleApprove = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))
    toast({
      title: "Request Approved",
      description: "The overtime request has been approved successfully.",
    })
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
    toast({
      title: "Request Rejected",
      description: "The overtime request has been rejected.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <OvertimeApprovalsHeader pendingCount={pendingCount} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Overtime Approvals</CardTitle>
          <OvertimeApprovalsFilters
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onReasonFilterChange={setReasonFilter}
          />
        </CardHeader>
        <CardContent>
          <OvertimeApprovalsTable requests={filteredRequests} onApprove={handleApprove} onReject={handleReject} />
        </CardContent>
      </Card>
    </div>
  )
}
