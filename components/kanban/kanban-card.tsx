"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, MessageSquare, MoreHorizontal, Tag } from "lucide-react"
import { IssueDetailsDialog } from "@/components/issues/issue-details-dialog"
import type { Issue } from "@/types/issue"
import { formatDistanceToNow } from "date-fns"

interface KanbanCardProps {
  issue: Issue
}

export function KanbanCard({ issue }: KanbanCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200"
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Format date for display
  const getFormattedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Count comments
  const commentCount = issue.comments?.filter((c) => !c.isActivity).length || 0

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
        onClick={() => setIsDetailsOpen(true)}
      >
        <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-sm font-medium line-clamp-2">{issue.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Move to To Do</DropdownMenuItem>
              <DropdownMenuItem>Move to In Progress</DropdownMenuItem>
              <DropdownMenuItem>Move to Review</DropdownMenuItem>
              <DropdownMenuItem>Move to Done</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <span className="font-medium text-foreground">{issue.projectName}</span>
            <span>•</span>
            <span className="font-mono">{issue.issueNumber}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={getPriorityVariant(issue.priority)}>
              {issue.priority}
            </Badge>

            {/* Example labels - in a real app, these would come from the issue data */}
            {issue.id.includes("1") && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Tag className="h-3 w-3 mr-1" />
                Feature
              </Badge>
            )}
            {issue.id.includes("3") && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Tag className="h-3 w-3 mr-1" />
                API
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getFormattedDate(issue.createdAt)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created {new Date(issue.createdAt).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {commentCount > 0 && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {commentCount}
                </div>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} alt={issue.assignee.name} />
                    <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{issue.assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <IssueDetailsDialog issueId={issue.id} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
    </>
  )
}
