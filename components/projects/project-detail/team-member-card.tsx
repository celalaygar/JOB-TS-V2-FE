import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/types/user"

interface TeamMemberCardProps {
  member: User
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{member.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <span>{member.email}</span>
        </div>
      </CardContent>
    </Card>
  )
}
