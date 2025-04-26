"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { type LeaveRequest, sampleLeaveRequests, calculateLeaveWorkTime } from "@/data/leave-requests"
import { useLanguage } from "@/lib/i18n/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { LeaveRequestTable } from "@/components/requests/leave/leave-request-table"
import { CreateLeaveRequestDialog } from "@/components/requests/leave/create-leave-request-dialog"
import { EditLeaveRequestDialog } from "@/components/requests/leave/edit-leave-request-dialog"
import { DeleteLeaveRequestDialog } from "@/components/requests/leave/delete-leave-request-dialog"
import { v4 as uuidv4 } from "uuid"

// Define a function to get working years
const getWorkingYears = (requests: LeaveRequest[]) => {
  const currentYear = new Date().getFullYear()
  const years = new Set<number>()

  // Add current year and past 5 years
  for (let i = 0; i < 6; i++) {
    years.add(currentYear - i)
  }

  // Add years from existing requests
  requests.forEach((request) => {
    if (request.year) {
      years.add(request.year)
    }
  })

  return Array.from(years).sort((a, b) => b - a) // Sort descending
}

export default function LeaveRequestClientPage() {
  const { toast } = useToast()
  const { translations } = useLanguage()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [workingYears, setWorkingYears] = useState<number[]>([])
  const [totalStats, setTotalStats] = useState({ days: 0, hours: 0 })

  // Load sample data
  useEffect(() => {
    setRequests(sampleLeaveRequests)
  }, [])

  // Update working years when requests change
  useEffect(() => {
    setWorkingYears(getWorkingYears(requests))
  }, [requests])

  // Filter requests by selected year and calculate totals
  useEffect(() => {
    const filtered = requests.filter(
      (request) =>
        request.year === selectedYear || (request.startDate && request.startDate.getFullYear() === selectedYear),
    )
    setFilteredRequests(filtered)

    // Calculate totals
    const totals = filtered.reduce(
      (acc, request) => {
        return {
          days: acc.days + (request.workDays || 0),
          hours: acc.hours + (request.workHours || 0),
        }
      },
      { days: 0, hours: 0 },
    )

    setTotalStats(totals)
  }, [requests, selectedYear])

  // Check if a request is from a previous year (not editable)
  const isRequestFromPreviousYear = (request: LeaveRequest) => {
    const requestYear = request.year || request.startDate.getFullYear()
    const currentYear = new Date().getFullYear()
    return requestYear < currentYear
  }

  // Handle create request
  const handleCreateRequest = (newRequest: any) => {
    // Add missing fields
    const completeRequest: LeaveRequest = {
      id: uuidv4(),
      createdAt: new Date(),
      status: "pending",
      userId: "user1",
      ...newRequest,
      // Calculate work hours and days if not provided
      workHours:
        newRequest.workHours ||
        calculateLeaveWorkTime(newRequest.startDate, newRequest.endDate, newRequest.startTime, newRequest.endTime)
          .workHours,
      workDays:
        newRequest.workDays ||
        calculateLeaveWorkTime(newRequest.startDate, newRequest.endDate, newRequest.startTime, newRequest.endTime)
          .workDays,
      year: newRequest.startDate.getFullYear(),
    }

    setRequests([completeRequest, ...requests])
    setIsCreateDialogOpen(false)

    toast({
      title: translations.requests.leave.requestCreated,
      description: translations.requests.leave.requestCreatedMessage,
    })
  }

  // Handle edit button click
  const handleEditClick = (request: LeaveRequest) => {
    // Prevent editing requests from previous years
    if (isRequestFromPreviousYear(request)) {
      toast({
        title: "Cannot edit previous year request",
        description: "You cannot modify leave requests from previous working years.",
        variant: "destructive",
      })
      return
    }

    setSelectedRequest(request)
    setIsEditDialogOpen(true)
  }

  // Handle update request
  const handleUpdateRequest = (updatedRequest: any) => {
    // Ensure work time calculations are updated
    const { workHours, workDays } = calculateLeaveWorkTime(
      updatedRequest.startDate,
      updatedRequest.endDate,
      updatedRequest.startTime,
      updatedRequest.endTime,
    )

    const completeUpdatedRequest = {
      ...updatedRequest,
      workHours,
      workDays,
      year: updatedRequest.startDate.getFullYear(),
    }

    const updatedRequests = requests.map((req) => (req.id === completeUpdatedRequest.id ? completeUpdatedRequest : req))

    setRequests(updatedRequests)
    setIsEditDialogOpen(false)

    toast({
      title: translations.requests.leave.requestUpdated,
      description: translations.requests.leave.requestUpdatedMessage,
    })
  }

  // Handle delete button click
  const handleDeleteClick = (request: LeaveRequest) => {
    // Prevent deleting requests from previous years
    if (isRequestFromPreviousYear(request)) {
      toast({
        title: "Cannot delete previous year request",
        description: "You cannot delete leave requests from previous working years.",
        variant: "destructive",
      })
      return
    }

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
    <div className="container mx-auto py-6 px-4 sm:px-6">
      {/* Responsive Header */}
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{translations.requests.leave.title}</h1>
          <p className="text-muted-foreground">{translations.requests.leave.description}</p>
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
          <Button className="w-full sm:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {translations.requests.leave.newRequest}
          </Button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>{translations.requests.leave.myRequests}</CardTitle>
          <CardDescription>{translations.requests.leave.myRequestsDescription}</CardDescription>
        </CardHeader>

        {/* Summary Statistics */}
        <div className="border-t border-b px-4 sm:px-6 py-4 bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Annual Leave Days</div>
                <div className="text-xl sm:text-2xl font-bold">{totalStats.days.toFixed(1)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Annual Leave Hours</div>
                <div className="text-xl sm:text-2xl font-bold">{totalStats.hours.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-6 px-2 sm:px-6">
          <div className="overflow-x-auto">
            <LeaveRequestTable
              requests={filteredRequests}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isEditable={(request) => !isRequestFromPreviousYear(request)}
            />
          </div>
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
