"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { leaveApprovalRequests } from "@/data/approval-requests"
import { LeaveApprovalsHeader } from "@/components/approvals/leave/leave-approvals-header"
import { LeaveApprovalsFilters } from "@/components/approvals/leave/leave-approvals-filters"
import { LeaveApprovalsTable } from "@/components/approvals/leave/leave-approvals-table"
import { useToast } from "@/hooks/use-toast"

export function LeaveApprovalsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState(leaveApprovalRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const pendingCount = requests.filter((request) => request.status === "pending").length

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.leaveType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleApprove = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))
    toast({
      title: "Request Approved",
      description: "The leave request has been approved successfully.",
    })
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
    toast({
      title: "Request Rejected",
      description: "The leave request has been rejected.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <LeaveApprovalsHeader pendingCount={pendingCount} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Leave Approvals</CardTitle>
          <LeaveApprovalsFilters
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </CardHeader>
        <CardContent>
          <LeaveApprovalsTable requests={filteredRequests} onApprove={handleApprove} onReject={handleReject} />
        </CardContent>
      </Card>
    </div>
  )
}
