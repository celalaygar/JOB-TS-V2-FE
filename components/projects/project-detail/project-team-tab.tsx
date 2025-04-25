"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { TeamMemberCard } from "./team-member-card"
import type { Project } from "@/types/project"

interface ProjectTeamTabProps {
  project: Project
  onInviteClick: () => void
}

export function ProjectTeamTab({ project, onInviteClick }: ProjectTeamTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight">Team Members</h2>
        <Button onClick={onInviteClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {project.team.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
        {project.team.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No team members yet. Invite some users to join your project.</p>
          </div>
        )}
      </div>
    </div>
  )
}
