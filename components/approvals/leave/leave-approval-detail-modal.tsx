"use client"

import { format } from "date-fns"
import { tr as trLocale } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CalendarDays } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"
import { UserDetailCard } from "../shared/user-detail-card"
import { LeaveApprovalRequest } from "@/types/approval-request"

interface LeaveApprovalDetailModalProps {
  request: LeaveApprovalRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: () => void
  onReject: () => void
}

export function LeaveApprovalDetailModal({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: LeaveApprovalDetailModalProps) {
  const { translations, language } = useLanguage()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "PPP", { locale: language === "tr" ? trLocale : undefined })
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-yellow-500 text-white"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Leave Request Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Request Details</TabsTrigger>
            <TabsTrigger value="requester">Requester Information</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <Badge className={getStatusColor(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Leave Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{request.leaveType}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Start Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDate(request.startDate)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">End Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formatDate(request.endDate)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reason</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{request.reason || "No reason provided."}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Request Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      Submitted on {formatDate(request.createdAt)} at{" "}
                      {format(new Date(request.createdAt), "p", { locale: language === "tr" ? trLocale : undefined })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requester" className="mt-4">
            <UserDetailCard user={request.requester} />
          </TabsContent>
        </Tabs>

        {request.status === "pending" && (
          <DialogFooter className="flex justify-between sm:justify-end gap-2 mt-4">
            <Button variant="destructive" onClick={onReject}>
              Reject Request
            </Button>
            <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
              Approve Request
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
