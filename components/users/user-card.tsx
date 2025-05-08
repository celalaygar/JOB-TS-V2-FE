"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, Pencil, Trash2, Building, UserCog } from "lucide-react"
import type { User } from "@/lib/redux/features/users-slice"

interface UserCardProps {
  user: User
  currentUser: User | null
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function UserCard({ user, currentUser, onView, onEdit, onDelete }: UserCardProps) {
  const isAdmin = currentUser?.role === "Admin"
  const isSelf = currentUser?.id === user.id

  // Role-specific styling
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-[var(--fixed-primary)] text-white"
      case "Developer":
        return "bg-green-500 text-white"
      case "Tester":
        return "bg-purple-500 text-white"
      case "Product Owner":
        return "bg-amber-500 text-white"
      default:
        return "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
    }
  }

  return (
    <Card className="fixed-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{user.name}</CardTitle>
              <CardDescription className="text-[var(--fixed-sidebar-muted)]">{user.department}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[var(--fixed-sidebar-fg)]">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <UserCog className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              {(isAdmin || isSelf) && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
              )}
              {isAdmin && !isSelf && (
                <DropdownMenuItem className="text-[var(--fixed-danger)]" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <Badge className={getRoleBadgeStyle(user.role)}>{user.role}</Badge>
          <div className="grid gap-1">
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
              {user.email}
            </div>
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
              {user.phone}
            </div>
            <div className="flex items-center text-sm">
              <Building className="mr-2 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
              {user.department}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
          onClick={onView}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
