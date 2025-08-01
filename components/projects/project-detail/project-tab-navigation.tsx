"use client"

interface ProjectTabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProjectTabNavigation({ activeTab, onTabChange }: ProjectTabNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "team", label: "Team" },
    { id: "roles", label: "User Roles" },
    { id: "status", label: "Task Status Management" },
    { id: "sent-invitations", label: "Sent Invitations" },
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
