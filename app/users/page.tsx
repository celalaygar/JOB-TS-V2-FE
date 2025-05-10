"use client"

import { useState } from "react"
import { UsersHeader } from "@/components/users/users-header"
import { UsersList } from "@/components/users/users-list"
import { CreateUserDialog } from "@/components/users/create-user-dialog"
import { UsersSearch } from "@/components/users/users-search"
import { UserFilters } from "@/components/users/user-filters"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { users as userList } from "@/data/users"

export default function Users() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [sortOption, setSortOption] = useState("name-asc")
  const [showFilters, setShowFilters] = useState(true)

  const users = userList

  // Get unique departments for filter options
  const departments = [...new Set(userList.map((user) => user.department))].sort()

  // Calculate filtered users count for the filters component
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    const matchesDepartment =
      departmentFilter === "all" || user.department.toLowerCase() === departmentFilter.toLowerCase()

    return matchesSearch && matchesRole && matchesDepartment
  }).length

  return (
    <div className="space-y-6">
      <UsersHeader title="Users" description="Manage your team members and their account permissions." />

      <UsersSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateUser={() => setIsCreateDialogOpen(true)}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <UserFilters
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          departmentFilter={departmentFilter}
          departments={departments}
          onDepartmentFilterChange={setDepartmentFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          totalUsers={users.length}
          filteredUsers={filteredUsers}
        />
      )}

      <UsersList
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        departmentFilter={departmentFilter}
        sortOption={sortOption}
      />

      <CreateUserDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
