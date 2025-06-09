"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { teams, type TeamMember, type TeamMemberStatus } from "@/data/teams"
import { projects } from "@/data/projects"
import { users } from "@/data/users"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { TeamDetailHeader } from "@/components/teams/team-detail/team-detail-header"
import { TeamDetailFilters } from "@/components/teams/team-detail/team-detail-filters"
import { TeamMembersTable } from "@/components/teams/team-detail/team-members-table"
import { ProjectDetailsDialog } from "@/components/teams/team-detail/project-details-dialog"
import { AddMemberDialog } from "@/components/teams/team-detail/add-member-dialog"
import { EditRoleDialog } from "@/components/teams/team-detail/edit-role-dialog"
import { ConfirmationDialog } from "@/components/teams/team-detail/confirmation-dialog"
import BaseService from "@/lib/service/BaseService"
import { PROJECT_URL, TEAM_DETAIL_URL } from "@/lib/service/BasePath"
import { Project, ProjectTeam } from "@/types/project"
import { useDispatch } from "react-redux"
import { selectProject } from "@/lib/redux/features/projects-slice"
import { Loader2 } from "lucide-react"
import { httpMethods } from "@/lib/service/HttpService"

export default function TeamDetailPage({ projectId, teamId }: { projectId: string; teamId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  // Find the team and project
  const [teamData, setTeamData] = useState<ProjectTeam>();
  const [project, setProject] = useState<Project>();


  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TeamMemberStatus | "All">("All")
  const [roleFilter, setRoleFilter] = useState<string>("All")

  // State for project details dialog
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false)

  // State for add member dialog
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  // State for edit role dialog
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [newRole, setNewRole] = useState("")

  // State for confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<{
    type: "ban" | "deactivate" | "remove" | null
    member: TeamMember | null
  }>({ type: null, member: null })


  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const getProject = useCallback(async () => {
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL + "/" + projectId, {
        method: httpMethods.GET,
      })
      let data = response as Project;
      setProject(data)
      console.log('Project find data ', data)
      dispatch(selectProject(data))
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Project failed:', error)
        toast({
          title: `Project find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])

  const getProjectTeamDetail = useCallback(async () => {
    setLoading(true)
    try {
      let body = {
        id: teamId,
        projectId
      }
      const response = await BaseService.request(TEAM_DETAIL_URL, {
        method: httpMethods.POST,
        body: body
      })
      let data = response as ProjectTeam;
      setTeamData(data)
      console.log('TEAM detail find data ', data)
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Project find all failed. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Project failed:', error)
        toast({
          title: `Project find all failed.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getProject()
    getProjectTeamDetail()
  }, [getProject, getProjectTeamDetail])

  // If team or project not found, show error
  if (!teamData || !project) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <h3 className="text-lg font-medium">Team not found</h3>
            <p className="text-muted-foreground text-center mt-2">
              The team you are looking for does not exist or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get unique roles for filter
  const uniqueRoles = Array.from(new Set(teamData.members && teamData.members.map((member) => member.role)))

  // Filter members based on search and filters
  const filteredMembers = teamData.members && teamData.members.filter((member) => {
    // Apply search filter
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())

    // Apply status filter
    const matchesStatus = statusFilter === "All" || member.status === statusFilter

    // Apply role filter
    const matchesRole = roleFilter === "All" || member.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  // Get available users (not already in the team)
  const availableUsers = users.filter((user) => teamData.members && !teamData.members.some((member) => member.email === user.email))

  // Handle member actions
  const handleEditRole = (member: TeamMember) => {
    setSelectedMember(member)
    setNewRole(member.role)
    setIsEditRoleOpen(true)
  }

  const handleSaveRole = () => {
    if (selectedMember && newRole) {
      // Update the member's role in the team data
      setTeamData((prevTeam) => {
        if (!prevTeam) return prevTeam

        return {
          ...prevTeam,
          members: prevTeam.members && prevTeam.members.map((member) =>
            member.id === selectedMember.id ? { ...member, role: newRole } : member,
          ),
        }
      })

      toast({
        title: "Role updated",
        description: `${selectedMember.name}'s role has been updated to ${newRole}`,
      })
      setIsEditRoleOpen(false)
    }
  }

  const handleConfirmAction = () => {
    if (!confirmAction.member || !confirmAction.type) return

    // Update the team data based on the action
    setTeamData((prevTeam) => {
      if (!prevTeam) return prevTeam

      if (confirmAction.type === "remove") {
        // Remove the member from the team
        return {
          ...prevTeam,
          members: prevTeam.members && prevTeam.members.filter((member) => member.id !== confirmAction.member?.id),
        }
      } else {
        // Update the member's status
        const newStatus: TeamMemberStatus = confirmAction.type === "ban" ? "Banned" : "Inactive"

        return {
          ...prevTeam,
          members: prevTeam.members && prevTeam.members.map((member) =>
            member.id === confirmAction.member?.id ? { ...member, status: newStatus } : member,
          ),
        }
      }
    })

    const actionMessages = {
      ban: `${confirmAction.member.name} has been banned from the team`,
      deactivate: `${confirmAction.member.name} has been deactivated`,
      remove: `${confirmAction.member.name} has been removed from the team`,
    }

    toast({
      title: `Member ${confirmAction.type === "ban" ? "banned" : confirmAction.type === "deactivate" ? "deactivated" : "removed"}`,
      description: actionMessages[confirmAction.type],
    })

    setConfirmAction({ type: null, member: null })
  }

  return loading ? (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </>
  ) : (
    <>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <TeamDetailHeader
          teamName={teamData.name}
          teamDescription={teamData.description}
          onBack={() => router.back()}
          onShowProjectDetails={() => setIsProjectDetailsOpen(true)}
          onAddMember={() => setIsAddMemberOpen(true)}
        />

        {/* Filters */}
        <TeamDetailFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          uniqueRoles={uniqueRoles && uniqueRoles}
        />

        {/* Team Members Table */}
        {filteredMembers && <TeamMembersTable
          members={filteredMembers}
          onEditRole={handleEditRole}
          onBanMember={(member) => setConfirmAction({ type: "ban", member })}
          onDeactivateMember={(member) => setConfirmAction({ type: "deactivate", member })}
          onRemoveMember={(member) => setConfirmAction({ type: "remove", member })}
        />}

        {/* Project Details Dialog */}
        <ProjectDetailsDialog isOpen={isProjectDetailsOpen} onOpenChange={setIsProjectDetailsOpen} project={project} />

        {/* Add Member Dialog */}
        <AddMemberDialog isOpen={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} availableUsers={availableUsers} />

        {/* Edit Role Dialog */}
        <EditRoleDialog
          isOpen={isEditRoleOpen}
          onOpenChange={setIsEditRoleOpen}
          member={selectedMember}
          role={newRole}
          onRoleChange={setNewRole}
          onSave={handleSaveRole}
        />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmAction.type !== null}
          onOpenChange={(open) => !open && setConfirmAction({ type: null, member: null })}
          actionType={confirmAction.type}
          member={confirmAction.member}
          onConfirm={handleConfirmAction}
        />
      </div>
    </>
  )
}
