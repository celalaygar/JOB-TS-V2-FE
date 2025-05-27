"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Building, Calendar, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewUserDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewUserDialog({ userId, open, onOpenChange }: ViewUserDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "projects">("overview")
  const user = useSelector((state: RootState) => state.users.users.find((u) => u.id === userId))

  const issues = useSelector((state: RootState) => state.issues.issues.filter((issue) => issue.assignee.id === userId))

  const projects = useSelector((state: RootState) => state.projects.projects)

  if (!user) return null

  // Role-specific styling
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-[var(--fixed-primary)] text-white"
      case "Developer":
        return "bg-green-500 text-white"
      case "Tester":
        return "bg-purple-500 text-white"
      case "Product Owner":
        return "bg-amber-500 text-white"
      default:
        return "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
    }
  }

  // Get user's projects based on issues
  const userProjects = issues.reduce(
    (acc, issue) => {
      const project = projects.find((p) => p.id === issue.project)
      if (project && !acc.some((p) => p.id === project.id)) {
        acc.push(project)
      }
      return acc
    },
    [] as typeof projects,
  )

  // Get user's active issues
  const activeIssues = issues.filter((issue) => issue.status !== "done")
  const completedIssues = issues.filter((issue) => issue.status === "done")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.initials}</AvatarFallback>
            </Avatar>

            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <Badge className={`mt-1 ${getRoleBadgeStyle(user.role)}`}>{user.role}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
                  <span>Joined {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            {/* Custom Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b mb-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all",
                  "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === "overview"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("issues")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all",
                  "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === "issues"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                Issues ({issues.length})
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all",
                  "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeTab === "projects"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                Projects ({userProjects.length})
              </button>
            </div>

            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[var(--fixed-secondary)] p-4 rounded-md">
                    <div className="text-sm text-[var(--fixed-sidebar-muted)] mb-1">Active Issues</div>
                    <div className="text-2xl font-bold">{activeIssues.length}</div>
                  </div>
                  <div className="bg-[var(--fixed-secondary)] p-4 rounded-md">
                    <div className="text-sm text-[var(--fixed-sidebar-muted)] mb-1">Completed Issues</div>
                    <div className="text-2xl font-bold">{completedIssues.length}</div>
                  </div>
                  <div className="bg-[var(--fixed-secondary)] p-4 rounded-md">
                    <div className="text-sm text-[var(--fixed-sidebar-muted)] mb-1">Projects</div>
                    <div className="text-2xl font-bold">{userProjects.length}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
                  {activeIssues.slice(0, 3).map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-start gap-3 py-3 border-b border-[var(--fixed-card-border)]"
                    >
                      <FileText className="h-5 w-5 text-[var(--fixed-sidebar-muted)] mt-0.5" />
                      <div>
                        <div className="font-medium">{issue.title}</div>
                        <div className="text-sm text-[var(--fixed-sidebar-muted)]">
                          {issue.projectName} ·{" "}
                          {issue.status === "to-do"
                            ? "To Do"
                            : issue.status === "in-progress"
                              ? "In Progress"
                              : issue.status === "review"
                                ? "In Review"
                                : "Done"}
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeIssues.length === 0 && (
                    <div className="text-center py-4 text-[var(--fixed-sidebar-muted)]">No active issues found.</div>
                  )}
                </div>
              </div>
            )}

            {/* Issues Tab Content */}
            {activeTab === "issues" && (
              <div className="space-y-4">
                {issues.length > 0 ? (
                  issues.map((issue) => (
                    <div key={issue.id} className="p-3 border rounded-md border-[var(--fixed-card-border)]">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{issue.title}</h4>
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
                      </div>
                      <div className="flex items-center gap-2 mt-2">
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
                        <span className="text-sm text-[var(--fixed-sidebar-muted)]">
                          {issue.projectName} · Created {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[var(--fixed-sidebar-muted)]">
                    No issues assigned to this user.
                  </div>
                )}
              </div>
            )}

            {/* Projects Tab Content */}
            {activeTab === "projects" && (
              <div className="space-y-4">
                {userProjects.length > 0 ? (
                  userProjects.map((project) => (
                    <div key={project.id} className="p-3 border rounded-md border-[var(--fixed-card-border)]">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge
                          className={
                            project.status === "Completed"
                              ? "bg-[var(--fixed-success)] text-white"
                              : project.status === "In Progress"
                                ? "bg-[var(--fixed-primary)] text-white"
                                : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--fixed-sidebar-muted)] mt-1">{project.description}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                          <div>Progress</div>
                          <div className="font-medium">{project.progress}%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[var(--fixed-secondary)] mt-1">
                          <div
                            className="h-full rounded-full bg-[var(--fixed-primary)]"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[var(--fixed-sidebar-muted)]">
                    No projects associated with this user.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-[var(--fixed-primary)] text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
