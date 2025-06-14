"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Edit, Eye, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { format } from "date-fns"
import type { Sprint } from "@/lib/redux/features/sprints-slice"

interface ProjectSprintsListProps {
  sprints: Sprint[]
  onEditSprint: (id: string) => void
  onDeleteSprint: (id: string) => void
}

export function ProjectSprintsList({ sprints, onEditSprint, onDeleteSprint }: ProjectSprintsListProps) {
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
      case "planned":
        return (
          <Badge variant="outline" className="border-[var(--fixed-card-border)]">
            Planned
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // If no sprints, show empty state
  if (sprints.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--fixed-card-bg)] border border-[var(--fixed-card-border)] rounded-lg">
        <h3 className="text-lg font-medium">No sprints found</h3>
        <p className="text-[var(--fixed-sidebar-muted)] mt-1">Try adjusting your filters or create a new sprint.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sprints.map((sprint) => (
        <Card key={sprint.id} className="fixed-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="truncate" title={sprint.name}>
                {sprint.name}
              </CardTitle>
              {getStatusBadge(sprint.status)}
            </div>
            <CardDescription className="text-[var(--fixed-sidebar-muted)] flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {format(new Date(sprint.startDate), "MMM d")} - {format(new Date(sprint.endDate), "MMM d, yyyy")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>Progress</div>
                <div className="font-medium">
                  {Math.round((sprint.completedIssues / (sprint.totalIssues || 1)) * 100)}%
                </div>
              </div>
              <Progress
                value={(sprint.completedIssues / (sprint.totalIssues || 1)) * 100}
                className="h-2 bg-[var(--fixed-secondary)]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {sprint.team && sprint.team.length > 0 ? (
                  <div className="flex items-center">
                    <span className="mr-2">Team:</span>
                    <div className="flex -space-x-2">
                      {sprint.team.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-[var(--fixed-card-bg)]">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {sprint.team.length > 3 && (
                        <Avatar className="h-6 w-6 border-2 border-[var(--fixed-card-bg)]">
                          <AvatarFallback>+{sprint.team.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-[var(--fixed-sidebar-muted)]">Project-wide Sprint</span>
                )}
              </div>
              <div className="text-sm text-[var(--fixed-sidebar-muted)]">{sprint.totalIssues} tasks</div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" asChild className="border-[var(--fixed-card-border)]">
              <Link href={`/project-sprints/${sprint.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--fixed-card-border)]"
                onClick={() => onEditSprint(sprint.id)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--fixed-danger)] text-[var(--fixed-danger)]"
                onClick={() => onDeleteSprint(sprint.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">Delete</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
