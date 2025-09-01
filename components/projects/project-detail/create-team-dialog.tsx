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
import { ProjectTeam } from "@/types/project"
import { createUpdateProjectTeamHelper } from "@/lib/service/api-helpers"
import { useLanguage } from "@/lib/i18n/context"

interface CreateTeamDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTeam: (team: ProjectTeam) => void
  projectTeams: ProjectTeam[]
  setProjectTeams: (teams: ProjectTeam[]) => void
  team?: ProjectTeam
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
  const { translations } = useLanguage()

  const isEditMode = !!team?.id

  useEffect(() => {
    if (team) {
      setTeamName(team.name || "")
      setTeamDescription(team.description || "")
    } else {
      resetForm()
    }
  }, [team, open])

  const handleCreateOrUpdateProjectTeam = async () => {
    if (!teamName) return

    const payload: ProjectTeam = {
      ...team,
      id: team?.id || "",
      projectId,
      name: teamName,
      description: teamDescription,
    }

    const response = await createUpdateProjectTeamHelper(payload, isEditMode, { setLoading })

    if (response) {
      if (isEditMode) {
        setProjectTeams(projectTeams.map(t => (t.id === response.id ? response : t)))
      } else {
        setProjectTeams([...projectTeams, response])
      }
      onCreateTeam(response)
      resetForm()
    }
    setSelectedProjectTeam(undefined)
    onOpenChange(false)
  }

  const resetForm = () => {
    setTeamName("")
    setTeamDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? translations.projects.editTeamTitle
              : translations.projects.createTeamTitle}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? translations.projects.editTeamDescription
              : translations.projects.createTeamDescription}
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">{translations.projects.teamNameLabel}</Label>
                <Input
                  id="team-name"
                  placeholder={translations.projects.teamNamePlaceholder}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team-description">{translations.projects.teamDescriptionLabel}</Label>
                <Textarea
                  id="team-description"
                  placeholder={translations.projects.teamDescriptionPlaceholder}
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {translations.projects.cancel}
              </Button>
              <Button onClick={handleCreateOrUpdateProjectTeam} disabled={!teamName}>
                {isEditMode
                  ? translations.projects.updateTeam
                  : translations.projects.createTeam}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
