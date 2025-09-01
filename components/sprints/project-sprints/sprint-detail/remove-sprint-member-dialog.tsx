"use client"

import { useState } from "react"
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
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Search, UserMinus, Loader2 } from "lucide-react"
import { CreatedProject } from "@/types/project"
import { RemoveUserFromSprintRequest, Sprint, SprintUser, SprintUserSystemRole } from "@/types/sprint"
import { removeBulkUserFromSprintHelper } from "@/lib/service/helper/sprint-helper"
import { useLanguage } from "@/lib/i18n/context"

interface RemoveSprintMemberDialogProps {
  sprint?: Sprint
  sprintUsers?: SprintUser[]
  project?: CreatedProject
  sprintId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  fetchData: () => void
}

export function RemoveSprintMemberDialog({ sprintUsers, project, sprintId, open, onOpenChange, fetchData }: RemoveSprintMemberDialogProps) {
  const { translations } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const getTotalSelectedCount = () => selectedUsers.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{translations.sprint.form.removeMembersTitle}</DialogTitle>
          <DialogDescription>
            {translations.sprint.form.removeMembersDescription}
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
                  placeholder={translations.sprint.form.searchMembersPlaceholder}
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
                            <div className="font-medium text-sm sm:text-base">
                              {translations.sprint.form.removeAllMembers}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {translations.sprint.form.removeAllMembersDescription.replace("{count}", String(usersToRemove.length))}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {usersToRemove.length} {translations.sprint.form.members}
                          </Badge>
                        </div>
                        {selectAll && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="text-xs sm:text-sm text-red-800 dark:text-red-200">
                              <strong>{translations.sprint.form.warning}</strong> {translations.sprint.form.removeAllWarning}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {!selectAll && (
                      <div className="space-y-2">
                        {filteredUsers.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            {searchTerm
                              ? translations.sprint.form.noUsersFound
                              : translations.sprint.form.noMembersInSprint}
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-medium text-muted-foreground px-1">
                              {translations.sprint.form.selectIndividualMembers.replace("{count}", String(filteredUsers.length))}
                            </div>
                            {filteredUsers.map((user: SprintUser) => (
                              <Card key={user.id} className="cursor-pointer hover:bg-muted/50 ">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      disabled={user.sprintUserSystemRole === SprintUserSystemRole.SPRINT_ADMIN}
                                      checked={selectedUsers.includes(user.createdBy.id)}
                                      onCheckedChange={() => handleUserToggle(user.createdBy.id)}
                                    />
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        {user.createdBy.firstname.charAt(0).toUpperCase() +
                                          " " +
                                          user.createdBy.lastname.charAt(0).toUpperCase()}
                                      </div>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm sm:text-base truncate">
                                        {user.sprintUserSystemRole === SprintUserSystemRole.SPRINT_ADMIN ? "🏆 " : ""}
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
                        {translations.sprint.form.usersSelected
                          .replace("{count}", String(getTotalSelectedCount()))
                          .replace("{plural}", getTotalSelectedCount() !== 1 ? "s" : "")}
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
                    {translations.sprint.form.cancel}
                  </Button>
                  <Button
                    onClick={handleRemoveMembers}
                    disabled={getTotalSelectedCount() === 0 || loading}
                    className="min-w-[100px]"
                    variant="destructive"
                  >
                    {translations.sprint.form.remove}
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
