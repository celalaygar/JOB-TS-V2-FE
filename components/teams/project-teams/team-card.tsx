import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeamWithMembers } from "@/data/teams"
import { ProjectTeam } from "@/types/project"

interface TeamCardProps {
  team?: ProjectTeam
  projectId: string
}

export function TeamCard({ team, projectId }: TeamCardProps) {
  if (!team) {
    return null
  }
  return (
    <Card key={team.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{team.name}</CardTitle>
        <CardDescription className="line-clamp-2">{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background"
              title={team.name}
            >
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div className=" h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs ring-2 ring-background">
              +0
            </div>
          </div>
          <Link href={`/teams/${projectId}/${team.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              View Team
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
