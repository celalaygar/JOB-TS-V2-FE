"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { myCompanyData } from "@/data/my-company"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Users } from "lucide-react"
import type { MyCompanyTeam } from "@/types/my-company"

export function MyCompanyTeams() {
  const { translations: t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<MyCompanyTeam | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredTeams = myCompanyData.teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.lead.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewTeam = (team: MyCompanyTeam) => {
    setSelectedTeam(team)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.myCompany.searchTeams}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredTeams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{team.name}</CardTitle>
                <CardDescription className="line-clamp-2">{team.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.myCompany.teamLead}</span>
                    <span className="text-sm font-medium">{team.lead}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.myCompany.teamMembersCount}</span>
                    <span className="text-sm font-medium">{team.membersCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.myCompany.createdDate}</span>
                    <span className="text-sm font-medium">{new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => handleViewTeam(team)}>
                  {t.myCompany.viewTeam}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t.myCompany.noTeams}</h3>
        </div>
      )}

      {/* Team Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTeam && (
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.myCompany.teamDetails}</DialogTitle>
              <DialogDescription>{selectedTeam.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.teamName}</p>
                  <p>{selectedTeam.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.teamLead}</p>
                  <p>{selectedTeam.lead}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.teamDescription}</p>
                  <p>{selectedTeam.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.createdDate}</p>
                  <p>{new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.teamMembersCount}</p>
                  <p>{selectedTeam.membersCount}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">{t.myCompany.teamMembers}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.myCompany.employeeName}</TableHead>
                      <TableHead>{t.myCompany.employeeEmail}</TableHead>
                      <TableHead className="hidden md:table-cell">{t.myCompany.employeeRole}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t.myCompany.employeeDepartment}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t.myCompany.employeeStatus}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTeam.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{member.role}</TableCell>
                        <TableCell className="hidden lg:table-cell">{member.department}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={member.status === "active" ? "success" : "secondary"}>
                            {member.status === "active" ? t.myCompany.active : t.myCompany.inactive}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t.myCompany.close}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
