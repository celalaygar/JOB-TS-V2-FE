"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { SpendingRequestTable } from "@/components/requests/spending/spending-request-table"
import { CreateSpendingRequestDialog } from "@/components/requests/spending/create-spending-request-dialog"
import { EditSpendingRequestDialog } from "@/components/requests/spending/edit-spending-request-dialog"
import { DeleteSpendingRequestDialog } from "@/components/requests/spending/delete-spending-request-dialog"
import { spendingRequests, type SpendingRequest } from "@/data/spending-requests"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

export default function SpendingRequestClientPage() {
  const { translations, language } = useLanguage()

  // State for requests
  const [requests, setRequests] = useState<SpendingRequest[]>(spendingRequests)

  // Get current year
  const currentYear = new Date().getFullYear()

  // Get unique years from requests
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    requests.forEach((request) => {
      years.add(new Date(request.receiptDate).getFullYear())
    })
    // Add current year if not already in the set
    years.add(currentYear)
    return Array.from(years).sort((a, b) => b - a) // Sort descending
  }, [requests, currentYear])

  // State for selected year
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  // Filter requests by selected year
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => new Date(request.receiptDate).getFullYear() === selectedYear)
  }, [requests, selectedYear])

  // Calculate total amount for the selected year
  const totalAmount = useMemo(() => {
    return filteredRequests.reduce((sum, request) => sum + request.amount, 0)
  }, [filteredRequests])

  // Check if request is from a previous year
  const isFromPreviousYear = (request: SpendingRequest) => {
    const requestYear = new Date(request.receiptDate).getFullYear()
    return requestYear < currentYear
  }

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
    if (isFromPreviousYear(request)) {
      toast({
        title: translations.requests.spending.cannotEditPastRequest,
        description: translations.requests.spending.cannotEditPastRequestMessage,
        variant: "destructive",
      })
      return
    }

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
    if (isFromPreviousYear(request)) {
      toast({
        title: translations.requests.spending.cannotDeletePastRequest,
        description: translations.requests.spending.cannotDeletePastRequestMessage,
        variant: "destructive",
      })
      return
    }

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{translations.requests.spending.title}</h1>
          <p className="text-muted-foreground">{translations.requests.spending.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center justify-center"
          >
            <span className="mr-2">+</span>
            {translations.requests.spending.newRequest}
          </button>
        </div>
      </div>

      <div className="flex justify-start mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium whitespace-nowrap">Working Year:</span>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={translations.requests.spending.selectYear} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-around items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{translations.requests.spending.totalAmount}</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{translations.requests.spending.totalRequests}</p>
                <p className="text-2xl font-bold">{filteredRequests.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <SpendingRequestTable
          requests={filteredRequests}
          onEdit={handleEditRequest}
          onDelete={handleDeleteRequest}
          isFromPreviousYear={isFromPreviousYear}
        />
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
