import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Project } from "@/types/project"
import type { Task } from "@/types/task"

interface ProjectOverviewTabProps {
  project: Project
  tasks: Task[]
}

export function ProjectOverviewTab({ project, tasks }: ProjectOverviewTabProps) {
  // Calculate project statistics
  const openTasks = tasks?.filter((task) => task.status === "to-do").length || 0
  const inProgressTasks = tasks?.filter((task) => task.status === "in-progress").length || 0
  const reviewTasks = tasks?.filter((task) => task.status === "review").length || 0
  const completedTasks = tasks?.filter((task) => task.status === "done").length || 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Information about the project.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Description</p>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Start Date</p>
            <p className="text-sm text-muted-foreground">{project.startDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">End Date</p>
            <p className="text-sm text-muted-foreground">{project.endDate}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Statistics</CardTitle>
          <CardDescription>Overview of project progress.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{openTasks}</p>
            <p className="text-sm text-muted-foreground">Open Tasks</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{inProgressTasks}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{reviewTasks}</p>
            <p className="text-sm text-muted-foreground">In Review</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-2xl font-bold">{completedTasks}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
