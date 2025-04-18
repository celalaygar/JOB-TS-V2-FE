"use client"

interface TaskDetailTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function TaskDetailTabs({ activeTab, onTabChange }: TaskDetailTabsProps) {
  const tabs = [
    { id: "details", label: "Details" },
    { id: "comments", label: "Comments" },
    { id: "attachments", label: "Attachments" },
    { id: "activity", label: "Activity" },
    { id: "related", label: "Related Tasks" },
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="tabmenu flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer pb-2 px-1 text-left sm:text-center ${
              activeTab === tab.id ? "border-b-2 border-primary font-medium text-primary" : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  )
}
