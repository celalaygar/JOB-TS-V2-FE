"use client"

import { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { deleteUser } from "@/lib/redux/features/users-slice"
import { UserTabNavigation } from "@/components/users/user-tab-navigation"
import { UserCardGrid } from "@/components/users/user-card-grid"
import { UserDialogs } from "@/components/users/user-dialogs"

interface UsersListProps {
  searchQuery: string
  roleFilter: string
  departmentFilter: string
  sortOption: string
}

export function UsersList({ searchQuery, roleFilter, departmentFilter, sortOption }: UsersListProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  const [userToView, setUserToView] = useState<string | null>(null)
  const [userToEdit, setUserToEdit] = useState<string | null>(null)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter users based on search, role, and department
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())

      // Role filter from tabs
      const matchesTabRole = activeTab === "all" || user.role.toLowerCase() === activeTab.toLowerCase()

      // Role filter from dropdown
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

      // Department filter
      const matchesDepartment =
        departmentFilter === "all" || user.department.toLowerCase() === departmentFilter.toLowerCase()

      return matchesSearch && matchesTabRole && matchesRole && matchesDepartment
    })
  }, [users, searchQuery, activeTab, roleFilter, departmentFilter])

  // Apply sorting
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "role-asc":
          return a.role.localeCompare(b.role)
        case "role-desc":
          return b.role.localeCompare(a.role)
        case "department-asc":
          return a.department.localeCompare(b.department)
        case "department-desc":
          return b.department.localeCompare(a.department)
        default:
          return 0
      }
    })
  }, [filteredUsers, sortOption])

  // Group users by role for the tabs
  const usersByRole = useMemo(() => {
    return {
      admin: users.filter((user) => user.role === "Admin").length,
      developer: users.filter((user) => user.role === "Developer").length,
      tester: users.filter((user) => user.role === "Tester").length,
      productOwner: users.filter((user) => user.role === "Product Owner").length,
    }
  }, [users])

  const handleDeleteUser = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete))
      setUserToDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <UserTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} userCounts={usersByRole} />

        <UserCardGrid
          users={sortedUsers}
          activeTab={activeTab}
          currentUser={currentUser}
          onView={setUserToView}
          onEdit={setUserToEdit}
          onDelete={setUserToDelete}
        />
      </div>

      <UserDialogs
        userToView={userToView}
        setUserToView={setUserToView}
        userToEdit={userToEdit}
        setUserToEdit={setUserToEdit}
        userToDelete={userToDelete}
        setUserToDelete={setUserToDelete}
        onDeleteConfirm={handleDeleteUser}
      />
    </>
  )
}
