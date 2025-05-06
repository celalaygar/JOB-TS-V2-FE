"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { spendingApprovalRequests } from "@/data/approval-requests"
import { SpendingApprovalsHeader } from "@/components/approvals/spending/spending-approvals-header"
import { SpendingApprovalsFilters } from "@/components/approvals/spending/spending-approvals-filters"
import { SpendingApprovalsTable } from "@/components/approvals/spending/spending-approvals-table"
import { useToast } from "@/hooks/use-toast"

export function SpendingApprovalsPage() {
  const { toast } = useToast()
  const [requests, setRequests] = useState(spendingApprovalRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const pendingCount = requests.filter((request) => request.status === "pending").length

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleApprove = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "approved" } : request)))
    toast({
      title: "Request Approved",
      description: "The spending request has been approved successfully.",
    })
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "rejected" } : request)))
    toast({
      title: "Request Rejected",
      description: "The spending request has been rejected.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <SpendingApprovalsHeader pendingCount={pendingCount} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Pending Spending Approvals</CardTitle>
          <SpendingApprovalsFilters
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
        </CardHeader>
        <CardContent>
          <SpendingApprovalsTable requests={filteredRequests} onApprove={handleApprove} onReject={handleReject} />
        </CardContent>
      </Card>
    </div>
  )
}
