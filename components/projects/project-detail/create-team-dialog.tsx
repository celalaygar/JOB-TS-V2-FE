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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { users } from "@/data/users"

interface CreateTeamDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTeam: (team: any) => void
}

export function CreateTeamDialog({ projectId, open, onOpenChange, onCreateTeam }: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [teamLead, setTeamLead] = useState("")

  const handleCreateTeam = () => {
    if (!teamName) return

    const newTeam = {
      id: `team-${Date.now()}`,
      projectId,
      name: teamName,
      description: teamDescription,
      members: selectedMembers.map((id) => {
        const user = users.find((u) => u.id === id)
        return {
          id,
          name: user?.name || "",
          role: id === teamLead ? "Team Lead" : "Member",
        }
      }),
      createdAt: new Date().toISOString(),
    }

    onCreateTeam(newTeam)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTeamName("")
    setTeamDescription("")
    setSelectedMembers([])
    setTeamLead("")
  }

  const handleAddMember = (userId: string) => {
    if (!selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId])
    }
  }

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== userId))
    if (teamLead === userId) {
      setTeamLead("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team for this project. Add team members and assign a team lead.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team-description">Description</Label>
            <Textarea
              id="team-description"
              placeholder="Enter team description"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Team Members</Label>
            <Select onValueChange={handleAddMember}>
              <SelectTrigger>
                <SelectValue placeholder="Add team members" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => !selectedMembers.includes(user.id))
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMembers.map((memberId) => {
                const user = users.find((u) => u.id === memberId)
                return (
                  <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                    {user?.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(memberId)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                )
              })}
              {selectedMembers.length === 0 && <div className="text-sm text-muted-foreground">No members selected</div>}
            </div>
          </div>
          {selectedMembers.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="team-lead">Team Lead</Label>
              <Select value={teamLead} onValueChange={setTeamLead}>
                <SelectTrigger id="team-lead">
                  <SelectValue placeholder="Select team lead" />
                </SelectTrigger>
                <SelectContent>
                  {selectedMembers.map((memberId) => {
                    const user = users.find((u) => u.id === memberId)
                    return (
                      <SelectItem key={memberId} value={memberId}>
                        {user?.name}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateTeam} disabled={!teamName || selectedMembers.length === 0 || !teamLead}>
            Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
