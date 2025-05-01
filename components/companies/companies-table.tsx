"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLanguage } from "@/lib/i18n/context"
import type { RootState } from "@/lib/redux/store"
import type { Company } from "@/data/companies"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EditCompanyDialog } from "./edit-company-dialog"
import { DeleteCompanyDialog } from "./delete-company-dialog"
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export function CompaniesTable() {
  const { translations } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const companies = useSelector((state: RootState) => state.companies.companies)

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [sortField, setSortField] = useState<keyof Company>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editCompany, setEditCompany] = useState<Company | null>(null)
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null)

  // Filter companies based on search term
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCompanies = sortedCompanies.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage)

  const handleSort = (field: keyof Company) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewCompany = (id: string) => {
    router.push(`/companies/${id}`)
  }

  const handleEditCompany = (company: Company) => {
    setEditCompany(company)
  }

  const handleDeleteCompany = (id: string) => {
    setDeleteCompanyId(id)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "active":
        return translations.companies?.status.active
      case "inactive":
        return translations.companies?.status.inactive
      case "pending":
        return translations.companies?.status.pending
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={translations.companies?.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                {translations.companies?.companyName}
                {sortField === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("code")}>
                {translations.companies?.companyCode}
                {sortField === "code" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead>{translations.companies?.companyIndustry}</TableHead>
              <TableHead>{translations.companies?.companySize}</TableHead>
              <TableHead>{translations.companies?.companyStatus}</TableHead>
              <TableHead className="text-right">{translations.companies?.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {translations.companies?.noCompanies}
                </TableCell>
              </TableRow>
            ) : (
              currentCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.code}</TableCell>
                  <TableCell>
                    {translations.companies?.industry[company.industry as keyof typeof translations.companies.industry]}
                  </TableCell>
                  <TableCell>
                    {translations.companies?.size[company.size as keyof typeof translations.companies.size]}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(company.status)}>
                      {getStatusTranslation(company.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCompany(company.id)}
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {translations.companies?.editCompany}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCompany(company.id)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            {translations.companies?.deleteCompany}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      {editCompany && (
        <EditCompanyDialog
          company={editCompany}
          open={!!editCompany}
          onOpenChange={(open) => {
            if (!open) setEditCompany(null)
          }}
        />
      )}

      {/* Delete Dialog */}
      {deleteCompanyId && (
        <DeleteCompanyDialog
          companyId={deleteCompanyId}
          open={!!deleteCompanyId}
          onOpenChange={(open) => {
            if (!open) setDeleteCompanyId(null)
          }}
        />
      )}
    </div>
  )
}
