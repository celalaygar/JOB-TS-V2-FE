"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Plus, LayoutGrid, MoreHorizontal, Pencil, Trash2, List, Calendar, Clock, CheckCircle2, AlertCircle, Eye, Loader2 } from "lucide-react"
import type { Project, ProjectTeam } from "@/types/project"
import { teams } from "@/data/teams"
import { users } from "@/data/users"
import { CreateTeamDialog } from "./create-team-dialog"
import { PROJECT_TEAM_URL } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"
import BaseService from "@/lib/service/BaseService"
import { toast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Helper function to get teams for a specific project
const getTeamsByProjectId = (projectId: string) => {
  return teams.filter((team) => team.projectId === projectId)
}

// Helper function to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

// Helper function to get random team focus areas
const getRandomFocusAreas = () => {
  const areas = ["Frontend", "Backend", "Design", "QA", "DevOps", "Mobile", "Analytics", "Security", "Documentation"]
  const count = Math.floor(Math.random() * 3) + 1 // 1-3 areas
  const result = []

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * areas.length)
    result.push(areas[randomIndex])
    areas.splice(randomIndex, 1) // Remove to avoid duplicates
  }

  return result
}

// Helper function to get random meeting schedule
const getRandomMeetingSchedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const dayIndex = Math.floor(Math.random() * days.length)
  const timeIndex = Math.floor(Math.random() * times.length)

  return `${days[dayIndex]} at ${times[timeIndex]}`
}

// Helper function to get random team metrics
const getRandomTeamMetrics = () => {
  return {
    completionRate: Math.floor(Math.random() * 101), // 0-100%
    tasksCompleted: Math.floor(Math.random() * 50) + 5, // 5-54
    tasksInProgress: Math.floor(Math.random() * 20) + 1, // 1-20
    meetingEfficiency: Math.floor(Math.random() * 41) + 60, // 60-100%
    velocity: Math.floor(Math.random() * 21) + 10, // 10-30 points
  }
}

interface ProjectTeamTabProps {
  project: Project
  onInviteClick: () => void
  onCreateTeamClick: () => void
  createTeamDialogOpen: boolean
  setCreateTeamDialogOpen?: (open: boolean) => void
}

export function ProjectTeamTab({ project, onInviteClick, onCreateTeamClick, createTeamDialogOpen, setCreateTeamDialogOpen }: ProjectTeamTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(false);
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);
  const [selectedprojectTeam, setSelectedProjectTeam] = useState<ProjectTeam | undefined | null>();





  // Filter teams based on search query
  const filteredTeams = projectTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getAllProjectTeams = useCallback(async () => {
    setLoading(true)
    try {
      const response: ProjectTeam[] = await BaseService.request(PROJECT_TEAM_URL + "/project/" + project.id, {
        method: httpMethods.GET,
      })
      toast({
        title: `Project Team get all.`,
        description: `Project Team get all `,
      })
      setProjectTeams(response)

    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project Team failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Project Team failed:', error)
        toast({
          title: `Project Team failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getAllProjectTeams()
  }, [getAllProjectTeams])
  const handleOpenDialog = (selectedTeam: ProjectTeam) => {
    if (selectedTeam) {
      setCreateTeamDialogOpen && setCreateTeamDialogOpen(true)
      setSelectedProjectTeam(selectedTeam)
    }
  }

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teams..."
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
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>

            <Button onClick={onCreateTeamClick} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create Team
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Project Teams</h3>
        </div>

        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No teams found</h3>
              <p className="text-muted-foreground text-center max-w-md mt-1">
                {searchQuery
                  ? "No teams match your search criteria. Try a different search term."
                  : "This project doesn't have any teams yet. Create a team to get started."}
              </p>
              <Button className="mt-4" onClick={onCreateTeamClick}>
                <Plus className="h-4 w-4 mr-1" />
                Create Team
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
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(team)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[var(--fixed-danger)]"
                          // onClick={() => setProjectToDelete(project.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                  </div>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{team.description}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion</span>
                      <span className="font-medium">{team.metrics && team.metrics.completionRate}%</span>
                    </div>
                    <Progress value={team.metrics && team.metrics.completionRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span>{team.metrics && team.metrics.tasksCompleted} completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      <span>{team.metrics && team.metrics.tasksInProgress} in progress</span>
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
                    <span>Weekly meeting: {team.meetingSchedule && team.meetingSchedule}</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    <Link href={`/teams/${project.id}/${team.id}`}>View Details</Link>
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
                      <th className="text-left p-3 font-medium">Team Name</th>
                      <th className="text-left p-3 font-medium">Members</th>
                      <th className="text-left p-3 font-medium">Focus Areas</th>
                      <th className="text-left p-3 font-medium">Completion</th>
                      <th className="text-left p-3 font-medium">Meeting Schedule</th>
                      <th className="text-left p-3 font-medium">Actions</th>
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
                            <span className="text-sm">{team.members && team.members.length} members</span>
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
                            <Link href={`/teams/${project.id}/${team.id}`}>View Details</Link>
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
              // Here you would typically dispatch an action to add the team
            }}
          />
        )}
      </div>
    </>
  )
}
