"use client"

import { useCallback, useEffect, useState } from "react"
import { tasks } from "@/data/tasks"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Eye, Loader2, MoreHorizontal, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ProjectTask, ProjectTaskPriority, ProjectTaskSystemStatus } from "@/types/task"
import { Project } from "@/types/project"
import { getSubTasksByProjectTaskIdkHelper } from "@/lib/service/api-helpers"

interface TaskRelatedTasksProps {
  taskId: string
  parentTask: ProjectTask | null
  onCreateSubtask: () => void
  onEditTask?: (taskId: string) => void
}

export function TaskRelatedTasks({ parentTask, taskId, onCreateSubtask, onEditTask }: TaskRelatedTasksProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [relatedTab, setRelatedTab] = useState("subtasks")

  const [loading, setLoading] = useState(false);
  const [projectSubTasks, setProjecSubtTasks] = useState<ProjectTask[] | null>(null)





  // Apply filters and search
  const filterAndSearch = (taskList: any[]) => {
    return taskList.filter((task) => {
      // Apply type filter
      if (filterType !== "all" && task?.taskType !== filterType) return false

      // Apply status filter
      if (filterStatus !== "all" && task?.status !== filterStatus) return false

      // Apply search
      if (
        searchQuery &&
        !task?.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task?.taskNumber.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }


  const handleEditTaskClick = (id: string) => {
    if (onEditTask) {
      onEditTask(id)
    }
  }

  const fetchProjectTaskDetail = useCallback(async () => {
    const response: ProjectTask[] | null = await getSubTasksByProjectTaskIdkHelper(taskId, { setLoading });
    if (response) {
      setProjecSubtTasks(response);

    }
  }, [taskId]);

  useEffect(() => {
    fetchProjectTaskDetail();
  }, [fetchProjectTaskDetail])




  return loading ?
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-center" >
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </div >
    :
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-medium">Related Tasks</h3>
          <Button size="sm" onClick={onCreateSubtask}>
            <Plus className="h-4 w-4 mr-1" />
            Add Subtask
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setRelatedTab("subtasks")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                relatedTab === "subtasks" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Subtasks ({projectSubTasks?.length})
            </button>
            <button
              onClick={() => setRelatedTab("siblings")}
              disabled={!parentTask}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !parentTask && "opacity-50 cursor-not-allowed",
                relatedTab === "siblings" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Siblings ({projectSubTasks?.length})
            </button>
            <button
              onClick={() => setRelatedTab("project")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                relatedTab === "project" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Project Tasks
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="subtask">Subtask</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="to-do">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            {relatedTab === "subtasks" && projectSubTasks && renderTasksTable(projectSubTasks, handleEditTaskClick)}

            {relatedTab === "siblings" &&
              (parentTask ? (
                <>
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Parent Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {parentTask.taskNumber}
                          </Badge>
                          <span className="font-medium">{parentTask.title}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditTaskClick(parentTask.id)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/tasks/${parentTask.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p className="line-clamp-2">{parentTask.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {projectSubTasks && renderTasksTable(projectSubTasks, handleEditTaskClick)}
                </>
              ) : (
                <div className="text-center p-6 border rounded-md">
                  <p className="text-muted-foreground">This task is not a subtask of any parent task</p>
                </div>
              ))}

            {relatedTab === "project" && projectSubTasks && renderTasksTable(projectSubTasks, handleEditTaskClick)}
          </div>
        </div>
      </div>
    </>
}

function renderTasksTable(tasksList: ProjectTask[], onEditTask: (taskId: string) => void) {
  if (tasksList.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <p className="text-muted-foreground mb-2">No tasks found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
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
          {tasksList.map((task: ProjectTask) => {
            // Get the assignee data from the users data folder 

            return (
              <TableRow key={task?.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {task?.taskNumber}
                    </Badge>
                    <span className="line-clamp-1">{task?.title}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{task?.taskType}</TableCell>
                <TableCell>
                  <Badge
                    className={task?.projectTaskStatus ? "bg-[" + task?.projectTaskStatus.color + "]" : "bg-green-500 text-white"}
                  >
                    {task?.projectTaskStatus.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      task?.priority === ProjectTaskPriority.HIGH
                        ? "bg-red-500 text-white"
                        : task?.priority === ProjectTaskPriority.MEDIUM
                          ? "bg-yellow-500 text-white"
                          : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {task?.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={"/placeholder.svg"} alt={task.createdBy?.email} />
                      <AvatarFallback>{task.createdBy?.email}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{task.createdBy?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/tasks/${task?.id}`} className="flex items-center cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditTask(task?.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
