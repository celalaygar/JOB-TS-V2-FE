"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sprint } from "@/types/sprint"
import { ProjectTask } from "@/types/task"
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from "lucide-react"

interface SprintDetailProgressProps {
  sprint: Sprint
  tasks: ProjectTask[] | []
}

export function SprintDetailProgress({ sprint, tasks }: SprintDetailProgressProps) {
  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: ProjectTask) => task.status === "done").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate days remaining
  const today = new Date()
  const endDate = new Date(sprint.endDate)
  const startDate = new Date(sprint.startDate)

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const daysElapsed = Math.min(totalDays, totalDays - daysRemaining)

  // Calculate ideal burndown (what percentage of tasks should be done by now)
  const idealPercentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100))

  // Calculate if sprint is on track, ahead, or behind
  let sprintStatus = "on-track"
  const difference = completionPercentage - idealPercentage

  if (difference >= 10) {
    sprintStatus = "ahead"
  } else if (difference <= -10) {
    sprintStatus = "behind"
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Sprint Progress</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Track the progress of this sprint</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Overall Completion</h3>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>
              {completedTasks} of {totalTasks} tasks completed
            </span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
        </div>

        {/* Sprint Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Sprint Status</h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">Completed</div>
            </div>
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">In Progress</div>
            </div>
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{blockedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">Blocked</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            {sprintStatus === "ahead" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Ahead of Schedule</div>
                  <div className="text-xs text-muted-foreground">{difference}% ahead of ideal progress</div>
                </div>
              </>
            ) : sprintStatus === "behind" ? (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-sm font-medium">Behind Schedule</div>
                  <div className="text-xs text-muted-foreground">{Math.abs(difference)}% behind ideal progress</div>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">On Track</div>
                  <div className="text-xs text-muted-foreground">Progress is aligned with timeline</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Time Remaining */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Timeline</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Days Elapsed:</span>
              <span className="font-medium">{daysElapsed} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Days Remaining:</span>
              <span className="font-medium">{daysRemaining} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Duration:</span>
              <span className="font-medium">{totalDays} days</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs text-muted-foreground">Sprint Timeline</h4>
              <span className="text-xs text-muted-foreground">
                {Math.round((daysElapsed / totalDays) * 100)}% elapsed
              </span>
            </div>
            <Progress value={(daysElapsed / totalDays) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
