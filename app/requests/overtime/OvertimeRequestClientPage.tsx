"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OvertimeRequestHeader } from "@/components/requests/overtime/overtime-request-header"
import { OvertimeRequestTable } from "@/components/requests/overtime/overtime-request-table"
import { CreateOvertimeRequestDialog } from "@/components/requests/overtime/create-overtime-request-dialog"
import { EditOvertimeRequestDialog } from "@/components/requests/overtime/edit-overtime-request-dialog"
import { DeleteOvertimeRequestDialog } from "@/components/requests/overtime/delete-overtime-request-dialog"
import { type OvertimeRequest, sampleOvertimeRequests } from "@/data/overtime-requests"

export function OvertimeRequestClientPage() {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const t = translations.requests.overtime

  // State for requests
  const [requests, setRequests] = useState<OvertimeRequest[]>([])

  // State for dialogs
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentRequest, setCurrentRequest] = useState<OvertimeRequest | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null)

  // Load sample data
  useEffect(() => {
    setRequests(sampleOvertimeRequests)
  }, [])

  // Handle create request
  const handleCreateRequest = (newRequest: OvertimeRequest) => {
    setRequests([newRequest, ...requests])
    setIsNewRequestDialogOpen(false)

    toast({
      title: t.requestCreated,
      description: t.requestCreatedMessage,
    })
  }

  // Handle edit request
  const handleEditRequest = (request: OvertimeRequest) => {
    setCurrentRequest(request)
    setIsEditDialogOpen(true)
  }

  // Handle update request
  const handleUpdateRequest = (updatedRequest: OvertimeRequest) => {
    const updatedRequests = requests.map((req) => {
      if (req.id === updatedRequest.id) {
        return updatedRequest
      }
      return req
    })

    setRequests(updatedRequests)
    setIsEditDialogOpen(false)
    setCurrentRequest(null)

    toast({
      title: t.requestUpdated,
      description: t.requestUpdatedMessage,
    })
  }

  // Handle delete confirmation
  const handleDeleteConfirm = (id: string) => {
    setRequestToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete request
  const handleDeleteRequest = () => {
    if (!requestToDelete) return

    const updatedRequests = requests.filter((req) => req.id !== requestToDelete)
    setRequests(updatedRequests)
    setIsDeleteDialogOpen(false)
    setRequestToDelete(null)

    toast({
      title: t.requestDeleted,
      description: t.requestDeletedMessage,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with New Request Button */}
      <OvertimeRequestHeader onNewRequest={() => setIsNewRequestDialogOpen(true)} />

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.myRequests}</CardTitle>
          <CardDescription>{t.myRequestsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <OvertimeRequestTable requests={requests} onEdit={handleEditRequest} onDelete={handleDeleteConfirm} />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      {isNewRequestDialogOpen && (
        <CreateOvertimeRequestDialog
          isOpen={isNewRequestDialogOpen}
          onOpenChange={setIsNewRequestDialogOpen}
          onSubmit={handleCreateRequest}
        />
      )}

      {/* Edit Dialog */}
      {currentRequest && isEditDialogOpen && (
        <EditOvertimeRequestDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          request={currentRequest}
          onSubmit={handleUpdateRequest}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <DeleteOvertimeRequestDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteRequest}
        />
      )}
    </div>
  )
}
