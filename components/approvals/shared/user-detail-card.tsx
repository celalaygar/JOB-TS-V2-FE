"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Building, Briefcase } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
  position: string
}

interface UserDetailCardProps {
  user: User
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          <div className="space-y-3 text-center sm:text-left">
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.position}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{user.department}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{user.position}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
