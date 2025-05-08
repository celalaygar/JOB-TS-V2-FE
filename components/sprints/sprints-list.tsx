"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
import { CalendarDays, ChevronRight, Edit, PlusCircle, Trash2 } from "lucide-react"
import { EditSprintDialog } from "@/components/sprints/edit-sprint-dialog"
import { ManageSprintIssuesDialog } from "@/components/sprints/manage-sprint-issues-dialog"
import { useDispatch } from "react-redux"
import { removeSprint } from "@/lib/redux/features/sprints-slice"
import { cn } from "@/lib/utils"

export function SprintsList() {
  const dispatch = useDispatch()
  const sprints = useSelector((state: RootState) => state.sprints.sprints)
  const issues = useSelector((state: RootState) => state.issues.issues)

  const [activeTab, setActiveTab] = useState<"active" | "planned" | "completed">("active")
  const [sprintToEdit, setSprintToEdit] = useState<string | null>(null)
  const [sprintToDelete, setSprintToDelete] = useState<string | null>(null)
  const [sprintToManageIssues, setSprintToManageIssues] = useState<string | null>(null)

  // Count issues by sprint
  const issueCountBySprint = issues.reduce(
    (acc, issue) => {
      if (issue.sprint) {
        acc[issue.sprint] = (acc[issue.sprint] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Group sprints by status
  const activeSprints = sprints.filter((sprint) => sprint.status === "active")
  const plannedSprints = sprints.filter((sprint) => sprint.status === "planned")
  const completedSprints = sprints.filter((sprint) => sprint.status === "completed")

  const handleDeleteSprint = () => {
    if (sprintToDelete) {
      dispatch(removeSprint(sprintToDelete))
      setSprintToDelete(null)
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Custom Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "active" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Active Sprint
          </button>
          <button
            onClick={() => setActiveTab("planned")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "planned" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Planned
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "completed" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Completed
          </button>
        </div>

        {/* Active Sprint Content */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {activeSprints.length > 0 ? (
              activeSprints.map((sprint) => (
                <Card key={sprint.id} className="fixed-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{sprint.name}</CardTitle>
                        <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                          {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                          {new Date(sprint.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">Active</Badge>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                          onClick={() => setSprintToEdit(sprint.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit Sprint</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                        <span>
                          {Math.ceil(
                            (new Date(sprint.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                          )}{" "}
                          days remaining
                        </span>
                      </div>
                      <div>
                        {sprint.completedIssues} of {sprint.totalIssues} issues completed
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div>Progress</div>
                        <div className="font-medium">
                          {Math.round((sprint.completedIssues / (sprint.totalIssues || 1)) * 100)}%
                        </div>
                      </div>
                      <Progress
                        value={(sprint.completedIssues / (sprint.totalIssues || 1)) * 100}
                        className="h-2 bg-[var(--fixed-secondary)]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[var(--fixed-sidebar-muted)]">
                        {issueCountBySprint["current"] || 0} active issues
                      </div>
                      <div className="flex -space-x-2">
                        {sprint.team.map((member, i) => (
                          <Avatar key={i} className="h-7 w-7 border-2 border-[var(--fixed-card-bg)]">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                      onClick={() => setSprintToManageIssues(sprint.id)}
                    >
                      Manage Tasks
                    </Button>
                    <Button className="flex-1 bg-[var(--fixed-primary)] text-white">
                      View Sprint Board
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No active sprints</h3>
                <p className="text-[var(--fixed-sidebar-muted)] mt-1">
                  Start a new sprint to begin tracking your work.
                </p>
                <Button className="mt-4 bg-[var(--fixed-primary)] text-white" onClick={() => setSprintToEdit("new")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Start New Sprint
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Planned Content */}
        {activeTab === "planned" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plannedSprints.map((sprint) => (
              <Card key={sprint.id} className="fixed-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{sprint.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--fixed-sidebar-fg)]"
                      onClick={() => setSprintToEdit(sprint.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Sprint</span>
                    </Button>
                  </div>
                  <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-[var(--fixed-sidebar-muted)]">{sprint.totalIssues} issues planned</div>
                    <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                      Planned
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                    onClick={() => setSprintToManageIssues(sprint.id)}
                  >
                    Manage Issues
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[var(--fixed-danger)] text-[var(--fixed-danger)]"
                    onClick={() => setSprintToDelete(sprint.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}

            <Card className="border-dashed fixed-card">
              <CardHeader>
                <CardTitle>Create New Sprint</CardTitle>
                <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                  Plan your next development cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full h-16 w-16 border-[var(--fixed-card-border)]"
                  onClick={() => setSprintToEdit("new")}
                >
                  <PlusCircle className="h-6 w-6 text-[var(--fixed-primary)]" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completed Content */}
        {activeTab === "completed" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedSprints.map((sprint) => (
              <Card key={sprint.id} className="fixed-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{sprint.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[var(--fixed-sidebar-fg)]"
                      onClick={() => setSprintToDelete(sprint.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Sprint</span>
                    </Button>
                  </div>
                  <CardDescription className="text-[var(--fixed-sidebar-muted)]">
                    {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      {sprint.completedIssues} of {sprint.totalIssues} issues completed
                    </div>
                    <Badge variant="outline" className="border-[var(--fixed-card-border)]">
                      Completed
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>Completion</div>
                      <div className="font-medium">
                        {Math.round((sprint.completedIssues / (sprint.totalIssues || 1)) * 100)}%
                      </div>
                    </div>
                    <Progress
                      value={(sprint.completedIssues / (sprint.totalIssues || 1)) * 100}
                      className="h-2 bg-[var(--fixed-secondary)]"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                  >
                    View Sprint Report
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Sprint Dialog */}
      {sprintToEdit && (
        <EditSprintDialog
          sprintId={sprintToEdit}
          open={!!sprintToEdit}
          onOpenChange={(open) => !open && setSprintToEdit(null)}
        />
      )}

      {/* Manage Sprint Issues Dialog */}
      {sprintToManageIssues && (
        <ManageSprintIssuesDialog
          sprintId={sprintToManageIssues}
          open={!!sprintToManageIssues}
          onOpenChange={(open) => !open && setSprintToManageIssues(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sprintToDelete} onOpenChange={(open) => !open && setSprintToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this sprint and remove all issue associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-[var(--fixed-danger)] text-white" onClick={handleDeleteSprint}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
