"use client"

import { useState } from "react"
import { MyCompanyHeader } from "@/components/my-company/my-company-header"
import { MyCompanyInfo } from "@/components/my-company/my-company-info"
import { MyCompanyEmployees } from "@/components/my-company/my-company-employees"
import { MyCompanyTeams } from "@/components/my-company/my-company-teams"
import { useLanguage } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export default function MyCompanyPage() {
  const { translations: t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"overview" | "employees" | "teams">("overview")

  return (
    <div className="flex flex-col space-y-6 p-6">
      <MyCompanyHeader />

      {/* Custom tab navigation with Tailwind */}
      <div className="mb-6 flex flex-wrap gap-2 border-b">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          {t.myCompany.overview}
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "employees" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          {t.myCompany.employees}
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "teams" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          {t.myCompany.teams}
        </button>
      </div>

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            <h2 className="text-2xl font-bold">{t.myCompany.basicInfo}</h2>
            <MyCompanyInfo />
          </>
        )}

        {activeTab === "employees" && (
          <>
            <h2 className="text-2xl font-bold">{t.myCompany.employeesList}</h2>
            <MyCompanyEmployees />
          </>
        )}

        {activeTab === "teams" && (
          <>
            <h2 className="text-2xl font-bold">{t.myCompany.teamsList}</h2>
            <MyCompanyTeams />
          </>
        )}
      </div>
    </div>
  )
}
