"use client"

import type React from "react"

import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Trash,
  ArrowUpDown,
  Users,
  Star,
  ChevronUp,
  ChevronDown,
  Calendar,
  CircleDot,
  SortAsc,
  Check,
  X,
} from "lucide-react"
import type { CompanyRole } from "@/types/company-role"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface CompanyRolesListProps {
  roles: CompanyRole[]
  sortOrder: "asc" | "desc"
  onEditRole: (role: CompanyRole) => void
  onDeleteRole: (role: CompanyRole) => void
  onChangeOrder: (roleId: string, direction: "up" | "down") => void
  onUpdateSortOrder: (roleId: string, newSortOrder: number) => void
}

type SortField = "name" | "usersCount" | "createdAt" | "priority" | "sortOrder"

export function CompanyRolesList({
  roles,
  sortOrder: initialSortOrder,
  onEditRole,
  onDeleteRole,
  onChangeOrder,
  onUpdateSortOrder,
}: CompanyRolesListProps) {
  const { translations } = useLanguage()
  const [sortField, setSortField] = useState<SortField>("sortOrder")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)
  const [editingSortOrder, setEditingSortOrder] = useState<string | null>(null)
  const [tempSortOrder, setTempSortOrder] = useState<number>(0)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleEditSortOrder = (role: CompanyRole) => {
    setEditingSortOrder(role.id)
    setTempSortOrder(role.sortOrder || 0)
  }

  const handleSaveSortOrder = (roleId: string) => {
    onUpdateSortOrder(roleId, tempSortOrder)
    setEditingSortOrder(null)
  }

  const handleCancelEditSortOrder = () => {
    setEditingSortOrder(null)
  }

  const handleSortOrderKeyDown = (e: React.KeyboardEvent, roleId: string) => {
    if (e.key === "Enter") {
      handleSaveSortOrder(roleId)
    } else if (e.key === "Escape") {
      handleCancelEditSortOrder()
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
      case "sortOrder":
        return multiplier * ((a.sortOrder || 999) - (b.sortOrder || 999))
      default:
        return 0
    }
  })

  if (sortedRoles.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">{translations.companies?.noRolesFound || "No company roles found"}</h3>
        <p className="text-muted-foreground mt-1">
          {translations.companies?.addRolesToGetStarted || "Add company roles to get started with role management"}
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
            <TableHead className="w-[50px]">
              <div className="flex items-center justify-center">
                <CircleDot className="h-4 w-4 text-muted-foreground" />
              </div>
            </TableHead>
            <TableHead className="w-[200px]">
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
                <Calendar className="h-4 w-4 mr-1" />
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
            <TableHead className="w-[120px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("sortOrder")}
                className="flex items-center gap-1 hover:bg-transparent p-0 h-auto font-medium"
              >
                <SortAsc className="h-4 w-4 mr-1" />
                <span>Sort Order</span>
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortField === "sortOrder" ? "opacity-100" : "opacity-40")} />
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">{translations.companies?.order || "Order"}</TableHead>
            <TableHead className="text-right">{translations.common?.actions || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoles.map((role, index) => (
            <TableRow key={role.id}>
              <TableCell>
                <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: role.color || "#e2e8f0" }} />
              </TableCell>
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
              <TableCell>
                {editingSortOrder === role.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempSortOrder}
                      onChange={(e) => setTempSortOrder(Number.parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleSortOrderKeyDown(e, role.id)}
                      className="w-20 h-8 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleSaveSortOrder(role.id)}
                      >
                        <span className="sr-only">Save</span>
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCancelEditSortOrder}>
                        <span className="sr-only">Cancel</span>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{role.sortOrder || 0}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditSortOrder(role)}>
                      <span className="sr-only">Edit sort order</span>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onChangeOrder(role.id, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                    <span className="sr-only">Move up</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onChangeOrder(role.id, "down")}
                    disabled={index === sortedRoles.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                    <span className="sr-only">Move down</span>
                  </Button>
                </div>
              </TableCell>
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
