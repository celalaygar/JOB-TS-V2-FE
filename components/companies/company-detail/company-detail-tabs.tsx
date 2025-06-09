"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/context"
import { CompanyDetailInfo } from "./company-detail-info"
import { CompanyRolesManagement } from "./company-roles/company-roles-management"
import type { Company } from "@/data/companies"

interface CompanyDetailTabsProps {
  company: Company
  onActivate: () => void
  onDeactivate: () => void
  onAddUser: () => void
}

export function CompanyDetailTabs({ company, onActivate, onDeactivate, onAddUser }: CompanyDetailTabsProps) {
  const { translations } = useLanguage()
  const [activeTab, setActiveTab] = useState("basic-info")

  const tabs = [
    { id: "basic-info", label: translations.companies?.basicInfo || "Basic Info" },
    { id: "company-employees", label: translations.companies?.companyEmployees || "Employees" },
    { id: "company-roles", label: translations.companies?.companyRoles || "Roles" },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Custom Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap -mb-px gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer inline-flex items-center px-1 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-medium border-b-2 ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
                } transition-colors duration-200`}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "basic-info" && (
          <CompanyDetailInfo
            company={company}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onAddUser={onAddUser}
            hideTabNavigation
          />
        )}

        {activeTab === "company-employees" && (
          <CompanyDetailInfo
            company={company}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onAddUser={onAddUser}
            initialTab="company-employees"
            hideTabNavigation
          />
        )}

        {activeTab === "company-roles" && <CompanyRolesManagement companyId={company.id} />}
      </div>
    </div>
  )
}
