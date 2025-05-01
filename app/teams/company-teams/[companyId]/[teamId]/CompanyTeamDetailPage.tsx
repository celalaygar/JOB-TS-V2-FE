"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/i18n/context"
import { type CompanyTeam, type TeamMember, getCompanyById, getCompanyTeamById } from "@/data/company-teams"
import { TeamDetailHeader } from "@/components/teams/company-team-detail/team-detail-header"
import { TeamDetailFilters } from "@/components/teams/company-team-detail/team-detail-filters"
import { TeamMembersTable } from "@/components/teams/company-team-detail/team-members-table"
import { CompanyDetailDialog } from "@/components/teams/company-team-detail/company-detail-dialog"
import { AddMemberDialog } from "@/components/teams/company-team-detail/add-member-dialog"
import { EditRoleDialog } from "@/components/teams/company-team-detail/edit-role-dialog"
import { ConfirmationDialog } from "@/components/teams/company-team-detail/confirmation-dialog"
import { UserActionDialog } from "@/components/teams/company-team-detail/user-action-dialog"

type FilterStatus = "all" | "active" | "inactive" | "banned"

export default function CompanyTeamDetailPage({
  companyId,
  teamId,
}: {
  companyId: string
  teamId: string
}) {
  const { toast } = useToast()
  const { translations } = useLanguage()
  const [team, setTeam] = useState<CompanyTeam | null>(null)
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [showCompanyDetail, setShowCompanyDetail] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showEditRole, setShowEditRole] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBanConfirm, setShowBanConfirm] = useState(false)
  const [showActivateConfirm, setShowActivateConfirm] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  // Fetch team data
  useEffect(() => {
    const fetchedTeam = getCompanyTeamById(teamId)
    if (fetchedTeam) {
      setTeam(fetchedTeam)
      setFilteredMembers(fetchedTeam.members)
    }
  }, [teamId])

  // Apply filters
  useEffect(() => {
    if (!team) return

    let filtered = team.members

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((member) => member.status.toLowerCase() === filterStatus.toLowerCase())
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query),
      )
    }

    setFilteredMembers(filtered)
  }, [team, filterStatus, searchQuery])

  // Handle member actions
  const handleAddMember = (newMember: TeamMember) => {
    if (!team) return

    const updatedTeam = {
      ...team,
      members: [...team.members, newMember],
    }

    setTeam(updatedTeam)
    toast({
      title: translations.teams?.companyTeams.memberAdded,
      description: `${newMember.name} has been added to the team.`,
    })
  }

  const handleEditRole = (memberId: string, newRole: string) => {
    if (!team) return

    const updatedMembers = team.members.map((member) =>
      member.id === memberId ? { ...member, role: newRole } : member,
    )

    const updatedTeam = {
      ...team,
      members: updatedMembers,
    }

    setTeam(updatedTeam)
    toast({
      title: translations.teams?.companyTeams.roleUpdated,
      description: "The member's role has been updated successfully.",
    })
  }

  const handleDeleteMember = (memberId: string) => {
    if (!team) return

    const updatedMembers = team.members.filter((member) => member.id !== memberId)
    const updatedTeam = {
      ...team,
      members: updatedMembers,
    }

    setTeam(updatedTeam)
    toast({
      title: translations.teams?.companyTeams.memberDeleted,
      description: "The member has been removed from the team.",
    })
  }

  const handleUpdateMemberStatus = (memberId: string, newStatus: "Active" | "Inactive" | "Banned") => {
    if (!team) return

    const updatedMembers = team.members.map((member) =>
      member.id === memberId ? { ...member, status: newStatus } : member,
    )

    const updatedTeam = {
      ...team,
      members: updatedMembers,
    }

    setTeam(updatedTeam)

    let toastTitle = ""
    switch (newStatus) {
      case "Active":
        toastTitle = translations.teams?.companyTeams.memberActivated || ""
        break
      case "Inactive":
        toastTitle = translations.teams?.companyTeams.memberDeactivated || ""
        break
      case "Banned":
        toastTitle = translations.teams?.companyTeams.memberBanned || ""
        break
    }

    toast({
      title: toastTitle,
      description: "The member's status has been updated successfully.",
    })
  }

  // Dialog handlers
  const openEditRoleDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowEditRole(true)
  }

  const openDeleteConfirmDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowDeleteConfirm(true)
  }

  const openBanConfirmDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowBanConfirm(true)
  }

  const openActivateConfirmDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowActivateConfirm(true)
  }

  const openDeactivateConfirmDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowDeactivateConfirm(true)
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load the team details.</p>
        </div>
      </div>
    )
  }

  const company = getCompanyById(companyId)

  return (
    <div className="container mx-auto py-4 md:py-6 px-4 md:px-6 space-y-6">
      <TeamDetailHeader team={team} onViewCompanyDetails={() => setShowCompanyDetail(true)} />

      <TeamDetailFilters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddMember={() => setShowAddMember(true)}
      />

      <TeamMembersTable
        members={filteredMembers}
        onEditRole={openEditRoleDialog}
        onDelete={openDeleteConfirmDialog}
        onBan={openBanConfirmDialog}
        onActivate={openActivateConfirmDialog}
        onDeactivate={openDeactivateConfirmDialog}
      />

      {/* Dialogs */}
      {company && (
        <CompanyDetailDialog company={company} open={showCompanyDetail} onClose={() => setShowCompanyDetail(false)} />
      )}

      <AddMemberDialog
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        onAddMember={handleAddMember}
        teamId={team.id}
        companyId={companyId}
        existingMemberIds={team.members.map((m) => m.userId)}
      />

      {selectedMember && (
        <>
          <EditRoleDialog
            open={showEditRole}
            onClose={() => setShowEditRole(false)}
            member={selectedMember}
            onSave={(role) => {
              handleEditRole(selectedMember.id, role)
              setShowEditRole(false)
            }}
          />

          <ConfirmationDialog
            open={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title={translations.teams?.companyTeams.deleteMember || "Delete Member"}
            description={
              translations.teams?.companyTeams.confirmDelete || "Are you sure you want to delete this member?"
            }
            onConfirm={() => {
              handleDeleteMember(selectedMember.id)
              setShowDeleteConfirm(false)
            }}
          />

          <UserActionDialog
            open={showBanConfirm}
            onClose={() => setShowBanConfirm(false)}
            title={translations.teams?.companyTeams.banMember || "Ban Member"}
            description={translations.teams?.companyTeams.confirmBan || "Are you sure you want to ban this member?"}
            member={selectedMember}
            onConfirm={() => {
              handleUpdateMemberStatus(selectedMember.id, "Banned")
              setShowBanConfirm(false)
            }}
          />

          <UserActionDialog
            open={showActivateConfirm}
            onClose={() => setShowActivateConfirm(false)}
            title={translations.teams?.companyTeams.activateMember || "Activate Member"}
            description={
              translations.teams?.companyTeams.confirmActivate || "Are you sure you want to activate this member?"
            }
            member={selectedMember}
            onConfirm={() => {
              handleUpdateMemberStatus(selectedMember.id, "Active")
              setShowActivateConfirm(false)
            }}
          />

          <UserActionDialog
            open={showDeactivateConfirm}
            onClose={() => setShowDeactivateConfirm(false)}
            title={translations.teams?.companyTeams.deactivateMember || "Deactivate Member"}
            description={
              translations.teams?.companyTeams.confirmDeactivate || "Are you sure you want to deactivate this member?"
            }
            member={selectedMember}
            onConfirm={() => {
              handleUpdateMemberStatus(selectedMember.id, "Inactive")
              setShowDeactivateConfirm(false)
            }}
          />
        </>
      )}
    </div>
  )
}
