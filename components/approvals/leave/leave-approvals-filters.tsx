"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/context"

interface LeaveApprovalsFiltersProps {
  onSearchChange: (query: string) => void
  onStatusFilterChange: (status: string) => void
  onTypeFilterChange: (type: string) => void
}

export function LeaveApprovalsFilters({
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
}: LeaveApprovalsFiltersProps) {
  const { translations } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title or requester..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select defaultValue="all" onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by leave type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Annual Leave">Annual Leave</SelectItem>
              <SelectItem value="Sick Leave">Sick Leave</SelectItem>
              <SelectItem value="Personal Leave">Personal Leave</SelectItem>
              <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
              <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
