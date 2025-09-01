"use client"

import { useLanguage } from "@/lib/i18n/context"

interface ProjectTabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProjectTabNavigation({ activeTab, onTabChange }: ProjectTabNavigationProps) {
  const { translations } = useLanguage()

  const tabs = [
    { id: "overview", label: translations.projects.projectOverview },
    { id: "users", label: translations.projects.users },
    { id: "team", label: translations.projects.team },
    { id: "roles", label: translations.projects.roles },
    { id: "status", label: translations.projects.taskStatusManagement },
    { id: "sent-invitations", label: translations.projects.sentInvitations },
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`px-4 py-2 cursor-pointer transition-colors ${activeTab === tab.id
            ? "border-b-2 border-primary font-medium text-primary"
            : "text-muted-foreground hover:text-foreground"
            }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}
