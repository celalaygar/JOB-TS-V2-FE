"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "next/navigation"
import type { RootState } from "@/lib/redux/store"
import { CompanyDetailHeader } from "@/components/companies/company-detail/company-detail-header"
import { CompanyDetailInfo } from "@/components/companies/company-detail/company-detail-info"
import { EditCompanyDialog } from "@/components/companies/edit-company-dialog"
import { DeleteCompanyDialog } from "@/components/companies/delete-company-dialog"
import { ActivateCompanyDialog } from "@/components/companies/activate-company-dialog"
import { DeactivateCompanyDialog } from "@/components/companies/deactivate-company-dialog"
import { AddCompanyUserDialog } from "@/components/companies/company-detail/add-company-user-dialog"

export default function CompanyDetailPage() {
  const params = useParams()
  const companyId = params.id as string

  const company = useSelector((state: RootState) => state.companies.companies.find((c) => c.id === companyId))

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)

  if (!company) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-bold">Company not found</h1>
        <p className="text-muted-foreground">The company you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <CompanyDetailHeader
        company={company}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onActivate={() => setIsActivateDialogOpen(true)}
        onDeactivate={() => setIsDeactivateDialogOpen(true)}
      />

      <CompanyDetailInfo
        company={company}
        onActivate={() => setIsActivateDialogOpen(true)}
        onDeactivate={() => setIsDeactivateDialogOpen(true)}
        onAddUser={() => setIsAddUserDialogOpen(true)}
      />

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <EditCompanyDialog company={company} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <DeleteCompanyDialog companyId={company.id} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
      )}

      {/* Activate Dialog */}
      {isActivateDialogOpen && (
        <ActivateCompanyDialog
          companyId={company.id}
          open={isActivateDialogOpen}
          onOpenChange={setIsActivateDialogOpen}
        />
      )}

      {/* Deactivate Dialog */}
      {isDeactivateDialogOpen && (
        <DeactivateCompanyDialog
          companyId={company.id}
          open={isDeactivateDialogOpen}
          onOpenChange={setIsDeactivateDialogOpen}
        />
      )}

      {/* Add User Dialog */}
      {isAddUserDialogOpen && (
        <AddCompanyUserDialog companyId={company.id} open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen} />
      )}
    </div>
  )
}
