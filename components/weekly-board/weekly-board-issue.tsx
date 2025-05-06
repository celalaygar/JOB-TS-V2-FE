"use client"

import type React from "react"

import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { useDispatch } from "react-redux"
import { toggleIssueCompletion, removeHourlyIssue } from "@/lib/redux/features/weekly-board-slice"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { EditHourlyIssueDialog } from "@/components/weekly-board/edit-hourly-issue-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { HourlyIssue } from "@/lib/redux/features/weekly-board-slice"

interface WeeklyBoardIssueProps {
  issue: HourlyIssue
  index: number
}

export function WeeklyBoardIssue({ issue, index }: WeeklyBoardIssueProps) {
  const dispatch = useDispatch()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleToggleCompletion = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toggleIssueCompletion(issue.id))
  }

  const handleDelete = () => {
    dispatch(removeHourlyIssue(issue.id))
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Draggable draggableId={issue.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              group relative p-2 mb-1 rounded-md border text-sm
              ${issue.color || "bg-white border-gray-200"}
              ${issue.completed ? "opacity-70" : ""}
              ${snapshot.isDragging ? "shadow-lg" : ""}
            `}
          >
            <div className="flex items-start gap-2">
              <Checkbox
                checked={issue.completed}
                onCheckedChange={() => dispatch(toggleIssueCompletion(issue.id))}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4
                    className={`font-medium text-sm ${issue.completed ? "line-through text-[var(--fixed-sidebar-muted)]" : ""}`}
                  >
                    {issue.title}
                  </h4>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[var(--fixed-danger)]"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {issue.projectName && (
                  <p className="text-xs text-[var(--fixed-sidebar-muted)] truncate mt-1">{issue.projectName}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Edit Dialog */}
      <EditHourlyIssueDialog issue={issue} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
