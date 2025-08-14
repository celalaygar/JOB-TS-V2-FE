"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Info, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddSprintMemberDialog } from "./add-sprint-member-dialog"
import { useState } from "react"
import { Sprint, SprintUser } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { Project } from "@/types/project"

interface SprintDetailInfoProps {
  sprintUsers?: SprintUser[]
}

export function SprintDetailInfo({ sprintUsers }: SprintDetailInfoProps) {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const { translations } = useLanguage()

  const sprint: Sprint | null = useSelector((state: RootState) => state.sprints.singleSprint)

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Sprint Information</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>Details about this sprint and assigned team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project and Sprint Code - Yan yana durup, sığmazsa alt satıra geçmesi için flex-wrap kullanıldı */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:flex-wrap gap-4"> {/* sm breakpoint'inde yan yana, altında dikey */}
            {sprint.createdProject && (
              <div className="flex-1 min-w-0"> {/* flex-1 ve min-w-0 div'in içeriği kadar yer kaplamasını ve taşmasını engellemesini sağlar */}
                <h3 className="text-sm font-medium mb-2">{translations.sprint.project}</h3>
                {/* Uzun project isimlerinin satır sonuna geldiğinde kelime kırmasını sağlar */}
                <p className="text-sm text-muted-foreground break-words">{sprint.createdProject.name}</p>
                <h3 className="text-sm font-medium mb-2 mt-5">Task Status on Completion</h3>
                <p className="text-sm text-muted-foreground break-words">{sprint.taskStatusOnCompletion.name}</p>
              </div>
            )}
            {sprint.sprintCode && (
              <div className="flex-shrink-1"> {/* flex-shrink-0 bunun küçülmesini engeller */}
                <h3 className="text-sm font-medium mb-2">Sprint Code</h3>
                <p className="text-sm text-muted-foreground">{sprint.sprintCode}</p>

                <h3 className="text-sm font-medium mb-2">Created By</h3>
                <p className="text-sm text-muted-foreground">{sprint.createdBy?.email}</p>
                <p className="text-sm text-muted-foreground">{sprint.createdBy?.firstname + " " + sprint.createdBy?.lastname}</p>
              </div>
            )}
          </div>

          {sprint.description && (
            <div>
              <h3 className="text-sm font-medium mb-2"> {translations.sprint.form.description} </h3>
              <p className="text-sm text-muted-foreground break-words">{sprint.description}</p> {/* Açıklama için de ekledim */}
            </div>
          )}

          {/* Team Information */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {translations.sprint.form.team}
              </h3>
              <Button size="sm" variant="outline" onClick={() => setIsAddMemberDialogOpen(true)} className="h-8 px-3">
                <Plus className="h-3 w-3 mr-1" />
                Add User
              </Button>
            </div>

            <div className="space-y-3">
              {!!sprintUsers && sprintUsers.length > 0 ?
                (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium mb-2 text-muted-foreground">Team Members</h4>
                    <div className="flex flex-wrap gap-2">
                      {sprintUsers.map((member: SprintUser) => (
                        <div key={member.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={"/placeholder.svg"}
                              alt={member.user.firstname + " " + member.user.lastname} />
                          </Avatar>
                          <span className="text-sm">{member.user.firstname + " " + member.user.lastname}</span>
                          <span className="text-sm">{member.user.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Project-wide Sprint</span>
                    <Badge variant="outline" className="text-xs">
                      No Sprint User
                    </Badge>
                  </div>
                )
              }
            </div>
          </div>
        </CardContent>
      </Card>
      {sprint &&
        <AddSprintMemberDialog
          sprintUsers={sprintUsers}
          project={sprint.createdProject}
          sprintId={sprint.id}
          open={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
        />
      }
    </>
  )
}