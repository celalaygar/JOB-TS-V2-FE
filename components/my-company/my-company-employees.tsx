"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { myCompanyData } from "@/data/my-company"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, User } from "lucide-react"
import type { MyCompanyEmployee } from "@/types/my-company"

export function MyCompanyEmployees() {
  const { translations: t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<MyCompanyEmployee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredEmployees = myCompanyData.employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewEmployee = (employee: MyCompanyEmployee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t.myCompany.searchEmployees}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredEmployees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.myCompany.employeeName}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.myCompany.employeeEmail}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.myCompany.employeeRole}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t.myCompany.employeeDepartment}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t.myCompany.employeeStatus}</TableHead>
                  <TableHead className="text-right">{t.myCompany.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={employee.status === "active" ? "success" : "secondary"}>
                        {employee.status === "active" ? t.myCompany.active : t.myCompany.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(employee)}>
                        {t.myCompany.viewDetails}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t.myCompany.noEmployees}</h3>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedEmployee && (
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.myCompany.employeeDetails}</DialogTitle>
              <DialogDescription>{selectedEmployee.name}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeName}</p>
                  <p>{selectedEmployee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeEmail}</p>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeePhone}</p>
                  <p>{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.position}</p>
                  <p>{selectedEmployee.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeRole}</p>
                  <p>{selectedEmployee.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeDepartment}</p>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.employeeStatus}</p>
                  <Badge variant={selectedEmployee.status === "active" ? "success" : "secondary"}>
                    {selectedEmployee.status === "active" ? t.myCompany.active : t.myCompany.inactive}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t.myCompany.joinedDate}</p>
                  <p>{new Date(selectedEmployee.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.myCompany.employeeSkills}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{t.myCompany.employeeProjects}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.projects.map((project, index) => (
                    <Badge key={index} variant="outline">
                      {project}
                    </Badge>
                  ))}
                </div>
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
