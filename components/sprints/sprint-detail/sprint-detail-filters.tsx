"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import {
  setTaskStatusFilter,
  setTaskPriorityFilter,
  setTaskTypeFilter,
  setTaskAssigneeFilter,
  setTaskSearchQuery,
  resetTaskFilters,
} from "@/lib/redux/features/filters-slice"

export function SprintDetailFilters() {
  const dispatch = useDispatch()
  const { taskStatusFilter, taskPriorityFilter, taskTypeFilter, taskAssigneeFilter, taskSearchQuery } = useSelector(
    (state: RootState) => state.filters,
  )

  const users = useSelector((state: RootState) => state.users.users)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={taskSearchQuery}
            onChange={(e) => dispatch(setTaskSearchQuery(e.target.value))}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={taskStatusFilter || "all"}
            onValueChange={(value) => dispatch(setTaskStatusFilter(value === "all" ? null : value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={taskPriorityFilter || "all"}
            onValueChange={(value) => dispatch(setTaskPriorityFilter(value === "all" ? null : value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={taskTypeFilter || "all"}
            onValueChange={(value) => dispatch(setTaskTypeFilter(value === "all" ? null : value))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="improvement">Improvement</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={taskAssigneeFilter || "all"}
            onValueChange={(value) => dispatch(setTaskAssigneeFilter(value === "all" ? null : value))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => dispatch(resetTaskFilters())} title="Reset Filters">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Reset Filters</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
