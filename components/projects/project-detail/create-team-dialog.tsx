"use client"

import { useEffect, useState } from "react"
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
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ProjectTeam } from "@/types/project"
import BaseService from "@/lib/service/BaseService"
import { PROJECT_TEAM_URL } from "@/lib/service/BasePath"
import { httpMethods } from "@/lib/service/HttpService"

interface CreateTeamDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTeam: (team: ProjectTeam) => void
  projectTeams: ProjectTeam[]
  setProjectTeams: (teams: ProjectTeam[]) => void
  team?: ProjectTeam// Optional prop for editing
  setSelectedProjectTeam: (team: ProjectTeam | undefined | null) => void
}

export function CreateTeamDialog({
  projectId,
  open,
  onOpenChange,
  onCreateTeam,
  projectTeams,
  setProjectTeams,
  setSelectedProjectTeam,
  team
}: CreateTeamDialogProps) {
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const isEditMode = !!team?.id

  useEffect(() => {
    if (team) {
      setTeamName(team.name || "")
      setTeamDescription(team.description || "")
    } else {
      resetForm()
    }
  }, [team, open])

  const handleSubmit = async () => {
    if (!teamName) return

    const payload: ProjectTeam = {
      ...team,
      id: team?.id || "",
      projectId,
      name: teamName,
      description: teamDescription,
    }

    setLoading(true)
    try {
      const method = isEditMode ? httpMethods.PUT : httpMethods.POST

      const response: ProjectTeam = await BaseService.request<ProjectTeam>(PROJECT_TEAM_URL, {
        method,
        body: payload,
      })

      toast({
        title: `Project Team ${isEditMode ? "updated" : "created"}.`,
        description: `Team name: ${response.name}`,
      })

      // 🔁 Listeyi güncelle
      if (isEditMode) {
        setProjectTeams(projectTeams.map(t => (t.id === response.id ? response : t)))
      } else {
        setProjectTeams([...projectTeams, response])
      }

      onCreateTeam(response)
      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      console.error(`${isEditMode ? "Update" : "Create"} failed`, error)
      toast({
        title: `Team ${isEditMode ? "update" : "creation"} failed.`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setSelectedProjectTeam(undefined)
    }
  }


  const resetForm = () => {
    setTeamName("")
    setTeamDescription("")
  }

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Team" : "Create New Team"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Edit team details." : "Create a new team for this project."}
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!teamName}>
            {isEditMode ? "Update Team" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
