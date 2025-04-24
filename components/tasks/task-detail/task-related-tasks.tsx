"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, MoreHorizontal, Plus } from "lucide-react"
import Link from "next/link"
import type { Task } from "@/types/task"

interface TaskRelatedTasksProps {
  taskId: string
  relatedTasks: Task[]
  parentTask?: Task | null
}

export function TaskRelatedTasks({ taskId, relatedTasks, parentTask }: TaskRelatedTasksProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Related Tasks</h3>
        <Button size="sm" asChild>
          <Link href={`/tasks/new?parentTaskId=${taskId}`}>
            <Plus className="h-4 w-4 mr-1" />
            Add Subtask
          </Link>
        </Button>
      </div>

      {relatedTasks.length > 0 ? (
        <div className="rounded-md border border-[var(--fixed-card-border)] overflow-hidden">
          <Table>
            <TableHeader className="bg-[var(--fixed-secondary)]">
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedTasks.map((relatedTask) => (
                <TableRow key={relatedTask.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {relatedTask.taskNumber}
                    </Badge>
                    {relatedTask.title}
                  </TableCell>
                  <TableCell className="capitalize">{relatedTask.taskType}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        relatedTask.status === "to-do"
                          ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                          : relatedTask.status === "in-progress"
                            ? "bg-[var(--fixed-primary)] text-white"
                            : relatedTask.status === "review"
                              ? "bg-[var(--fixed-warning)] text-white"
                              : "bg-[var(--fixed-success)] text-white"
                      }
                    >
                      {relatedTask.status === "to-do"
                        ? "To Do"
                        : relatedTask.status === "in-progress"
                          ? "In Progress"
                          : relatedTask.status === "review"
                            ? "In Review"
                            : "Done"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        relatedTask.priority === "High"
                          ? "bg-[var(--fixed-danger)] text-white"
                          : relatedTask.priority === "Medium"
                            ? "bg-[var(--fixed-warning)] text-white"
                            : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      }
                    >
                      {relatedTask.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={relatedTask.assignee.avatar || "/placeholder.svg"}
                          alt={relatedTask.assignee.name}
                        />
                        <AvatarFallback>{relatedTask.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span>{relatedTask.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--fixed-sidebar-fg)]">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/tasks/${relatedTask.id}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/tasks/${relatedTask.id}/edit`} className="flex items-center cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-6 border rounded-md">
          <p className="text-muted-foreground mb-2">No related tasks found</p>
          <Button size="sm" asChild>
            <Link href={`/tasks/new?parentTaskId=${taskId}`}>
              <Plus className="h-4 w-4 mr-1" />
              Create Subtask
            </Link>
          </Button>
        </div>
      )}

      {parentTask && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Parent Task</h3>
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {parentTask.taskNumber}
                </Badge>
                <span className="font-medium">{parentTask.title}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tasks/${parentTask.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
