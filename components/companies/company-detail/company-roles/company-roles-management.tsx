"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import { Card } from "@/components/ui/card"
import { CompanyRolesHeader } from "./company-roles-header"
import { CompanyRolesList } from "./company-roles-list"
import { AddRoleDialog } from "./add-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { DeleteRoleDialog } from "./delete-role-dialog"
import type { RootState } from "@/lib/redux/store"
import type { CompanyRole } from "@/types/company-role"

interface CompanyRolesManagementProps {
  companyId: string
}

export function CompanyRolesManagement({ companyId }: CompanyRolesManagementProps) {
  const { translations } = useLanguage()
  const companyRoles = useSelector((state: RootState) =>
    state.companyRoles.roles.filter((role) => role.companyId === companyId),
  )

  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleAddRole = () => {
    setIsAddRoleDialogOpen(true)
  }

  const handleEditRole = (role: CompanyRole) => {
    setSelectedRole(role)
    setIsEditRoleDialogOpen(true)
  }

  const handleDeleteRole = (role: CompanyRole) => {
    setSelectedRole(role)
    setIsDeleteRoleDialogOpen(true)
  }

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order)
  }

  return (
    <Card className="p-6">
      <CompanyRolesHeader onAddRole={handleAddRole} sortOrder={sortOrder} onSortOrderChange={handleSortOrderChange} />

      <CompanyRolesList
        roles={companyRoles}
        sortOrder={sortOrder}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
      />

      {isAddRoleDialogOpen && (
        <AddRoleDialog companyId={companyId} open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen} />
      )}

      {isEditRoleDialogOpen && selectedRole && (
        <EditRoleDialog role={selectedRole} open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen} />
      )}

      {isDeleteRoleDialogOpen && selectedRole && (
        <DeleteRoleDialog
          roleId={selectedRole.id}
          roleName={selectedRole.name}
          open={isDeleteRoleDialogOpen}
          onOpenChange={setIsDeleteRoleDialogOpen}
        />
      )}
    </Card>
  )
}
