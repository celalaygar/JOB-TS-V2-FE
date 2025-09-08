"use client"

import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { ProjectTask, ProjectTaskFilterRequest, TaskResponse } from "@/types/task"
import { getAllProjectTaskHelper } from "@/lib/service/api-helpers"
import { setTasks } from "@/lib/redux/features/tasks-slice"
import { Badge } from "@/components/ui/badge"
import { getPriorityClassName } from "@/lib/utils/priority-utils"
import { useRouter } from "next/navigation"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import { formatDateTime } from "@/lib/utils/date-format"
import { useLanguage } from "@/lib/i18n/context"

export function RecentTasks() {
  const allTasks: ProjectTask[] | null = useSelector((state: RootState) => state.tasks.tasks)
  const { translations } = useLanguage()

  const authUser = useAuthUser()
  const router = useRouter()

  const dispatch = useDispatch()
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<ProjectTaskFilterRequest>({
    search: "",
    projectId: "all",
    projectTaskStatusId: "all",
    priority: "all",
    assigneeId: "",
    taskType: "all",
    taskNumber: "",
    title: "",
    description: "",
  })

  const fetchAllProjectTasks = useCallback(async () => {
    let filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as ProjectTaskFilterRequest

    const response: TaskResponse | null = await getAllProjectTaskHelper(0, 20, filter, { setLoading })
    if (response) {
      dispatch(setTasks(response.content))
    }
  }, [])

  useEffect(() => {
    fetchAllProjectTasks()
  }, [fetchAllProjectTasks])

  return (
    <Card className="col-span-1 fixed-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{translations.dashboard.tasks}</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            {translations.dashboard.latestTasks}
          </CardDescription>
        </div>
        <Link href="/tasks" className="fixed-secondary-button h-9 px-3 py-2 rounded-md text-sm font-medium">
          {translations.dashboard.viewAll}
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!!allTasks && allTasks.map((singleTask: ProjectTask) => (
            <div
              key={singleTask.id}
              className="flex items-center justify-between space-x-4 p-2 hover:bg-[var(--fixed-secondary)]"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={"/placeholder.svg"} alt={singleTask.assignee.email} />
                  <AvatarFallback>{singleTask.assignee.email}</AvatarFallback>
                </Avatar>
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/tasks/${singleTask.id}`)}
                >
                  <p className="text-sm font-medium leading-none">{singleTask.title}</p>
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                    {singleTask.taskNumber}
                  </p>
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                    {singleTask.createdProject.name} · {formatDateTime(new Date(singleTask.createdAt).toLocaleDateString())}
                  </p>
                </div>
              </div>
              <Badge className={`${getPriorityClassName(singleTask.priority)}`}>
                {singleTask.priority}
              </Badge>
            </div>
          ))}

          {!!allTasks && allTasks.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[var(--fixed-sidebar-muted)]">
                {translations.dashboard.noTasksFound}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
