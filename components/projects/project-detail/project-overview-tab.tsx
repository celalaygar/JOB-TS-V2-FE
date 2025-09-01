import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/context"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

interface ProjectOverviewTabProps {
  project: Project
  tasks: Task[]
}

export function ProjectOverviewTab({ project, tasks }: ProjectOverviewTabProps) {
  const { translations } = useLanguage()

  const openTasks = tasks?.filter((task) => task.status === "to-do").length || 0
  const inProgressTasks = tasks?.filter((task) => task.status === "in-progress").length || 0
  const reviewTasks = tasks?.filter((task) => task.status === "review").length || 0
  const completedTasks = tasks?.filter((task) => task.status === "done").length || 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{translations.projects.details}</CardTitle>
          <CardDescription>{translations.projects.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {translations.projects.projectDescription}
            </p>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="tags">{translations.projects.tags}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="my-2 flex items-center gap-1 bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {translations.projects.startDate}
            </p>
            <p className="text-sm text-muted-foreground">{project.startDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {translations.projects.endDate}
            </p>
            <p className="text-sm text-muted-foreground">{project.endDate}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{translations.projects.statisticsTitle}</CardTitle>
          <CardDescription>{translations.projects.statisticsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{openTasks}</p>
            <p className="text-sm text-muted-foreground">
              {translations.projects.openTasks}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{inProgressTasks}</p>
            <p className="text-sm text-muted-foreground">
              {translations.projects.inProgressTasks}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{reviewTasks}</p>
            <p className="text-sm text-muted-foreground">
              {translations.projects.reviewTasks}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{completedTasks}</p>
            <p className="text-sm text-muted-foreground">
              {translations.projects.completedTasks}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
