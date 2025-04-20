"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/context"
import { SpendingRequestHeader } from "@/components/requests/spending/spending-request-header"
import { SpendingRequestTable } from "@/components/requests/spending/spending-request-table"
import { CreateSpendingRequestDialog } from "@/components/requests/spending/create-spending-request-dialog"
import { EditSpendingRequestDialog } from "@/components/requests/spending/edit-spending-request-dialog"
import { DeleteSpendingRequestDialog } from "@/components/requests/spending/delete-spending-request-dialog"
import { spendingRequests, type SpendingRequest } from "@/data/spending-requests"

export default function SpendingRequestClientPage() {
  const { translations } = useLanguage()
  const { toast } = useToast()

  // State for requests
  const [requests, setRequests] = useState<SpendingRequest[]>(spendingRequests)

  // State for dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<SpendingRequest | null>(null)

  // Handlers
  const handleCreateRequest = (request: SpendingRequest) => {
    setRequests([request, ...requests])
    setIsCreateDialogOpen(false)
    toast({
      title: translations.requests.spending.requestCreated,
      description: translations.requests.spending.requestCreatedMessage,
    })
  }

  const handleEditRequest = (request: SpendingRequest) => {
    setSelectedRequest(request)
    setIsEditDialogOpen(true)
  }

  const handleUpdateRequest = (updatedRequest: SpendingRequest) => {
    setRequests(requests.map((request) => (request.id === updatedRequest.id ? updatedRequest : request)))
    setIsEditDialogOpen(false)
    toast({
      title: translations.requests.spending.requestUpdated,
      description: translations.requests.spending.requestUpdatedMessage,
    })
  }

  const handleDeleteRequest = (request: SpendingRequest) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (requestId: string) => {
    setRequests(requests.filter((request) => request.id !== requestId))
    setIsDeleteDialogOpen(false)
    toast({
      title: translations.requests.spending.requestDeleted,
      description: translations.requests.spending.requestDeletedMessage,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <SpendingRequestHeader onCreateRequest={() => setIsCreateDialogOpen(true)} />

      <div className="mt-8">
        <SpendingRequestTable requests={requests} onEdit={handleEditRequest} onDelete={handleDeleteRequest} />
      </div>

      <CreateSpendingRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRequest}
      />

      {selectedRequest && (
        <>
          <EditSpendingRequestDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            request={selectedRequest}
            onSubmit={handleUpdateRequest}
          />

          <DeleteSpendingRequestDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            request={selectedRequest}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}
    </div>
  )
}
