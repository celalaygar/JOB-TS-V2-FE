"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyCompanyHeader } from "@/components/my-company/my-company-header"
import { MyCompanyInfo } from "@/components/my-company/my-company-info"
import { MyCompanyEmployees } from "@/components/my-company/my-company-employees"
import { MyCompanyTeams } from "@/components/my-company/my-company-teams"
import { useLanguage } from "@/lib/i18n/context"

export default function MyCompanyPage() {
  const { translations: t } = useLanguage()

  return (
    <div className="flex flex-col space-y-6 p-6">
      <MyCompanyHeader />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t.myCompany.overview}</TabsTrigger>
          <TabsTrigger value="employees">{t.myCompany.employees}</TabsTrigger>
          <TabsTrigger value="teams">{t.myCompany.teams}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <h2 className="text-2xl font-bold">{t.myCompany.basicInfo}</h2>
          <MyCompanyInfo />
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <h2 className="text-2xl font-bold">{t.myCompany.employeesList}</h2>
          <MyCompanyEmployees />
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <h2 className="text-2xl font-bold">{t.myCompany.teamsList}</h2>
          <MyCompanyTeams />
        </TabsContent>
      </Tabs>
    </div>
  )
}
