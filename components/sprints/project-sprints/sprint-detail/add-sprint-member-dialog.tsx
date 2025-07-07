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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, User, UserCheck, Plus, Loader2 } from "lucide-react"
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

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectAllUsers, setSelectAllUsers] = useState(false)
  const [activeTab, setActiveTab] = useState("users")
  const [isAdding, setIsAdding] = useState(false)

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    // Reset selections when switching tabs
    setSelectAllUsers(false)
    if (tab !== "users") {
      setSelectedUsers([])
    }
    if (tab !== "teams") {
      setSelectedTeams([])
    }
  }

  const addMembersToSprint = async () => {
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
      setIsAdding(true)
      try {

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return true
      } catch (error) {
        console.error("Error adding members:", error)
        return false
      } finally {
        setIsAdding(false)
      }
    }
    return false
  }

  const handleAddMembers = async () => {
    const success = await addMembersToSprint()
    if (success) {
      // Reset form and close dialog
      setSelectedUsers([])
      setSelectedTeams([])
      setSelectAllUsers(false)
      setSearchTerm("")
      onOpenChange(false)
    }
  }

  const handleAddAndContinue = async () => {
    const success = await addMembersToSprint()
    if (success) {
      // Reset form but keep dialog open
      setSelectedUsers([])
      setSelectedTeams([])
      setSelectAllUsers(false)
      setSearchTerm("")
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

  const tabs = [
    {
      id: "users",
      label: "Individual Users",
      icon: User,
      shortLabel: "Users",
    },
    {
      id: "teams",
      label: "Project Teams",
      icon: Users,
      shortLabel: "Teams",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Members to Sprint</DialogTitle>
          <DialogDescription>Select individual users or project teams to add to this sprint.</DialogDescription>
        </DialogHeader>

        {
          loading ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
            :
            <>
              <div className="flex-1 overflow-hidden min-h-0">
                {/* Custom Tab Navigation */}
                <div className="w-full mb-4">
                  <div className="flex flex-col sm:flex-row bg-muted p-1 rounded-lg gap-1 sm:gap-0">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id

                      return (
                        <div
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`
                flex items-center justify-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200
                flex-1 text-center min-h-[40px]
                ${isActive
                              ? "bg-background text-foreground shadow-sm font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            } 
              `}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="hidden sm:inline text-sm">{tab.label}</span>
                          <span className="sm:hidden text-xs font-medium">{tab.shortLabel}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Tabs value={activeTab} className="h-full flex flex-col">
                  <div className="flex-1 overflow-hidden min-h-0">
                    {/* Search Input */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder={activeTab === "users" ? "Search users..." : "Search teams..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <TabsContent value="users" className="mt-0 h-full overflow-y-auto">
                      <div className="space-y-4">
                        {/* Select All Users Option */}
                        <Card className="border-dashed">
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox checked={selectAllUsers} onCheckedChange={handleSelectAllUsers} />
                              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm sm:text-base">Select All Project Users</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  Add all {availableUsers.length} available users to this sprint
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs flex-shrink-0">
                                {availableUsers.length} users
                              </Badge>
                            </div>
                            {selectAllUsers && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                  <strong>Note:</strong> This will add all {availableUsers.length} project users to the sprint
                                  team. You can remove individual members later if needed.
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Individual Users List */}
                        {!selectAllUsers && (
                          <div className="space-y-2">
                            {filteredUsers.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
                                {searchTerm ? "No users found matching your search." : "No available users to add."}
                              </div>
                            ) : (
                              <>
                                <div className="text-sm font-medium text-muted-foreground px-1">
                                  Select Individual Users ({filteredUsers.length} available)
                                </div>
                                {filteredUsers.map((user) => (
                                  <Card key={user.id} className="cursor-pointer hover:bg-muted/50">
                                    <CardContent className="p-3 sm:p-4">
                                      <div className="flex items-center space-x-3">
                                        <Checkbox
                                          checked={selectedUsers.includes(user.id)}
                                          onCheckedChange={() => handleUserToggle(user.id)}
                                        />
                                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                          <AvatarFallback className="text-xs sm:text-sm">
                                            {user.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm sm:text-base truncate">{user.name}</div>
                                          <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                            {user.email}
                                          </div>
                                        </div>
                                        <Badge variant="outline" className="text-xs flex-shrink-0">
                                          {user.role}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </>
                            )}
                          </div>
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
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    checked={selectedTeams.includes(team.id)}
                                    onCheckedChange={() => handleTeamToggle(team.id)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm sm:text-base">{team.name}</div>
                                    {team.description && (
                                      <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                        {team.description}
                                      </div>
                                    )}
                                    <div className="text-xs text-muted-foreground mt-1">{team.members.length} members</div>
                                  </div>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {team.members.length} users
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex-1 flex items-center">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {getTotalSelectedCount() > 0 && (
                        <span>
                          {getTotalSelectedCount()} user{getTotalSelectedCount() !== 1 ? "s" : ""} selected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      className="min-w-[80px]"
                      disabled={isAdding}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAddAndContinue}
                      disabled={getTotalSelectedCount() === 0 || isAdding}
                      className="min-w-[80px]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isAdding ? "Adding..." : "Add"}
                    </Button>
                    <Button
                      onClick={handleAddMembers}
                      disabled={getTotalSelectedCount() === 0 || isAdding}
                      className="min-w-[100px]"
                    >
                      {isAdding ? "Adding..." : "Add & Close"}
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </>
        }
      </DialogContent>
    </Dialog>
  )
}
