"use client"

import { useState } from "react"
import { MoreVertical, UserCog, Ban, UserMinus, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { TeamMember, TeamMemberStatus } from "@/data/teams"
import { UserActionDialog } from "./user-action-dialog"
import { ProjectUser } from "@/types/project"

interface TeamMembersTableProps {
  members: ProjectUser[]
  onEditRole: (member: TeamMember) => void
  onBanMember: (member: TeamMember) => void
  onDeactivateMember: (member: TeamMember) => void
  onRemoveMember: (member: TeamMember) => void
}

export function TeamMembersTable({
  members,
  onEditRole,
  onBanMember,
  onDeactivateMember,
  onRemoveMember,
}: TeamMembersTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [userActionDialogOpen, setUserActionDialogOpen] = useState(false)

  // Get status badge variant
  const getStatusBadge = (status: TeamMemberStatus) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>
      case "Banned":
        return <Badge className="bg-red-500">Banned</Badge>
      case "Inactive":
        return <Badge variant="outline">Inactive</Badge>
    }
  }

  const handleUserAction = (action: string, reason: string) => {
    console.log(`Action: ${action}, User: ${selectedUser?.name}, Reason: ${reason}`)
    // Here you would implement the actual logic to handle the user action
    // For example, dispatch a Redux action to update the user's status
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Email</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {
              !!members ? members.map((member: ProjectUser) => (
                <tr key={member.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.firstname.charAt(0) + " " + member.lastname.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{member.firstname + " " + member.lastname}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle hidden md:table-cell">{member.email}</td>
                  <td className="p-4 align-middle">{member.projectSystemRole}</td>
                  <td className="p-4 align-middle">{getStatusBadge("Active")}</td>
                  <td className="p-4 align-middle text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(member)
                            setUserActionDialogOpen(true)
                          }}
                          className="text-red-500"
                        >
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBanMember(member)} className="text-red-600">
                          <Ban className="mr-2 h-4 w-4" />
                          Ban Member
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeactivateMember(member)}>
                          <UserMinus className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRemoveMember(member)} className="text-red-600">
                          <UserX className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
                :
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    No team members found matching your filters
                  </td>
                </tr>

            }
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <UserActionDialog
          open={userActionDialogOpen}
          onOpenChange={setUserActionDialogOpen}
          user={selectedUser}
          onConfirm={handleUserAction}
        />
      )}
    </div>
  )
}
