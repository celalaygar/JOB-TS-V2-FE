"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/i18n/context"
import { Sprint } from "@/types/sprint"
import { ProjectTask } from "@/types/task"
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from "lucide-react"

interface SprintDetailProgressProps {
  sprint: Sprint
  tasks: ProjectTask[] | []
}

export function SprintDetailProgress({ sprint, tasks }: SprintDetailProgressProps) {
  const { translations } = useLanguage()
  const t = translations.sprint.progress

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task: ProjectTask) => task.status === "done").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const blockedTasks = tasks.filter((task) => task.status === "blocked").length

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const today = new Date()
  const endDate = new Date(sprint.endDate)
  const startDate = new Date(sprint.startDate)

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  const daysElapsed = Math.min(totalDays, totalDays - daysRemaining)

  const idealPercentage = Math.min(100, Math.round((daysElapsed / totalDays) * 100))
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
          <CardTitle>{t.title}</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">{t.overallCompletion}</h3>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{t.tasksCompleted.replace("{completed}", String(completedTasks)).replace("{total}", String(totalTasks))}</span>
            <span>{t.tasksRemaining.replace("{remaining}", String(totalTasks - completedTasks))}</span>
          </div>
        </div>

        {/* Sprint Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t.sprintStatus}</h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.completed}</div>
            </div>
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{inProgressTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.inProgress}</div>
            </div>
            <div className="bg-muted p-3 rounded-md text-center">
              <div className="text-2xl font-bold">{blockedTasks}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.blocked}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            {sprintStatus === "ahead" ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">{t.ahead}</div>
                  <div className="text-xs text-muted-foreground">{t.aheadDescription.replace("{difference}", String(difference))}</div>
                </div>
              </>
            ) : sprintStatus === "behind" ? (
              <>
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-sm font-medium">{t.behind}</div>
                  <div className="text-xs text-muted-foreground">{t.behindDescription.replace("{difference}", String(Math.abs(difference)))}</div>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">{t.onTrack}</div>
                  <div className="text-xs text-muted-foreground">{t.onTrackDescription}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Time Remaining */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t.timeline}</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t.daysElapsed}</span>
              <span className="font-medium">{daysElapsed} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t.daysRemaining}</span>
              <span className="font-medium">{daysRemaining} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t.totalDuration}</span>
              <span className="font-medium">{totalDays} days</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs text-muted-foreground">{t.sprintTimeline}</h4>
              <span className="text-xs text-muted-foreground">
                {t.elapsedPercentage.replace("{percentage}", String(Math.round((daysElapsed / totalDays) * 100)))}
              </span>
            </div>
            <Progress value={(daysElapsed / totalDays) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
