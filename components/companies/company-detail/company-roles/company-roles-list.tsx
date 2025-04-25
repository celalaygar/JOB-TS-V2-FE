"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, ArrowUpDown, Users, Star } from "lucide-react"
import type { CompanyRole } from "@/types/company-role"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CompanyRolesListProps {
  roles: CompanyRole[]
  sortOrder: "asc" | "desc"
  onEditRole: (role: CompanyRole) => void
  onDeleteRole: (role: CompanyRole) => void
}

type SortField = "name" | "usersCount" | "createdAt" | "priority"

export function CompanyRolesList({
  roles,
  sortOrder: initialSortOrder,
  onEditRole,
  onDeleteRole,
}: CompanyRolesListProps) {
  const { translations } = useLanguage()
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const sortedRoles = [...roles].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1

    switch (sortField) {
      case "name":
        return multiplier * a.name.localeCompare(b.name)
      case "usersCount":
        return multiplier * ((a.usersCount || 0) - (b.usersCount || 0))
      case "createdAt":
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "priority":
        return multiplier * ((a.priority || 999) - (b.priority || 999))
      default:
        return 0
    }
  })

  if (sortedRoles.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">{translations.companies?.noRolesFound || "No roles found"}</h3>
        <p className="text-muted-foreground mt-1">
          {translations.companies?.addRolesToGetStarted || "Add roles to get started"}
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 hover:bg-transparent p-0 h-auto font-medium"
              >
                {translations.companies?.roleName || "Role Name"}
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortField === "name" ? "opacity-100" : "opacity-40")} />
              </Button>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              {translations.companies?.description || "Description"}
            </TableHead>
            <TableHead className="w-[100px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("usersCount")}
                className="flex items-center gap-1 hover:bg-transparent p-0 h-auto font-medium"
              >
                <Users className="h-4 w-4 mr-1" />
                <ArrowUpDown
                  className={cn("ml-1 h-4 w-4", sortField === "usersCount" ? "opacity-100" : "opacity-40")}
                />
              </Button>
            </TableHead>
            <TableHead className="w-[120px] hidden lg:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("createdAt")}
                className="flex items-center gap-1 hover:bg-transparent p-0 h-auto font-medium"
              >
                {translations.companies?.created || "Created"}
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortField === "createdAt" ? "opacity-100" : "opacity-40")} />
              </Button>
            </TableHead>
            <TableHead className="w-[100px] hidden sm:table-cell">
              <Button
                variant="ghost"
                onClick={() => handleSort("priority")}
                className="flex items-center gap-1 hover:bg-transparent p-0 h-auto font-medium"
              >
                <Star className="h-4 w-4 mr-1" />
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortField === "priority" ? "opacity-100" : "opacity-40")} />
              </Button>
            </TableHead>
            <TableHead className="text-right">{translations.common?.actions || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {role.name}
                  {role.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      {translations.common?.default || "Default"}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[300px] truncate">{role.description}</TableCell>
              <TableCell>{role.usersCount || 0}</TableCell>
              <TableCell className="hidden lg:table-cell">{formatDate(role.createdAt)}</TableCell>
              <TableCell className="hidden sm:table-cell">{role.priority || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEditRole(role)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteRole(role)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
