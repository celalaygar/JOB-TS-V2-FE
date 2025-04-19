"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, UserPlus, MoreHorizontal, Pencil, Trash, Power, PowerOff } from "lucide-react"
import { EditCompanyUserDialog } from "./edit-company-user-dialog"
import { DeleteCompanyUserDialog } from "./delete-company-user-dialog"
import { ActivateCompanyUserDialog } from "./activate-company-user-dialog"
import { DeactivateCompanyUserDialog } from "./deactivate-company-user-dialog"

interface CompanyUsersListProps {
  companyId: string
  onAddUser: () => void
}

export function CompanyUsersList({ companyId, onAddUser }: CompanyUsersListProps) {
  const { translations } = useLanguage()

  // Get company users from Redux store
  // For this example, we'll use a mock list of users
  const companyUsers = useSelector(
    (state: RootState) =>
      state.users?.users?.filter((user) => user.companyId === companyId) || [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          department: "Management",
          phone: "+1234567890",
          status: "active",
          companyId: companyId,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "manager",
          department: "Sales",
          phone: "+1987654321",
          status: "active",
          companyId: companyId,
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "user",
          department: "IT",
          phone: "+1122334455",
          status: "inactive",
          companyId: companyId,
        },
      ],
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [editUser, setEditUser] = useState<any | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [activateUserId, setActivateUserId] = useState<string | null>(null)
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null)

  // Filter users based on search term
  const filteredUsers = companyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditUser = (user: any) => {
    setEditUser(user)
  }

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId)
  }

  const handleActivateUser = (userId: string) => {
    setActivateUserId(userId)
  }

  const handleDeactivateUser = (userId: string) => {
    setDeactivateUserId(userId)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          {translations.companies?.companyUsers || "Company Users"}
        </CardTitle>
        <Button onClick={onAddUser} size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          {translations.companies?.addUser || "Add User"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder={translations.companies?.searchUsers || "Search users..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.companies?.userName || "Name"}</TableHead>
                  <TableHead>{translations.companies?.userEmail || "Email"}</TableHead>
                  <TableHead>{translations.companies?.userRole || "Role"}</TableHead>
                  <TableHead>{translations.companies?.userStatus || "Status"}</TableHead>
                  <TableHead className="text-right">{translations.companies?.actions || "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {translations.companies?.noUsers || "No users found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status === "active"
                            ? translations.companies?.status?.active || "Active"
                            : translations.companies?.status?.inactive || "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              {translations.companies?.editUser || "Edit User"}
                            </DropdownMenuItem>

                            {user.status !== "active" ? (
                              <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                                <Power className="mr-2 h-4 w-4" />
                                {translations.companies?.activateUser || "Activate User"}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                                <PowerOff className="mr-2 h-4 w-4" />
                                {translations.companies?.deactivateUser || "Deactivate User"}
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              {translations.companies?.deleteUser || "Delete User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Edit User Dialog */}
        {editUser && (
          <EditCompanyUserDialog
            user={editUser}
            companyId={companyId}
            open={!!editUser}
            onOpenChange={(open) => {
              if (!open) setEditUser(null)
            }}
          />
        )}

        {/* Delete User Dialog */}
        {deleteUserId && (
          <DeleteCompanyUserDialog
            userId={deleteUserId}
            open={!!deleteUserId}
            onOpenChange={(open) => {
              if (!open) setDeleteUserId(null)
            }}
          />
        )}

        {/* Activate User Dialog */}
        {activateUserId && (
          <ActivateCompanyUserDialog
            userId={activateUserId}
            open={!!activateUserId}
            onOpenChange={(open) => {
              if (!open) setActivateUserId(null)
            }}
          />
        )}

        {/* Deactivate User Dialog */}
        {deactivateUserId && (
          <DeactivateCompanyUserDialog
            userId={deactivateUserId}
            open={!!deactivateUserId}
            onOpenChange={(open) => {
              if (!open) setDeactivateUserId(null)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
