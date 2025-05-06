"use client"

import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2, Ban, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/i18n/context"
import type { TeamMember } from "@/data/company-teams"

interface TeamMembersTableProps {
  members: TeamMember[]
  onEditRole: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onBan: (member: TeamMember) => void
  onActivate: (member: TeamMember) => void
  onDeactivate: (member: TeamMember) => void
}

export function TeamMembersTable({
  members,
  onEditRole,
  onDelete,
  onBan,
  onActivate,
  onDeactivate,
}: TeamMembersTableProps) {
  const { translations } = useLanguage()

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 border rounded-lg">
        <h3 className="text-lg font-medium">{translations.teams?.companyTeams.noMembers}</h3>
      </div>
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      case "banned":
        return "destructive"
      default:
        return "default"
    }
  }

  // Mobile card view for each member
  const MemberCard = ({ member }: { member: TeamMember }) => (
    <div className="border rounded-lg p-4 mb-4 bg-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{member.name}</h3>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditRole(member)}>
              <Pencil className="h-4 w-4 mr-2" />
              {translations.teams?.companyTeams.editMemberRole}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {member.status !== "Active" && (
              <DropdownMenuItem onClick={() => onActivate(member)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {translations.teams?.companyTeams.activateMember}
              </DropdownMenuItem>
            )}

            {member.status !== "Inactive" && (
              <DropdownMenuItem onClick={() => onDeactivate(member)}>
                <XCircle className="h-4 w-4 mr-2" />
                {translations.teams?.companyTeams.deactivateMember}
              </DropdownMenuItem>
            )}

            {member.status !== "Banned" && (
              <DropdownMenuItem onClick={() => onBan(member)}>
                <Ban className="h-4 w-4 mr-2" />
                {translations.teams?.companyTeams.banMember}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => onDelete(member)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {translations.teams?.companyTeams.deleteMember}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">{translations.teams?.companyTeams.memberRole}</p>
          <p>{member.role}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{translations.teams?.companyTeams.memberStatus}</p>
          <Badge variant={getStatusBadgeVariant(member.status) as any}>{member.status}</Badge>
        </div>
        <div>
          <p className="text-muted-foreground">{translations.teams?.companyTeams.memberDepartment}</p>
          <p>{member.department}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{translations.teams?.companyTeams.memberJoinedDate}</p>
          <p>{format(new Date(member.joinedAt), "MMM d, yyyy")}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Mobile view - card layout */}
      <div className="md:hidden space-y-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      {/* Desktop view - table layout */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{translations.teams?.companyTeams.memberName}</TableHead>
              <TableHead>{translations.teams?.companyTeams.memberEmail}</TableHead>
              <TableHead>{translations.teams?.companyTeams.memberRole}</TableHead>
              <TableHead>{translations.teams?.companyTeams.memberStatus}</TableHead>
              <TableHead className="hidden lg:table-cell">
                {translations.teams?.companyTeams.memberDepartment}
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                {translations.teams?.companyTeams.memberJoinedDate}
              </TableHead>
              <TableHead className="text-right">{translations.teams?.companyTeams.memberActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(member.status) as any}>{member.status}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{member.department}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(member.joinedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditRole(member)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {translations.teams?.companyTeams.editMemberRole}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {member.status !== "Active" && (
                        <DropdownMenuItem onClick={() => onActivate(member)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {translations.teams?.companyTeams.activateMember}
                        </DropdownMenuItem>
                      )}

                      {member.status !== "Inactive" && (
                        <DropdownMenuItem onClick={() => onDeactivate(member)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          {translations.teams?.companyTeams.deactivateMember}
                        </DropdownMenuItem>
                      )}

                      {member.status !== "Banned" && (
                        <DropdownMenuItem onClick={() => onBan(member)}>
                          <Ban className="h-4 w-4 mr-2" />
                          {translations.teams?.companyTeams.banMember}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDelete(member)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {translations.teams?.companyTeams.deleteMember}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
