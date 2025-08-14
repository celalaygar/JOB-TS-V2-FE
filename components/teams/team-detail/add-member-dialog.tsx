"use client"


import { useCallback, useEffect, useState } from "react"
import { Check, ChevronsUpDown, UserX, Search, Loader2, ShieldClose, PanelRightClose, PanelBottomClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ProjectUser } from "@/types/project"
import { addProjectTeamUserHelper, getProjectTeamUsersNotInTeamHelper } from "@/lib/service/api-helpers"

interface AddMemberDialogProps {
  fetchProjectUsers: () => void
  teamId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function AddMemberDialog({ fetchProjectUsers, isOpen, onOpenChange, projectId, teamId }: AddMemberDialogProps) {
  const { toast } = useToast()

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [addMemberErrors, setAddMemberErrors] = useState<Record<string, string>>({})


  const [loading, setLoading] = useState(false);
  const [projectUsers, setprojectUsers] = useState<ProjectUser[]>()

  const fetchProjectTeamNotInTeamUsers = useCallback(async () => {
    let body = {
      projectId: projectId,
      teamId: teamId,
    }
    const usersData = await getProjectTeamUsersNotInTeamHelper(body, { setLoading });
    if (usersData) {
      setprojectUsers(usersData);
      console.log("Project users fetched:", usersData);
    } else {
      setprojectUsers([]);
    }
  }, [isOpen, projectId, teamId]);

  useEffect(() => {
    fetchProjectTeamNotInTeamUsers();
  }, [fetchProjectTeamNotInTeamUsers]);



  const handleUserSelection = (userId: string) => {


    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })

    // Clear error when user is selected
    if (addMemberErrors.users) {
      setAddMemberErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.users
        return newErrors
      })
    }
  }

  const validateAddMemberForm = () => {
    const newErrors: Record<string, string> = {}

    if (selectedUsers.length === 0) {
      newErrors.users = "Please select at least one user"
    }

    setAddMemberErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMembers = async () => {
    if (!validateAddMemberForm()) return

    let body = {
      projectId: projectId,
      teamId: teamId,
      projectUserIds: selectedUsers,
    }
    const usersData = await addProjectTeamUserHelper(body, { setLoading });
    if (usersData) {
      setprojectUsers(usersData);
      console.log("Project users fetched:", usersData);
      fetchProjectUsers(); // Refresh the user list after adding members
    } else {
      setprojectUsers([]);
    }

    toast({
      title: "Team members added",
      description: `Added ${selectedUsers.length} members to the team`,
    })

    // Reset form
    setSelectedUsers([])
    setSearchQuery("")
    setIsComboboxOpen(false)
    onOpenChange(false)
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId))
  }

  const handleDialogClose = () => {
    setSelectedUsers([])
    setSearchQuery("")
    setIsComboboxOpen(false)
    setAddMemberErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Team Members</DialogTitle>
          <DialogDescription>Search and select existing users to add to the team.</DialogDescription>
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
              <div className="flex-1 min-h-0 space-y-4 py-4">
                <div className="space-y-4">
                  <Label className={addMemberErrors.users ? "text-destructive" : ""}>Search and Select Users</Label>

                  {/* Searchable Combobox */}
                  <div className="relative">
                    <div
                      className={cn(
                        "flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
                        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        addMemberErrors.users ? "border-destructive" : "",
                        isComboboxOpen ? "ring-2 ring-ring ring-offset-2" : "",
                      )}
                      onClick={() => setIsComboboxOpen(!isComboboxOpen)}
                    >
                      <div className="flex items-center flex-1">
                        <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users by name, email, or role..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </div>

                    {/* Dropdown */}
                    {isComboboxOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between mb-2"
                            onClick={() => setIsComboboxOpen(!isComboboxOpen)}>

                            {selectedUsers.length > 0 ? `Selected ${selectedUsers.length} user(s)` : "Select Users"}
                            <span className="text-xs text-muted-foreground">
                              {projectUsers ? projectUsers.length : 0} users available
                            </span>
                            <span className="sr-only">Toggle user selection</span>
                            <PanelBottomClose className="h-4 w-4" />
                          </Button>

                        </div>
                        {!!projectUsers && projectUsers.length > 0 ? (
                          <div className="p-1">
                            {projectUsers.map((user) => (
                              <div
                                key={user.id}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                                  "hover:bg-blue-100 hover:text-dark",
                                  selectedUsers.includes(user.id) ? "bg-blue-200" : "",
                                )}
                                onClick={() => handleUserSelection(user.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex items-center flex-1">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{user.email}</span>
                                    <span className="text-xs text-muted-foreground">{user.firstname + " " + user.lastname}</span>
                                  </div>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {user.projectSystemRole}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            {searchQuery ? "No users found matching your search." : "No users available."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {addMemberErrors.users && <p className="text-xs text-destructive">{addMemberErrors.users}</p>}

                  {/* Selected Users Display */}
                  {selectedUsers.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Users ({selectedUsers.length})</Label>
                      <div className="max-h-32 overflow-y-auto space-y-2 p-3 border rounded-md bg-muted/500">
                        {selectedUsers.map((userId) => {
                          const user = !!projectUsers && projectUsers.find((u: ProjectUser) => u.id === userId)
                          return user ? (
                            <div key={userId} className="flex items-center justify-between p-2 bg-background rounded border">
                              <div className="flex items-center space-x-2">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{user.email}</span>
                                  <span className="text-xs text-muted-foreground">{user.firstname + " " + user.lastname}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {user.projectSystemRole}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveUser(userId)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10"
                              >
                                <UserX className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove user</span>
                              </Button>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </>
        }
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0 || isComboboxOpen}>
            Add Selected Users ({selectedUsers.length + " " + isComboboxOpen})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
