"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/data/users"

interface AddMemberDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  availableUsers: User[]
}

export function AddMemberDialog({ isOpen, onOpenChange, availableUsers }: AddMemberDialogProps) {
  const { toast } = useToast()

  const [addMemberTab, setAddMemberTab] = useState<"existing" | "new">("existing")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    role: "Member",
  })
  const [addMemberErrors, setAddMemberErrors] = useState<Record<string, string>>({})

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleNewMemberChange = (field: string, value: string) => {
    setNewMemberData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is edited
    if (addMemberErrors[field]) {
      setAddMemberErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateAddMemberForm = () => {
    const newErrors: Record<string, string> = {}

    if (addMemberTab === "new") {
      if (!newMemberData.name.trim()) {
        newErrors.name = "Name is required"
      }

      if (!newMemberData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(newMemberData.email)) {
        newErrors.email = "Email is invalid"
      }

      if (!newMemberData.role.trim()) {
        newErrors.role = "Role is required"
      }
    } else {
      if (selectedUsers.length === 0) {
        newErrors.users = "Please select at least one user"
      }
    }

    setAddMemberErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMembers = () => {
    if (!validateAddMemberForm()) return

    if (addMemberTab === "existing") {
      const selectedUserNames = selectedUsers
        .map((id) => availableUsers.find((user) => user.id === id)?.name || "")
        .filter(Boolean)

      toast({
        title: "Team members added",
        description: `Added ${selectedUserNames.length} members to the team`,
      })
    } else {
      toast({
        title: "Team member invited",
        description: `Invitation sent to ${newMemberData.email}`,
      })
    }

    // Reset form
    setSelectedUsers([])
    setNewMemberData({
      name: "",
      email: "",
      role: "Member",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>Add existing users or invite new members to join the team.</DialogDescription>
        </DialogHeader>

        <Tabs value={addMemberTab} onValueChange={(value) => setAddMemberTab(value as "existing" | "new")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Add Existing Users</TabsTrigger>
            <TabsTrigger value="new">Invite New Member</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4 py-4">
            <div className="space-y-4">
              <Label className={addMemberErrors.users ? "text-destructive" : ""}>Select Users to Add</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between", addMemberErrors.users ? "border-destructive" : "")}
                  >
                    {selectedUsers.length > 0 ? `${selectedUsers.length} users selected` : "Select users"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {availableUsers.map((user) => (
                          <CommandItem key={user.id} value={user.id} onSelect={() => handleUserSelection(user.id)}>
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <div className="flex items-center">
                              <span>{user.name}</span>
                              <Badge className="ml-2 text-xs">{user.role}</Badge>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {addMemberErrors.users && <p className="text-xs text-destructive">{addMemberErrors.users}</p>}

              {selectedUsers.length > 0 && (
                <div className="mt-4">
                  <Label>Selected Users ({selectedUsers.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUsers.map((userId) => {
                      const user = availableUsers.find((u) => u.id === userId)
                      return user ? (
                        <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                          {user.name}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleUserSelection(userId)}
                          >
                            <UserX className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className={addMemberErrors.name ? "text-destructive" : ""}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={newMemberData.name}
                  onChange={(e) => handleNewMemberChange("name", e.target.value)}
                  placeholder="John Smith"
                  className={addMemberErrors.name ? "border-destructive" : ""}
                />
                {addMemberErrors.name && <p className="text-xs text-destructive">{addMemberErrors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className={addMemberErrors.email ? "text-destructive" : ""}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newMemberData.email}
                  onChange={(e) => handleNewMemberChange("email", e.target.value)}
                  placeholder="john.smith@example.com"
                  className={addMemberErrors.email ? "border-destructive" : ""}
                />
                {addMemberErrors.email && <p className="text-xs text-destructive">{addMemberErrors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role" className={addMemberErrors.role ? "text-destructive" : ""}>
                  Role
                </Label>
                <Select value={newMemberData.role} onValueChange={(value) => handleNewMemberChange("role", value)}>
                  <SelectTrigger id="role" className={addMemberErrors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {addMemberErrors.role && <p className="text-xs text-destructive">{addMemberErrors.role}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Invitation Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Enter a personal message to include in the invitation email"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMembers}>
            {addMemberTab === "existing" ? "Add Selected Users" : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
