"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { type LeaveRequest, sampleLeaveRequests } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"

import { LeaveRequestTable } from "@/components/requests/leave/leave-request-table"
import { CreateLeaveRequestDialog } from "@/components/requests/leave/create-leave-request-dialog"
import { EditLeaveRequestDialog } from "@/components/requests/leave/edit-leave-request-dialog"
import { DeleteLeaveRequestDialog } from "@/components/requests/leave/delete-leave-request-dialog"

export default function LeaveRequestClientPage() {
  const { toast } = useToast()
  const { translations } = useLanguage()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)

  // Get translations based on language

  // Load sample data
  useEffect(() => {
    setRequests(sampleLeaveRequests)
  }, [])

  // Handle create request
  const handleCreateRequest = (newRequest: LeaveRequest) => {
    setRequests([newRequest, ...requests])
    setIsCreateDialogOpen(false)

    toast({
      title: translations.requests.leave.requestCreated,
      description: translations.requests.leave.requestCreatedMessage,
    })
  }

  // Handle edit button click
  const handleEditClick = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsEditDialogOpen(true)
  }

  // Handle update request
  const handleUpdateRequest = (updatedRequest: LeaveRequest) => {
    const updatedRequests = requests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))

    setRequests(updatedRequests)
    setIsEditDialogOpen(false)

    toast({
      title: translations.requests.leave.requestUpdated,
      description: translations.requests.leave.requestUpdatedMessage,
    })
  }

  // Handle delete button click
  const handleDeleteClick = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete request
  const handleDeleteRequest = (requestId: string) => {
    const updatedRequests = requests.filter((req) => req.id !== requestId)
    setRequests(updatedRequests)
    setIsDeleteDialogOpen(false)

    toast({
      title: translations.requests.leave.requestDeleted,
      description: translations.requests.leave.requestDeletedMessage,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{translations.requests.leave.title}</h1>
        <p className="text-muted-foreground">{translations.requests.leave.description}</p>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{translations.requests.leave.myRequests}</CardTitle>
            <CardDescription>{translations.requests.leave.myRequestsDescription}</CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {translations.requests.leave.newRequest}
          </Button>
        </CardHeader>
        <CardContent>
          <LeaveRequestTable requests={requests} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CreateLeaveRequestDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRequest}
      />

      {/* Edit Dialog */}
      {selectedRequest && (
        <EditLeaveRequestDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          request={selectedRequest}
          onSubmit={handleUpdateRequest}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedRequest && (
        <DeleteLeaveRequestDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          request={selectedRequest}
          onConfirm={handleDeleteRequest}
        />
      )}
    </div>
  )
}
