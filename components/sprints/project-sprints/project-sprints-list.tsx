"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Edit, Eye, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { format } from "date-fns"
import { Sprint } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"

interface ProjectSprintsListProps {
  sprints: Sprint[]
  onEditSprint: (sprint: Sprint) => void
  onDeleteSprint: (id: string) => void
}

export function ProjectSprintsList({ sprints, onEditSprint, onDeleteSprint }: ProjectSprintsListProps) {
  const { translations } = useLanguage()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">{translations.sprint.statusOptions.active}</Badge>
      case "planned":
        return <Badge variant="outline" className="border-[var(--fixed-card-border)]">{translations.sprint.statusOptions.planned}</Badge>
      case "completed":
        return <Badge variant="secondary" className="bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">{translations.sprint.statusOptions.completed}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (sprints.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--fixed-card-bg)] border border-[var(--fixed-card-border)] rounded-lg">
        <h3 className="text-lg font-medium">{translations.sprint.noSprints}</h3>
        <p className="text-[var(--fixed-sidebar-muted)] mt-1">Try adjusting your filters or create a new sprint.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sprints.map((sprint: Sprint) => (
        <Card key={sprint.id} className="fixed-card hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="truncate" title={sprint.name}>{sprint.name}</CardTitle>
              {getStatusBadge(sprint.status)}
            </div>
            <CardDescription className="text-[var(--fixed-sidebar-muted)] flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {format(new Date(sprint.startDate), "MMM d")} - {format(new Date(sprint.endDate), "MMM d, yyyy")}
            </CardDescription>
            <CardDescription className="text-[var(--fixed-sidebar-muted)] flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              {sprint.createdProject.name}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div>{translations.sprint.form.view}</div>
                <div className="font-medium">
                  {Math.round((sprint.completedIssues / (sprint.totalIssues || 1)) * 100)}%
                </div>
              </div>
              <Progress value={(sprint.completedIssues / (sprint.totalIssues || 1)) * 100} className="h-2 bg-[var(--fixed-secondary)]" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                {sprint.team && sprint.team.length > 0 ? (
                  <div className="flex items-center">
                    <span className="mr-2">{translations.sprint.form.edit}:</span>
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
                  <span className="text-[var(--fixed-sidebar-muted)]">{translations.sprint.projectWideSprint}</span>
                )}
              </div>
              <div className="text-sm text-[var(--fixed-sidebar-muted)]">{sprint.totalIssues} {translations.sprint.tasksLabel}</div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            <Button variant="outline" size="sm" asChild className="border-[var(--fixed-card-border)] text-sm">
              <Link href={`/project-sprints/${sprint.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                {translations.sprint.form.view}
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-[var(--fixed-card-border)] text-sm" onClick={() => onEditSprint(sprint)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">{translations.sprint.form.edit}</span>
              </Button>
              <Button variant="outline" size="sm" className="border-[var(--fixed-danger)] text-[var(--fixed-danger)] text-sm" onClick={() => onDeleteSprint(sprint.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1">{translations.sprint.form.delete}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
