"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OvertimeRequestTable } from "@/components/requests/overtime/overtime-request-table"
import { CreateOvertimeRequestDialog } from "@/components/requests/overtime/create-overtime-request-dialog"
import { EditOvertimeRequestDialog } from "@/components/requests/overtime/edit-overtime-request-dialog"
import { DeleteOvertimeRequestDialog } from "@/components/requests/overtime/delete-overtime-request-dialog"
import { type OvertimeRequest, sampleOvertimeRequests } from "@/data/overtime-requests"
import { Calendar, Clock, PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Fix the getWorkingYears function to use startDateTime instead of date
const getWorkingYears = (requests: OvertimeRequest[]) => {
  const currentYear = new Date().getFullYear()
  const years = new Set<number>()

  // Add current year and past 5 years
  for (let i = 0; i < 6; i++) {
    years.add(currentYear - i)
  }

  // Add years from existing requests
  requests.forEach((request) => {
    years.add(new Date(request.startDateTime).getFullYear())
  })

  return Array.from(years).sort((a, b) => b - a) // Sort descending
}

export function OvertimeRequestClientPage() {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const t = translations.requests.overtime

  // State for requests
  const [requests, setRequests] = useState<OvertimeRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<OvertimeRequest[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [workingYears, setWorkingYears] = useState<number[]>([])
  const [totalStats, setTotalStats] = useState({ days: 0, hours: 0 })

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

  // Update working years when requests change
  useEffect(() => {
    setWorkingYears(getWorkingYears(requests))
  }, [requests])

  // Fix the filter function to use startDateTime instead of date
  useEffect(() => {
    const filtered = requests.filter((request) => {
      const requestYear = new Date(request.startDateTime).getFullYear()
      return requestYear === selectedYear
    })
    setFilteredRequests(filtered)

    // Calculate totals
    const totals = filtered.reduce(
      (acc, request) => {
        // Calculate duration in hours
        const start = new Date(request.startDateTime)
        const end = new Date(request.endDateTime)
        const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

        // Calculate days (assuming 8 hours per day)
        const days = durationHours / 8

        return {
          days: acc.days + days,
          hours: acc.hours + durationHours,
        }
      },
      { days: 0, hours: 0 },
    )

    setTotalStats(totals)
  }, [requests, selectedYear])

  // Fix the isRequestFromPreviousYear function to use startDateTime instead of date
  const isRequestFromPreviousYear = (request: OvertimeRequest) => {
    const requestYear = new Date(request.startDateTime).getFullYear()
    const currentYear = new Date().getFullYear()
    return requestYear < currentYear
  }

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
    // Prevent editing requests from previous years
    if (isRequestFromPreviousYear(request)) {
      toast({
        title: "Cannot edit previous year request",
        description: "You cannot modify overtime requests from previous working years.",
        variant: "destructive",
      })
      return
    }

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
    const request = requests.find((req) => req.id === id)

    // Prevent deleting requests from previous years
    if (request && isRequestFromPreviousYear(request)) {
      toast({
        title: "Cannot delete previous year request",
        description: "You cannot delete overtime requests from previous working years.",
        variant: "destructive",
      })
      return
    }

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
    <div className="container mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Responsive Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Working Year:</span>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {workingYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsNewRequestDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.newRequest}
          </Button>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.myRequests}</CardTitle>
          <CardDescription>{t.myRequestsDescription}</CardDescription>
        </CardHeader>

        {/* Summary Statistics */}
        <div className="border-t border-b px-4 sm:px-6 py-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Overtime Days</div>
                <div className="text-xl sm:text-2xl font-bold">{totalStats.days.toFixed(1)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Overtime Hours</div>
                <div className="text-xl sm:text-2xl font-bold">{totalStats.hours.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-6 px-2 sm:px-6">
          <div className="overflow-x-auto">
            <OvertimeRequestTable
              requests={filteredRequests}
              onEdit={handleEditRequest}
              onDelete={handleDeleteConfirm}
              isEditable={(request) => !isRequestFromPreviousYear(request)}
            />
          </div>
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
