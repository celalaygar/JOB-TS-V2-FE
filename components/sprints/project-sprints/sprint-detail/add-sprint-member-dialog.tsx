"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, User, UserCheck } from "lucide-react"
import { users as dummyUsers } from "@/data/users"
import { teams as dummyTeams } from "@/data/teams"

interface AddSprintMemberDialogProps {
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSprintMemberDialog({ sprintId, open, onOpenChange }: AddSprintMemberDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectAllUsers, setSelectAllUsers] = useState(false)
  const [activeTab, setActiveTab] = useState("users")

  // Get current sprint team member IDs
  const currentMemberIds = sprint?.team?.map((member) => member.id) || []

  // Filter available users (not already in sprint)
  const availableUsers = dummyUsers.filter((user) => !currentMemberIds.includes(user.id))

  // Filter users based on search term
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter teams based on search term
  const filteredTeams = dummyTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams((prev) => (prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]))
  }

  const handleSelectAllUsers = (checked: boolean) => {
    setSelectAllUsers(checked)
    if (checked) {
      setSelectedUsers([])
      setSelectedTeams([])
    }
  }

  const handleAddMembers = () => {
    let usersToAdd: string[] = []

    if (selectAllUsers) {
      // Add all available project users
      usersToAdd = availableUsers.map((user) => user.id)
    } else {
      // Add selected individual users
      usersToAdd = [...selectedUsers]

      // Add users from selected teams
      selectedTeams.forEach((teamId) => {
        const team = dummyTeams.find((t) => t.id === teamId)
        if (team) {
          const teamUserIds = team.members
            .filter((member) => !currentMemberIds.includes(member.id))
            .map((member) => member.id)
          usersToAdd = [...usersToAdd, ...teamUserIds]
        }
      })
    }

    // Remove duplicates
    usersToAdd = [...new Set(usersToAdd)]

    if (usersToAdd.length > 0) {
      // TODO: Dispatch action to add users to sprint
      console.log("Adding users to sprint:", usersToAdd)

      // Reset form
      setSelectedUsers([])
      setSelectedTeams([])
      setSelectAllUsers(false)
      setSearchTerm("")
      onOpenChange(false)
    }
  }

  const getTotalSelectedCount = () => {
    if (selectAllUsers) {
      return availableUsers.length
    }

    let count = selectedUsers.length
    selectedTeams.forEach((teamId) => {
      const team = dummyTeams.find((t) => t.id === teamId)
      if (team) {
        count += team.members.filter((member) => !currentMemberIds.includes(member.id)).length
      }
    })
    return count
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Members to Sprint</DialogTitle>
          <DialogDescription>
            Select individual users, project teams, or all project users to add to this sprint.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Individual Users
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Project Teams
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                All Project Users
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-4 h-[400px] overflow-hidden">
              {/* Search Input */}
              {activeTab !== "all" && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={activeTab === "users" ? "Search users..." : "Search teams..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}

              <TabsContent value="users" className="mt-0 h-full overflow-y-auto">
                <div className="space-y-2">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No users found matching your search." : "No available users to add."}
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <Card key={user.id} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => handleUserToggle(user.id)}
                            />
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="teams" className="mt-0 h-full overflow-y-auto">
                <div className="space-y-2">
                  {filteredTeams.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No teams found matching your search." : "No teams available."}
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <Card key={team.id} className="cursor-pointer hover:bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedTeams.includes(team.id)}
                              onCheckedChange={() => handleTeamToggle(team.id)}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{team.name}</div>
                              {team.description && (
                                <div className="text-sm text-muted-foreground">{team.description}</div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">{team.members.length} members</div>
                            </div>
                            <Badge variant="outline">{team.members.length} users</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-0 h-full overflow-y-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      Add All Project Users
                    </CardTitle>
                    <CardDescription>This will add all available project users to the sprint team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                      <Checkbox checked={selectAllUsers} onCheckedChange={handleSelectAllUsers} />
                      <div className="flex-1">
                        <div className="font-medium">Select All Project Users</div>
                        <div className="text-sm text-muted-foreground">
                          Add all {availableUsers.length} available users to this sprint
                        </div>
                      </div>
                      <Badge variant="outline">{availableUsers.length} users</Badge>
                    </div>

                    {selectAllUsers && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> This will add all {availableUsers.length} project users to the sprint
                          team. You can remove individual members later if needed.
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {getTotalSelectedCount() > 0 && (
                <span>
                  {getTotalSelectedCount()} user{getTotalSelectedCount() !== 1 ? "s" : ""} selected
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMembers} disabled={getTotalSelectedCount() === 0}>
                Add {getTotalSelectedCount() > 0 ? `${getTotalSelectedCount()} ` : ""}Member
                {getTotalSelectedCount() !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
