import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeamWithMembers } from "@/data/teams"

interface TeamCardProps {
  team: TeamWithMembers
  projectId: string
}

export function TeamCard({ team, projectId }: TeamCardProps) {
  return (
    <Card key={team.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{team.name}</CardTitle>
        <CardDescription className="line-clamp-2">{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {team.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background"
                title={member.name}
              >
                {member.initials}
              </div>
            ))}
            {team.members.length > 3 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs ring-2 ring-background">
                +{team.members.length - 3}
              </div>
            )}
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
