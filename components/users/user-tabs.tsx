"use client"

import { UserCard } from "@/components/users/user-card"
import { EmptyState } from "@/components/users/empty-state"
import type { User } from "@/lib/redux/features/users-slice"

interface UserTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sortedUsers: User[]
  adminCount: number
  developerCount: number
  testerCount: number
  productOwnerCount: number
  currentUser: User | null
  onView: (userId: string) => void
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
}

export function UserTabs({
  activeTab,
  setActiveTab,
  sortedUsers,
  adminCount,
  developerCount,
  testerCount,
  productOwnerCount,
  currentUser,
  onView,
  onEdit,
  onDelete,
}: UserTabsProps) {
  // Function to render users based on role filter
  const renderUsers = (roleFilter?: string) => {
    const filteredUsers = roleFilter ? sortedUsers.filter((user) => user.role === roleFilter) : sortedUsers

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            currentUser={currentUser}
            onView={() => onView(user.id)}
            onEdit={() => onEdit(user.id)}
            onDelete={() => onDelete(user.id)}
          />
        ))}

        {filteredUsers.length === 0 && <EmptyState type={roleFilter?.toLowerCase() || "all"} />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Custom tab navigation */}
      <div className="flex overflow-x-auto sm:overflow-visible border-b border-[var(--fixed-card-border)]">
        <div
          className={`flex-1 sm:flex-none px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
            ${
              activeTab === "all"
                ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
            }`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </div>
        <div
          className={`flex-1 sm:flex-none px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
            ${
              activeTab === "admin"
                ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
            }`}
          onClick={() => setActiveTab("admin")}
        >
          Admins ({adminCount})
        </div>
        <div
          className={`flex-1 sm:flex-none px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
            ${
              activeTab === "developer"
                ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
            }`}
          onClick={() => setActiveTab("developer")}
        >
          Developers ({developerCount})
        </div>
        <div
          className={`flex-1 sm:flex-none px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
            ${
              activeTab === "tester"
                ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
            }`}
          onClick={() => setActiveTab("tester")}
        >
          Testers ({testerCount})
        </div>
        <div
          className={`flex-1 sm:flex-none px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
            ${
              activeTab === "product owner"
                ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
            }`}
          onClick={() => setActiveTab("product owner")}
        >
          Product Owners ({productOwnerCount})
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "all" && renderUsers()}
        {activeTab === "admin" && renderUsers("Admin")}
        {activeTab === "developer" && renderUsers("Developer")}
        {activeTab === "tester" && renderUsers("Tester")}
        {activeTab === "product owner" && renderUsers("Product Owner")}
      </div>
    </div>
  )
}
