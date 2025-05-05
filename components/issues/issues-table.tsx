"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { IssueDetailsDialog } from "@/components/issues/issue-details-dialog"
import { EditIssueDialog } from "@/components/issues/edit-issue-dialog"
import { useDispatch } from "react-redux"
import { updateIssue, type Issue } from "@/lib/redux/features/issues-slice"

interface IssuesTableProps {
  filters: {
    search: string
    project: string
    status: string
    priority: string
    assignee: string
  }
}

type SortField = "title" | "status" | "priority" | "project" | "assignee"
type SortDirection = "asc" | "desc"

export function IssuesTable({ filters }: IssuesTableProps) {
  const dispatch = useDispatch()
  const allIssues = useSelector((state: RootState) => state.issues.issues)
  const projects = useSelector((state: RootState) => state.projects.projects)

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [issueToEdit, setIssueToEdit] = useState<string | null>(null)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)

  const [sortField, setSortField] = useState<SortField>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Apply filters
  const filteredIssues = allIssues.filter((issue) => {
    // Search filter
    const matchesSearch =
      filters.search === "" ||
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description.toLowerCase().includes(filters.search.toLowerCase())

    // Project filter
    const matchesProject = filters.project === "all" || issue.project === filters.project

    // Status filter
    const matchesStatus = filters.status === "all" || issue.status === filters.status

    // Priority filter
    const matchesPriority = filters.priority === "all" || issue.priority === filters.priority

    // Assignee filter
    const matchesAssignee = filters.assignee === "all" || issue.assignee.id === filters.assignee

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee
  })

  // Apply sorting
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "title":
        comparison = a.title.localeCompare(b.title)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "priority":
        // Sort by priority (High > Medium > Low)
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        comparison =
          (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
          (priorityOrder[b.priority as keyof typeof priorityOrder] || 0)
        break
      case "project":
        comparison = a.projectName.localeCompare(b.projectName)
        break
      case "assignee":
        comparison = a.assignee.name.localeCompare(b.assignee.name)
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const handleDeleteIssue = () => {
    if (issueToDelete) {
      dispatch(
        updateIssue({
          id: issueToDelete,
          changes: { status: "deleted" } as Partial<Issue>,
        }),
      )
      setIssueToDelete(null)
    }
  }

  return (
    <>
      <div className="rounded-md border border-[var(--fixed-card-border)] overflow-hidden">
        <Table>
          <TableHeader className="bg-[var(--fixed-secondary)]">
            <TableRow>
              <TableHead className="w-[40%]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Title {getSortIcon("title")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Status {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("priority")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Priority {getSortIcon("priority")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("project")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Project {getSortIcon("project")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("assignee")}
                  className="flex items-center p-0 hover:bg-transparent hover:text-[var(--fixed-sidebar-fg)]"
                >
                  Assignee {getSortIcon("assignee")}
                </Button>
              </TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedIssues.map((issue) => {
              const project = projects.find((p) => p.id === issue.project)

              return (
                <TableRow
                  key={issue.id}
                  className="cursor-pointer hover:bg-[var(--fixed-secondary)]"
                  onClick={() => setSelectedIssueId(issue.id)}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {issue.issueNumber}
                    </Badge>
                    {issue.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        issue.status === "to-do"
                          ? "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                          : issue.status === "in-progress"
                            ? "bg-[var(--fixed-primary)] text-white"
                            : issue.status === "review"
                              ? "bg-[var(--fixed-warning)] text-white"
                              : "bg-[var(--fixed-success)] text-white"
                      }
                    >
                      {issue.status === "to-do"
                        ? "To Do"
                        : issue.status === "in-progress"
                          ? "In Progress"
                          : issue.status === "review"
                            ? "In Review"
                            : "Done"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        issue.priority === "High"
                          ? "bg-[var(--fixed-danger)] text-white"
                          : issue.priority === "Medium"
                            ? "bg-[var(--fixed-warning)] text-white"
                            : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      }
                    >
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{project?.name || issue.projectName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={issue.assignee.avatar || "/placeholder.svg"} alt={issue.assignee.name} />
                        <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span>{issue.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--fixed-sidebar-fg)]">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setIssueToEdit(issue.id)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[var(--fixed-danger)]"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIssueToDelete(issue.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}

            {sortedIssues.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No issues found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Issue Details Dialog */}
      <IssueDetailsDialog
        issueId={selectedIssueId}
        open={!!selectedIssueId}
        onOpenChange={(open) => !open && setSelectedIssueId(null)}
      />

      {/* Edit Issue Dialog */}
      {issueToEdit && (
        <EditIssueDialog
          issueId={issueToEdit}
          open={!!issueToEdit}
          onOpenChange={(open) => !open && setIssueToEdit(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!issueToDelete} onOpenChange={(open) => !open && setIssueToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this issue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteIssue}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
