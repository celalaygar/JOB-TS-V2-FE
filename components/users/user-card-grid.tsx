"use client"

import { UserCard } from "@/components/users/user-card"

interface UserCardGridProps {
  users: any[]
  activeTab: string
  currentUser: any
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
}

export function UserCardGrid({ users, activeTab, currentUser, onView, onEdit, onDelete }: UserCardGridProps) {
  // Function to render users based on role filter
  const renderUsers = (roleFilter?: string) => {
    const filteredByRole = roleFilter ? users.filter((user) => user.role === roleFilter) : users

    if (filteredByRole.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-[var(--fixed-sidebar-muted)]">
            No {roleFilter ? roleFilter.toLowerCase() : ""} users found matching your filters.
          </p>
        </div>
      )
    }

    return filteredByRole.map((user) => (
      <UserCard
        key={user.id}
        user={user}
        currentUser={currentUser}
        onView={() => onView(user.id)}
        onEdit={() => onEdit(user.id)}
        onDelete={() => onDelete(user.id)}
      />
    ))
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {activeTab === "all" && renderUsers()}
      {activeTab === "admin" && renderUsers("Admin")}
      {activeTab === "developer" && renderUsers("Developer")}
      {activeTab === "tester" && renderUsers("Tester")}
      {activeTab === "product owner" && renderUsers("Product Owner")}
    </div>
  )
}
