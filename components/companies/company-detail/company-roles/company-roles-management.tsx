"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { CompanyRolesHeader } from "./company-roles-header"
import { CompanyRolesList } from "./company-roles-list"
import { AddRoleDialog } from "./add-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { DeleteRoleDialog } from "./delete-role-dialog"
import { useLanguage } from "@/lib/i18n/context"
import { companyRoles } from "@/data/company-roles"
import type { CompanyRole } from "@/types/company-role"
import { toast } from "@/hooks/use-toast"

export function CompanyRolesManagement() {
  const { translations } = useLanguage()
  const params = useParams()
  const companyId = params.id as string

  // Filter roles for the current company
  const filteredRoles = companyRoles // Show all roles for demonstration purposes

  const [roles, setRoles] = useState<CompanyRole[]>(filteredRoles)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null)

  const handleAddRole = (role: CompanyRole) => {
    setRoles([...roles, role])
    setIsAddRoleOpen(false)
  }

  const handleEditRole = (role: CompanyRole) => {
    setRoles(roles.map((r) => (r.id === role.id ? role : r)))
    setIsEditRoleOpen(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId))
    setIsDeleteRoleOpen(false)
    setSelectedRole(null)
  }

  const handleOpenEditRole = (role: CompanyRole) => {
    setSelectedRole(role)
    setIsEditRoleOpen(true)
  }

  const handleOpenDeleteRole = (role: CompanyRole) => {
    setSelectedRole(role)
    setIsDeleteRoleOpen(true)
  }

  const handleChangeOrder = (roleId: string, direction: "up" | "down") => {
    const roleIndex = roles.findIndex((r) => r.id === roleId)
    if (roleIndex === -1) return

    const newRoles = [...roles]

    if (direction === "up" && roleIndex > 0) {
      // Swap with the previous role
      const temp = newRoles[roleIndex]
      newRoles[roleIndex] = newRoles[roleIndex - 1]
      newRoles[roleIndex - 1] = temp

      // Update priorities
      if (newRoles[roleIndex].priority !== undefined && newRoles[roleIndex - 1].priority !== undefined) {
        const tempPriority = newRoles[roleIndex].priority
        newRoles[roleIndex].priority = newRoles[roleIndex - 1].priority
        newRoles[roleIndex - 1].priority = tempPriority
      }
    } else if (direction === "down" && roleIndex < roles.length - 1) {
      // Swap with the next role
      const temp = newRoles[roleIndex]
      newRoles[roleIndex] = newRoles[roleIndex + 1]
      newRoles[roleIndex + 1] = temp

      // Update priorities
      if (newRoles[roleIndex].priority !== undefined && newRoles[roleIndex + 1].priority !== undefined) {
        const tempPriority = newRoles[roleIndex].priority
        newRoles[roleIndex].priority = newRoles[roleIndex + 1].priority
        newRoles[roleIndex + 1].priority = tempPriority
      }
    }

    setRoles(newRoles)
  }

  const handleUpdateSortOrder = (roleId: string, newSortOrder: number) => {
    const updatedRoles = roles.map((role) => (role.id === roleId ? { ...role, sortOrder: newSortOrder } : role))
    setRoles(updatedRoles)

    toast({
      title: "Sort order updated",
      description: `Role sort order has been updated to ${newSortOrder}`,
      duration: 3000,
    })
  }

  const handleToggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6">
      <CompanyRolesHeader
        onAddRole={() => setIsAddRoleOpen(true)}
        onToggleSortOrder={handleToggleSortOrder}
        sortOrder={sortOrder}
      />

      <CompanyRolesList
        roles={roles}
        sortOrder={sortOrder}
        onEditRole={handleOpenEditRole}
        onDeleteRole={handleOpenDeleteRole}
        onChangeOrder={handleChangeOrder}
        onUpdateSortOrder={handleUpdateSortOrder}
      />

      <AddRoleDialog
        open={isAddRoleOpen}
        onOpenChange={setIsAddRoleOpen}
        onAddRole={handleAddRole}
        companyId={companyId}
      />

      {selectedRole && (
        <>
          <EditRoleDialog
            open={isEditRoleOpen}
            onOpenChange={setIsEditRoleOpen}
            onEditRole={handleEditRole}
            role={selectedRole}
          />

          <DeleteRoleDialog
            open={isDeleteRoleOpen}
            onOpenChange={setIsDeleteRoleOpen}
            onDeleteRole={() => handleDeleteRole(selectedRole.id)}
            role={selectedRole}
          />
        </>
      )}
    </div>
  )
}
