"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import type { TeamMemberStatus } from "@/data/teams"

interface TeamDetailFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: TeamMemberStatus | "All"
  onStatusFilterChange: (value: TeamMemberStatus | "All") => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  uniqueRoles: string[]
}

export function TeamDetailFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  uniqueRoles,
}: TeamDetailFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email, or role..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <div className="w-40">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as TeamMemberStatus | "All")}
          >
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Banned">Banned</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-40">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Role</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
