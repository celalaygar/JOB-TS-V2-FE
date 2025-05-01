"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { teams } from "@/data/teams"
import { users } from "@/data/users"
import type { Project } from "@/types/project"

interface ProjectTeamsTabProps {
  project: Project
  onCreateTeamClick?: () => void
}

// Mock function to get teams by project ID
const getTeamsByProjectId = (projectId: string) => {
  return teams.filter((team) => team.projectId === projectId)
}

// Mock function to get team members
const getTeamMembers = (teamId: string) => {
  // For demo purposes, randomly select 3-8 users
  const count = Math.floor(Math.random() * 6) + 3
  return users.slice(0, count).map((user) => ({
    ...user,
    role: ["Developer", "Designer", "QA", "Product Manager", "Scrum Master"][Math.floor(Math.random() * 5)],
  }))
}

// Generate random team stats
const generateTeamStats = (teamId: string) => {
  return {
    tasksCompleted: Math.floor(Math.random() * 30) + 5,
    tasksInProgress: Math.floor(Math.random() * 15) + 2,
    completionPercentage: Math.floor(Math.random() * 100),
    meetingDay: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 5)],
    meetingTime: `${Math.floor(Math.random() * 12) + 8}:00 ${Math.random() > 0.5 ? "AM" : "PM"}`,
    meetingDuration: `${Math.floor(Math.random() * 60) + 30} min`,
    focusAreas: ["Frontend", "Backend", "Design", "Testing", "DevOps", "Mobile", "API", "Database", "Security"]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1),
  }
}

export function ProjectTeamsTab({ project, onCreateTeamClick }: ProjectTeamsTabProps) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  // Get teams for this project and enhance with additional data
  const projectTeams = getTeamsByProjectId(project.id).map((team) => {
    const members = getTeamMembers(team.id)
    const stats = generateTeamStats(team.id)

    return {
      ...team,
      members,
      stats,
    }
  })

  // Filter teams based on search query
  const filteredTeams = projectTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Project Teams</h2>
          <p className="text-muted-foreground">
            {projectTeams.length} teams working on {project.name}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center border rounded-md">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
              className="rounded-r-none"
            >
              Grid
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-l-none"
            >
              List
            </Button>
          </div>

          <Button onClick={onCreateTeamClick}>Create Team</Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="stats">Team Stats</TabsTrigger>
          <TabsTrigger value="meetings">Meeting Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4 pt-4">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
              <h3 className="text-lg font-medium">No teams found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new team</p>
              <Button onClick={onCreateTeamClick} className="mt-4">
                Create Team
              </Button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map((team) => (
                <div key={team.id} className="border rounded-lg p-4 space-y-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{team.name}</h3>
                      <p className="text-muted-foreground text-sm">{team.description}</p>
                    </div>
                    <Badge variant="outline">{team.members.length} members</Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>{team.stats.completionPercentage}%</span>
                    </div>
                    <Progress value={team.stats.completionPercentage} className="h-2" />
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-green-500 font-medium">{team.stats.tasksCompleted}</span> completed
                    </div>
                    <div>
                      <span className="text-blue-500 font-medium">{team.stats.tasksInProgress}</span> in progress
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {team.stats.focusAreas.map((area, i) => (
                      <Badge key={i} variant="secondary">
                        {area}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {team.members.slice(0, 5).map((member, i) => (
                        <Avatar key={i} className="border-2 border-background w-8 h-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${member.name.charAt(0)}`} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {team.members.length > 5 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Team meeting: {team.stats.meetingDay}s at {team.stats.meetingTime} ({team.stats.meetingDuration})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium">Team Name</th>
                    <th className="text-left p-3 font-medium">Members</th>
                    <th className="text-left p-3 font-medium">Completion</th>
                    <th className="text-left p-3 font-medium">Tasks</th>
                    <th className="text-left p-3 font-medium">Focus Areas</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.description}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.members.slice(0, 3).map((member, i) => (
                            <Avatar key={i} className="border-2 border-background w-6 h-6">
                              <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${member.name.charAt(0)}`} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {team.members.length > 3 && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs">
                              +{team.members.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Progress value={team.stats.completionPercentage} className="h-2 w-24" />
                          <span className="text-sm">{team.stats.completionPercentage}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-green-500 font-medium">{team.stats.tasksCompleted}</span> /
                        <span className="text-blue-500 font-medium"> {team.stats.tasksInProgress}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {team.stats.focusAreas.map((area, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Total Members</h3>
              <div className="text-3xl font-bold">
                {projectTeams.reduce((acc, team) => acc + team.members.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Across {projectTeams.length} teams</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Average Team Size</h3>
              <div className="text-3xl font-bold">
                {projectTeams.length > 0
                  ? Math.round(projectTeams.reduce((acc, team) => acc + team.members.length, 0) / projectTeams.length)
                  : 0}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Members per team</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Average Completion</h3>
              <div className="text-3xl font-bold">
                {projectTeams.length > 0
                  ? Math.round(
                    projectTeams.reduce((acc, team) => acc + team.stats.completionPercentage, 0) /
                    projectTeams.length,
                  )
                  : 0}
                %
              </div>
              <p className="text-sm text-muted-foreground mt-2">Across all teams</p>
            </div>

            <div className="border rounded-lg p-4 md:col-span-3">
              <h3 className="font-medium mb-4">Resource Allocation</h3>
              <div className="h-64 flex items-center justify-center border rounded bg-muted/20">
                <p className="text-muted-foreground">Resource allocation chart will be displayed here</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="pt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">Team</th>
                  <th className="text-left p-3 font-medium">Day</th>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Duration</th>
                  <th className="text-left p-3 font-medium">Attendees</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="border-t">
                    <td className="p-3 font-medium">{team.name}</td>
                    <td className="p-3">{team.stats.meetingDay}</td>
                    <td className="p-3">{team.stats.meetingTime}</td>
                    <td className="p-3">{team.stats.meetingDuration}</td>
                    <td className="p-3">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 3).map((member, i) => (
                          <Avatar key={i} className="border-2 border-background w-6 h-6">
                            <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${member.name.charAt(0)}`} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 3 && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs">
                            +{team.members.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
