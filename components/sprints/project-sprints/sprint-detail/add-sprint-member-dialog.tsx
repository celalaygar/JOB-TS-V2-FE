"use client"

import { useCallback, useEffect, useState } from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, User, UserCheck, Plus, Loader2 } from "lucide-react"
import { CreatedProject, Project, ProjectUser } from "@/types/project"
import { addBulkUserToSprintHelper, getActiveProjectUsersHelper } from "@/lib/service/api-helpers"
import { AddUserToSprintRequest, SprintUser } from "@/types/sprint"

interface AddSprintMemberDialogProps {
  sprintUsers?: SprintUser[]
  project?: CreatedProject
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSprintMemberDialog({ sprintUsers, project, sprintId, open, onOpenChange }: AddSprintMemberDialogProps) {
  const dispatch = useDispatch()
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId))

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([])
  const [loading, setLoading] = useState(false)

  // Get current sprint team member IDs
  const currentUserIds = sprintUsers?.map((member) => member.user.id) || []

  // Filter available users (not already in sprint)
  const availableUsers = projectUsers.filter((user) => !currentUserIds.includes(user.userId))


  const handleGetProjectUsers = useCallback(async (projectId: string) => {
    setLoading(true)
    const usersData = await getActiveProjectUsersHelper(projectId, { setLoading })
    if (usersData) {
      setProjectUsers(usersData)
    } else {
      setProjectUsers([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (project) {
      handleGetProjectUsers(project.id)
    }
  }, [project, handleGetProjectUsers])

  const handleUserToggle = (userId: string) => {
    setSelectAll(false)
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedUsers([])
    }
  }

  const filteredUsers = availableUsers.filter((user) =>
    (user.firstname + " " + user.lastname).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddMembers = async () => {
    let usersToAdd: string[] = []

    if (selectAll) {
      usersToAdd = availableUsers.map((user) => user.userId)
    } else {
      usersToAdd = [...selectedUsers]
    }

    if (usersToAdd.length > 0 && !!sprint) {
      setIsAdding(true)

      let body: AddUserToSprintRequest = {
        projectId: sprint?.createdProject.id,
        sprintId: sprint?.id,
        userIds: [...usersToAdd]
      }

      const response = await addBulkUserToSprintHelper(body, { setLoading })
      if (response) {
        setSelectedUsers([])
        setSelectAll(false)
        setSearchTerm("")
        onOpenChange(false) // Diyalogu kapat
      }
    }
  }

  const getTotalSelectedCount = () => {
    if (selectAll) {
      return availableUsers.length
    }
    return selectedUsers.length
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Members to Sprint</DialogTitle>
          <DialogDescription>
            Select individual users or project teams to add to this sprint.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="grid gap-4 py-4 flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-4">
                    <Card className="border-dashed">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={selectAll} onCheckedChange={(checked: boolean) => handleSelectAll(checked)} />
                          <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base">Select All Project Users</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Add all {availableUsers?.length} available users to this sprint
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {availableUsers?.length} users
                          </Badge>
                        </div>
                        {selectAll && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                              <strong>Note:</strong> This will add all {availableUsers?.length} available project users to the sprint
                              team.
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {!selectAll && (
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
                            {filteredUsers.map((user: ProjectUser) => (
                              <Card key={user.userId} className="cursor-pointer hover:bg-muted/50">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={selectedUsers.includes(user.userId)}
                                      onCheckedChange={() => handleUserToggle(user.userId)}
                                    />
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                      <AvatarImage src={"/placeholder.svg"} alt={user.firstname + " " + user.lastname} />
                                      <AvatarFallback className="text-xs sm:text-sm">
                                        {user.firstname
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("") +
                                          user.lastname
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm sm:text-base truncate">
                                        {user.firstname + " " + user.lastname}
                                      </div>
                                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                        {user.email}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs flex-shrink-0">
                                      {user.projectSystemRole}
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
                </div>
              </div>
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
                    onClick={handleAddMembers}
                    disabled={getTotalSelectedCount() === 0 || isAdding}
                    className="min-w-[100px]"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}