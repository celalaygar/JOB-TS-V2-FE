"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Info, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddSprintMemberDialog } from "./add-sprint-member-dialog"
import { useState } from "react"
import { Sprint } from "@/types/sprint"
import { useLanguage } from "@/lib/i18n/context"

interface SprintDetailInfoProps {
  sprint: Sprint
  team?: {
    id: string
    name: string
    description?: string
  }
}

export function SprintDetailInfo({ sprint, team }: SprintDetailInfoProps) {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const { translations } = useLanguage()

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
          {/* Description */}
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

            {team ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{team.name}</div>
                  <Badge variant="outline" className="text-xs">
                    Assigned Team
                  </Badge>
                </div>

                {team.description && <p className="text-sm text-muted-foreground break-words">{team.description}</p>}

                {sprint.team.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium mb-2 text-muted-foreground">Team Members</h4>
                    <div className="flex flex-wrap gap-2">
                      {sprint.team.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : sprint?.team?.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">Sprint Team Members</div>
                  <Badge variant="outline" className="text-xs">
                    Custom Team
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sprint.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Project-wide Sprint</span>
                <Badge variant="outline" className="text-xs">
                  No Specific Team
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddSprintMemberDialog
        sprintId={sprint.id}
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
      />
    </>
  )
}