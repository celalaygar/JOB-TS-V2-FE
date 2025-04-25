"use client"
import { WeeklyBoardHour } from "@/components/weekly-board/weekly-board-hour"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HourlyIssue } from "@/lib/redux/features/weekly-board-slice"

interface WeeklyBoardDayProps {
  day: string
  displayName: string
  displayDate: string
  workingHours: number[]
  issues: HourlyIssue[]
  onAddIssue: (hour: number) => void
}

export function WeeklyBoardDay({
  day,
  displayName,
  displayDate,
  workingHours,
  issues,
  onAddIssue,
}: WeeklyBoardDayProps) {
  // Check if today
  const isToday = new Date().toDateString() === new Date(displayDate).toDateString()

  // Count issues for this day
  const issueCount = issues.length
  const completedCount = issues.filter((issue) => issue.completed).length

  return (
    <Card className={`h-full ${isToday ? "border-[var(--fixed-primary)]" : "border-[var(--fixed-card-border)]"}`}>
      <CardHeader className={`py-3 px-4 ${isToday ? "bg-[var(--fixed-primary)]/10" : ""}`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">{displayName}</CardTitle>
            <p className="text-sm text-[var(--fixed-sidebar-muted)]">{displayDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {isToday && <Badge className="bg-[var(--fixed-primary)] text-white">Today</Badge>}
            <Badge variant="outline" className="border-[var(--fixed-card-border)]">
              {completedCount}/{issueCount}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        {workingHours.map((hour) => {
          const hourIssues = issues.filter((issue) => issue.hour === hour)

          return (
            <WeeklyBoardHour
              key={`${day}-${hour}`}
              day={day}
              hour={hour}
              issues={hourIssues}
              onAddIssue={() => onAddIssue(hour)}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
