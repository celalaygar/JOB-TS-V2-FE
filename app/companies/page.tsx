"use client"
import { CompaniesHeader } from "@/components/companies/companies-header"
import { CompaniesTable } from "@/components/companies/companies-table"

export default function CompaniesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <CompaniesHeader />
      <CompaniesTable />
    </div>
  )
}
