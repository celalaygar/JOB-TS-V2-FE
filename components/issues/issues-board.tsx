"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { issues } from "@/data/issues"

export function IssuesBoard() {
  const [issuesList, setIssuesList] = useState(issues)

  // Group issues by status
  const issuesByStatus = issuesList.reduce(
    (acc, issue) => {
      if (!acc[issue.status]) {
        acc[issue.status] = []
      }
      acc[issue.status].push(issue)
      return acc
    },
    {} as Record<string, typeof issues>,
  )

  const statuses = [
    { id: "open", name: "Open" },
    { id: "in-progress", name: "In Progress" },
    { id: "review", name: "In Review" },
    { id: "done", name: "Done" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statuses.map((status) => (
        <div key={status.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{status.name}</h3>
            <Badge variant="outline">{(issuesByStatus[status.id] || []).length}</Badge>
          </div>
          <div className="space-y-4">
            {(issuesByStatus[status.id] || []).map((issue) => (
              <Card key={issue.id}>
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">{issue.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Move to Open</DropdownMenuItem>
                      <DropdownMenuItem>Move to In Progress</DropdownMenuItem>
                      <DropdownMenuItem>Move to Review</DropdownMenuItem>
                      <DropdownMenuItem>Move to Done</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {issue.project} · #{issue.id.substring(0, 8)}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        issue.priority === "High"
                          ? "destructive"
                          : issue.priority === "Medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {issue.priority}
                    </Badge>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.assignee.avatar} alt={issue.assignee.name} />
                      <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                    </Avatar>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
