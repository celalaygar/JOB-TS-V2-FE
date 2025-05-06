"use client"

import { ArrowLeft, Info, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TeamDetailHeaderProps {
  teamName: string
  teamDescription: string
  onBack: () => void
  onShowProjectDetails: () => void
  onAddMember: () => void
}

export function TeamDetailHeader({
  teamName,
  teamDescription,
  onBack,
  onShowProjectDetails,
  onAddMember,
}: TeamDetailHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Button variant="ghost" onClick={onBack} className="w-fit gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Project Teams
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{teamName}</h1>
          </div>
          <p className="text-muted-foreground">{teamDescription}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onShowProjectDetails} className="gap-2">
            <Info className="h-4 w-4" />
            Project Information
          </Button>
          <Button onClick={onAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>
    </div>
  )
}
