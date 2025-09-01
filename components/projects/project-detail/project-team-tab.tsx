"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Plus, LayoutGrid, MoreHorizontal, Pencil, Trash2, List, Calendar, Clock, CheckCircle2, AlertCircle, Eye, Loader2 } from "lucide-react"
import type { Project, ProjectTeam } from "@/types/project"
import { CreateTeamDialog } from "./create-team-dialog"
import { getAllProjectTeamsByProjectIdHelper } from "@/lib/service/api-helpers"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/context"

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

interface ProjectTeamTabProps {
  project: Project
  onInviteClick: () => void
  onCreateTeamClick: () => void
  createTeamDialogOpen: boolean
  setCreateTeamDialogOpen?: (open: boolean) => void
}

export function ProjectTeamTab({ project, onInviteClick, onCreateTeamClick, createTeamDialogOpen, setCreateTeamDialogOpen }: ProjectTeamTabProps) {
  const { translations } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(false);
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);
  const [selectedprojectTeam, setSelectedProjectTeam] = useState<ProjectTeam | undefined | null>();

  const filteredTeams = projectTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const fetchAllProjectTeams = useCallback(async () => {
    setProjectTeams([]);
    const teamsData = await getAllProjectTeamsByProjectIdHelper(project.id, { setLoading });
    if (teamsData) {
      setProjectTeams(teamsData);
    }
  }, [project.id]);

  useEffect(() => {
    fetchAllProjectTeams();
  }, [fetchAllProjectTeams]);

  const handleOpenDialog = (selectedTeam: ProjectTeam) => {
    if (selectedTeam) {
      setCreateTeamDialogOpen && setCreateTeamDialogOpen(true)
      setSelectedProjectTeam(selectedTeam)
    }
  }

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={translations.projects.searchTeams}
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              {translations.projects.grid}
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              {translations.projects.list}
            </Button>
          </div>

          <Button onClick={onCreateTeamClick} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {translations.projects.createTeam}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">{translations.projects.projectTeams}</h3>
      </div>

      <div className="space-y-4">
        {filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{translations.projects.noTeamsFound}</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {searchQuery
                ? translations.projects.noTeamsMatchSearch
                : translations.projects.noTeamsInProject}
            </p>
            <Button className="mt-4" onClick={onCreateTeamClick}>
              <Plus className="h-4 w-4 mr-1" />
              {translations.projects.createTeam}
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <div key={team.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{team.name}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {team.members && team.members.length}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[var(--fixed-sidebar-fg)]">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{translations.projects.menu}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(team)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {translations.projects.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[var(--fixed-danger)]">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {translations.projects.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{team.description}</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{translations.projects.completion}</span>
                    <span className="font-medium">{team.metrics && team.metrics.completionRate}%</span>
                  </div>
                  <Progress value={team.metrics && team.metrics.completionRate} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span>{team.metrics && team.metrics.tasksCompleted} {translations.projects.completed}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>{team.metrics && team.metrics.tasksInProgress} {translations.projects.inProgress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {team.focusAreas && team.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex -space-x-2">
                    {team.members && team.members.slice(0, 5).map((member, index) => (
                      <Avatar key={index} className="h-7 w-7 border-2 border-background">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members && team.members.length > 5 && (
                      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-medium border-2 border-background">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground flex items-center mb-3">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{translations.projects.weeklyMeeting}: {team.meetingSchedule && team.meetingSchedule}</span>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  <Link href={`/teams/${project.id}/${team.id}`}>{translations.projects.viewDetails}</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">{translations.projects.teamName}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.members}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.focusAreas}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.completion}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.meetingSchedule}</th>
                    <th className="text-left p-3 font-medium">{translations.projects.actions}</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{team.description}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-2">
                            {team.members && team.members.slice(0, 3).map((member, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                            ))}
                            {team.members && team.members.length > 3 && (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium border-2 border-background">
                                +{team.members && team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm">{team.members && team.members.length} {translations.projects.members}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {team.focusAreas && team.focusAreas.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={team.metrics && team.metrics.completionRate} className="h-2 w-24" />
                          <span className="text-sm">{team.metrics && team.metrics.completionRate}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {team.meetingSchedule && team.meetingSchedule}
                        </div>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          <Link href={`/teams/${project.id}/${team.id}`}>{translations.projects.viewDetails}</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {project && project.id && (
        <CreateTeamDialog
          setSelectedProjectTeam={setSelectedProjectTeam}
          team={selectedprojectTeam}
          projectId={project?.id}
          open={createTeamDialogOpen}
          onOpenChange={setCreateTeamDialogOpen || (() => { })}
          projectTeams={projectTeams}
          setProjectTeams={setProjectTeams}
          onCreateTeam={(team) => {
            console.log("Team created:", team)
          }}
        />
      )}
    </div>
  )
}
