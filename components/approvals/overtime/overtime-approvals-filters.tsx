"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/context"

interface OvertimeApprovalsFiltersProps {
  onSearchChange: (query: string) => void
  onStatusFilterChange: (status: string) => void
  onReasonFilterChange: (reason: string) => void
}

export function OvertimeApprovalsFilters({
  onSearchChange,
  onStatusFilterChange,
  onReasonFilterChange,
}: OvertimeApprovalsFiltersProps) {
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
          <Select defaultValue="all" onValueChange={onReasonFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="Project Deadline">Project Deadline</SelectItem>
              <SelectItem value="System Maintenance">System Maintenance</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Special Project">Special Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
