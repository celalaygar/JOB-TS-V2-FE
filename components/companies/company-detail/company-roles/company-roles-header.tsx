"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Plus, SortAsc, SortDesc } from "lucide-react"

interface CompanyRolesHeaderProps {
  onAddRole: () => void
  sortOrder: "asc" | "desc"
  onSortOrderChange: (order: "asc" | "desc") => void
}

export function CompanyRolesHeader({ onAddRole, sortOrder, onSortOrderChange }: CompanyRolesHeaderProps) {
  const { translations } = useLanguage()

  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{translations.companies?.companyRoles || "Company Roles"}</h2>
        <p className="text-muted-foreground">
          {translations.companies?.manageCompanyRoles || "Manage roles and permissions for this company"}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={toggleSortOrder}>
          {sortOrder === "asc" ? (
            <>
              <SortAsc className="mr-2 h-4 w-4" />
              {translations.common?.sortAsc || "Sort A-Z"}
            </>
          ) : (
            <>
              <SortDesc className="mr-2 h-4 w-4" />
              {translations.common?.sortDesc || "Sort Z-A"}
            </>
          )}
        </Button>
        <Button onClick={onAddRole}>
          <Plus className="mr-2 h-4 w-4" />
          {translations.companies?.addRole || "Add Role"}
        </Button>
      </div>
    </div>
  )
}
