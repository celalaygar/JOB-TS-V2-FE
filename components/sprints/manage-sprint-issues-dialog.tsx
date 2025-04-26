"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { updateIssue } from "@/lib/redux/features/issues-slice"
import { updateSprint } from "@/lib/redux/features/sprints-slice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, X } from "lucide-react"

interface ManageSprintIssuesDialogProps {
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageSprintIssuesDialog({ sprintId, open, onOpenChange }: ManageSprintIssuesDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))
  const allIssues = useSelector((state: RootState) => state.issues.issues)
  const projects = useSelector((state: RootState) => state.projects.projects)

  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"current" | "available">("current")

  // Map sprint ID to sprint value in issues
  const sprintValue = sprint?.status === "active" ? "current" : sprint?.status === "planned" ? "next" : "backlog"

  // Get issues in this sprint
  const sprintIssues = allIssues.filter((issue) => issue.sprint === sprintValue)

  // Get available issues (not in any sprint or in backlog)
  const availableIssues = allIssues.filter((issue) => !issue.sprint || issue.sprint === "backlog")

  // Filter issues based on search query
  const filteredSprintIssues = sprintIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredAvailableIssues = availableIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Update sprint stats when issues change
  useEffect(() => {
    if (sprint && sprintIssues) {
      const completedIssues = sprintIssues.filter((issue) => issue.status === "done").length

      dispatch(
        updateSprint({
          id: sprintId,
          changes: {
            totalIssues: sprintIssues.length,
            completedIssues,
          },
        }),
      )
    }
  }, [sprint, sprintIssues, dispatch, sprintId])

  const handleAddIssueToSprint = (issueId: string) => {
    dispatch(
      updateIssue({
        id: issueId,
        changes: { sprint: sprintValue },
      }),
    )
  }

  const handleRemoveIssueFromSprint = (issueId: string) => {
    dispatch(
      updateIssue({
        id: issueId,
        changes: { sprint: "backlog" },
      }),
    )
  }

  if (!sprint) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Manage Sprint Issues</DialogTitle>
          <DialogDescription>Add or remove issues from {sprint.name}.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
            <Input
              type="search"
              placeholder="Search issues..."
              className="w-full pl-8 border-[var(--fixed-card-border)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="current"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "current" | "available")}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="current">Sprint Issues ({filteredSprintIssues.length})</TabsTrigger>
              <TabsTrigger value="available">Available Issues ({filteredAvailableIssues.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              {filteredSprintIssues.length > 0 ? (
                filteredSprintIssues.map((issue) => {
                  const project = projects.find((p) => p.id === issue.project)

                  return (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-3 border rounded-md border-[var(--fixed-card-border)]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={issue.assignee.avatar} alt={issue.assignee.name} />
                          <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{issue.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
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
                            <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                              {project?.name || issue.projectName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--fixed-danger)] text-[var(--fixed-danger)]"
                        onClick={() => handleRemoveIssueFromSprint(issue.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--fixed-sidebar-muted)]">No issues in this sprint yet.</p>
                  <Button
                    variant="outline"
                    className="mt-2 border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
                    onClick={() => setActiveTab("available")}
                  >
                    Add issues from backlog
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-4">
              {filteredAvailableIssues.length > 0 ? (
                filteredAvailableIssues.map((issue) => {
                  const project = projects.find((p) => p.id === issue.project)

                  return (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-3 border rounded-md border-[var(--fixed-card-border)]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={issue.assignee.avatar} alt={issue.assignee.name} />
                          <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{issue.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
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
                            <span className="text-xs text-[var(--fixed-sidebar-muted)]">
                              {project?.name || issue.projectName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[var(--fixed-primary)] text-[var(--fixed-primary)]"
                        onClick={() => handleAddIssueToSprint(issue.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Sprint
                      </Button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--fixed-sidebar-muted)]">No available issues found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-[var(--fixed-primary)] text-white">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
