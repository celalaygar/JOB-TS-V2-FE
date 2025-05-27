"use client"

import { useState } from "react"
import { CalendarDays, Code, Flag, GitBranch, GitPullRequest, Layers, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Project } from "@/data/projects"
import { teams } from "@/data/teams"
import { users } from "@/data/users"

interface ProjectDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function ProjectDetailsDialog({ isOpen, onOpenChange, project }: ProjectDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "progress">("overview")

  // Calculate days remaining
  const today = new Date()
  const endDate = project.endDate ? new Date(project.endDate) : null
  const daysRemaining = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null

  // Get project team members
  const projectTeams = teams.filter((team) => team.projectId === project.id)
  const teamMembersCount = projectTeams.reduce((acc, team) => acc + team.members.length, 0)

  // Get all team members across all teams in this project
  const allTeamMembers = projectTeams.flatMap((team) => team.members)

  // Get project lead
  const projectLead = project.leadId ? users.find((user) => user.id === project.leadId) : null

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Project Information</DialogTitle>
          <DialogDescription>Detailed information about {project.name}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Custom Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "team" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === "progress" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
              )}
            >
              Progress
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {/* Overview Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Project Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant={project.status === "Active" ? "default" : "outline"}>{project.status}</Badge>
                      <Badge variant="outline" className="bg-amber-100">
                        {project.priority || "Medium"} Priority
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>

                  {project.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Timeline
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p>{formatDate(project.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p>{formatDate(project.endDate)}</p>
                      </div>
                      {daysRemaining !== null && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Days Remaining</p>
                          <p className={daysRemaining < 7 ? "text-red-500 font-medium" : ""}>{daysRemaining} days</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Lead */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Project Lead
                    </h4>
                    {projectLead ? (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {projectLead.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{projectLead.name}</p>
                          <p className="text-xs text-muted-foreground">{projectLead.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No project lead assigned</p>
                    )}
                  </div>

                  {/* Team Size */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Team Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Teams</p>
                        <p>{projectTeams.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Team Members</p>
                        <p>{teamMembersCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Issue Statistics */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <GitPullRequest className="h-4 w-4" />
                      Issue Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Issues</p>
                        <p>{project.issueCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Open Issues</p>
                        <p>{project.openIssues || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sprints</p>
                        <p>{project.sprintCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Milestones</p>
                        <p>{project.milestoneCount || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Repository */}
                  {project.repository && (
                    <div className="col-span-1 md:col-span-2 space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Repository
                      </h4>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={project.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {project.repository}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Tab Content */}
            {activeTab === "team" && (
              <div className="space-y-4">
                <h3 className="text-md font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Project Teams
                </h3>

                {projectTeams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No teams assigned to this project</p>
                ) : (
                  <div className="space-y-6">
                    {projectTeams.map((team) => (
                      <div key={team.id} className="space-y-3">
                        <h4 className="text-sm font-medium">{team.name}</h4>
                        <p className="text-xs text-muted-foreground">{team.description}</p>

                        <div className="rounded-md border">
                          <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                  <th className="h-10 px-4 text-left align-middle font-medium">Member</th>
                                  <th className="h-10 px-4 text-left align-middle font-medium">Role</th>
                                  <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                                </tr>
                              </thead>
                              <tbody className="[&_tr:last-child]:border-0">
                                {team.members.map((member) => (
                                  <tr key={member.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-2 align-middle">
                                      <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                          {member.initials}
                                        </div>
                                        <div>
                                          <div className="font-medium text-xs">{member.name}</div>
                                          <div className="text-xs text-muted-foreground">{member.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-2 align-middle text-xs">{member.role}</td>
                                    <td className="p-2 align-middle">
                                      <Badge
                                        variant={
                                          member.status === "Active"
                                            ? "default"
                                            : member.status === "Banned"
                                              ? "destructive"
                                              : "outline"
                                        }
                                        className="text-xs"
                                      >
                                        {member.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab Content */}
            {activeTab === "progress" && (
              <div className="space-y-6">
                {/* Overall Progress */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Overall Progress
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                  </div>

                  {/* Issue Progress */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Open Issues</span>
                        <span>
                          {project.openIssues || 0} / {project.issueCount || 0}
                        </span>
                      </div>
                      <Progress
                        value={project.issueCount ? ((project.openIssues || 0) / project.issueCount) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Closed Issues</span>
                        <span>
                          {project.issueCount ? project.issueCount - (project.openIssues || 0) : 0} /{" "}
                          {project.issueCount || 0}
                        </span>
                      </div>
                      <Progress
                        value={
                          project.issueCount
                            ? ((project.issueCount - (project.openIssues || 0)) / project.issueCount) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Sprints */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Recent Sprints
                  </h4>

                  {project.recentSprints && project.recentSprints.length > 0 ? (
                    <div className="space-y-3">
                      {project.recentSprints.map((sprint) => (
                        <div key={sprint.id} className="border rounded-md p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">{sprint.name}</h5>
                            <Badge
                              variant={
                                sprint.status === "Completed"
                                  ? "default"
                                  : sprint.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {sprint.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{sprint.progress}%</span>
                            </div>
                            <Progress value={sprint.progress} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent sprints found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
