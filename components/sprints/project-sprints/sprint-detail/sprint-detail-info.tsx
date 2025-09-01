"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Info, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddSprintMemberDialog } from "./add-sprint-member-dialog"
import { RemoveSprintMemberDialog } from "./remove-sprint-member-dialog"
import { useState } from "react"
import { Sprint, SprintUser } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

interface SprintDetailInfoProps {
  sprintUsers?: SprintUser[]
  fetchData: () => void
}

export function SprintDetailInfo({ sprintUsers, fetchData }: SprintDetailInfoProps) {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] = useState(false)
  const { translations } = useLanguage()
  const sprint: Sprint | null = useSelector((state: RootState) => state.sprints.singleSprint)

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{translations.sprint.form.sprintCode}</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>{translations.sprint.form.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:flex-wrap gap-4">
            {sprint?.createdProject && (
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-2">{translations.sprint.project}</h3>
                <p className="text-sm text-muted-foreground break-words">{sprint.createdProject.name}</p>

                <h3 className="text-sm font-medium mb-2 mt-5">{translations.sprint.form.description}</h3>
                <p className="text-sm text-muted-foreground break-words">{sprint.taskStatusOnCompletion.name}</p>
              </div>
            )}

            {sprint?.sprintCode && (
              <div className="flex-shrink-1">
                <h3 className="text-sm font-medium mb-2">{translations.sprint.form.sprintCode}</h3>
                <p className="text-sm text-muted-foreground">{sprint.sprintCode}</p>

                <h3 className="text-sm font-medium mb-2">{translations.sprint.form.createdBy}</h3>
                <p className="text-sm text-muted-foreground">{sprint.createdBy?.email}</p>
                <p className="text-sm text-muted-foreground">
                  {sprint.createdBy?.firstname + " " + sprint.createdBy?.lastname}
                </p>
              </div>
            )}
          </div>

          {sprint?.description && (
            <div>
              <h3 className="text-sm font-medium mb-2">{translations.sprint.form.description}</h3>
              <p className="text-sm text-muted-foreground break-words">{sprint.description}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {translations.sprint.form.team}
              </h3>

              <Button size="sm" variant="outline" onClick={() => setIsAddMemberDialogOpen(true)} className="h-8 px-3">
                <Plus className="h-3 w-3 mr-1" />
                {translations.sprint.form.addUser}
              </Button>

              <Button size="sm" variant="outline" onClick={() => setIsRemoveMemberDialogOpen(true)} className="h-8 px-3">
                <Plus className="h-3 w-3 mr-1" />
                {translations.sprint.form.removeUser}
              </Button>
            </div>

            <div className="space-y-3">
              {sprintUsers && sprintUsers.length > 0 ? (
                <div className="mt-3">
                  <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                    {translations.sprint.form.teamMembers}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {sprintUsers.map((member: SprintUser) => (
                      <div key={member.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.createdBy.firstname.charAt(0) + " " + member.createdBy.lastname.charAt(0)}
                        </div>
                        <span className="text-sm">
                          {member.createdBy.firstname.charAt(0) + " " + member.createdBy.lastname.charAt(0)}
                        </span>
                        <span className="text-sm">{member.createdBy.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {translations.sprint.form.projectWideSprint}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {translations.sprint.form.noSprintUser}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {sprint && (
        <AddSprintMemberDialog
          fetchData={fetchData}
          sprintUsers={sprintUsers}
          project={sprint.createdProject}
          sprintId={sprint.id}
          open={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
        />
      )}

      {sprint && (
        <RemoveSprintMemberDialog
          fetchData={fetchData}
          sprintUsers={sprintUsers}
          project={sprint.createdProject}
          sprint={sprint}
          sprintId={sprint.id}
          open={isRemoveMemberDialogOpen}
          onOpenChange={setIsRemoveMemberDialogOpen}
        />
      )}
    </>
  )
}
