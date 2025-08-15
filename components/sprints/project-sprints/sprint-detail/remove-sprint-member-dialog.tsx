"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
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
import { Search, UserMinus, Loader2 } from "lucide-react"
import { CreatedProject } from "@/types/project"
import { RemoveUserFromSprintRequest, SprintUser } from "@/types/sprint"
import { removeBulkUserFromSprintHelper } from "@/lib/service/api-helpers"

interface RemoveSprintMemberDialogProps {
  sprintUsers?: SprintUser[]
  project?: CreatedProject
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  fetchData: () => void
}

export function RemoveSprintMemberDialog({ sprintUsers, project, sprintId, open, onOpenChange, fetchData }: RemoveSprintMemberDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)

  // Sprint'ten çıkarılacak kullanıcılar (sprintUsers)
  const usersToRemove = sprintUsers || []

  const handleUserToggle = (userId: string) => {
    setSelectAll(false)
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedUsers(usersToRemove.map((user) => user.createdBy.id))
    } else {
      setSelectedUsers([])
    }
  }

  const filteredUsers = usersToRemove.filter((user) =>
    (user.createdBy.firstname + " " + user.createdBy.lastname).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRemoveMembers = async () => {
    let usersToRemoveIds: string[] = []

    if (selectAll) {
      usersToRemoveIds = usersToRemove.map((user) => user.createdBy.id)
    } else {
      usersToRemoveIds = [...selectedUsers]
    }

    if (usersToRemoveIds.length > 0 && !!sprintId && !!project) {

      let body: RemoveUserFromSprintRequest = {
        projectId: project.id,
        sprintId: sprintId,
        userIds: [...usersToRemoveIds],
      }

      const response = await removeBulkUserFromSprintHelper(body, { setLoading })
      if (response) {
        setSelectedUsers([])
        setSelectAll(false)
        setSearchTerm("")
        onOpenChange(false)
        fetchData()
      }

    }
  }

  const getTotalSelectedCount = () => {
    return selectedUsers.length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Remove Members from Sprint</DialogTitle>
          <DialogDescription>
            Select individual users to remove from this sprint.
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
                  placeholder="Search sprint members..."
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
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                          />
                          <UserMinus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm sm:text-base">Remove All Sprint Members</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Remove all {usersToRemove.length} members from this sprint
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {usersToRemove.length} members
                          </Badge>
                        </div>
                        {selectAll && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="text-xs sm:text-sm text-red-800 dark:text-red-200">
                              <strong>Warning:</strong> This will remove all members from the sprint team.
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {!selectAll && (
                      <div className="space-y-2">
                        {filteredUsers.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            {searchTerm ? "No users found matching your search." : "No members in this sprint."}
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-medium text-muted-foreground px-1">
                              Select Individual Members ({filteredUsers.length} available)
                            </div>
                            {filteredUsers.map((user: SprintUser) => (
                              <Card key={user.id} className="cursor-pointer hover:bg-muted/50">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      checked={selectedUsers.includes(user.createdBy.id)}
                                      onCheckedChange={() => handleUserToggle(user.createdBy.id)}
                                    />
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                      <AvatarImage src={"/placeholder.svg"} alt={user.createdBy.firstname + " " + user.createdBy.lastname} />
                                      <AvatarFallback className="text-xs sm:text-sm">
                                        {user.createdBy.firstname
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("") +
                                          user.createdBy.lastname
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm sm:text-base truncate">
                                        {user.createdBy.firstname + " " + user.createdBy.lastname}
                                      </div>
                                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                        {user.createdBy.email}
                                      </div>
                                    </div>
                                    <Badge variant="outline" className="text-xs flex-shrink-0">
                                      {user.sprintUserSystemRole}
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
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRemoveMembers}
                    disabled={getTotalSelectedCount() === 0 || loading}
                    className="min-w-[100px]"
                    variant="destructive"
                  >
                    Remove
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