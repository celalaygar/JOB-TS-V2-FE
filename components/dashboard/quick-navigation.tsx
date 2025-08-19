import Link from "next/link"
import { BarChart3, CalendarDays, Folder, ListTodo, Trello, Users } from "lucide-react"

export function QuickNavigation() {
  const navigationItems = [
    {
      title: "Projects",
      description: "Manage all projects",
      icon: Folder,
      href: "/projects",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tasks",
      description: "Track all Tasks",
      icon: ListTodo,
      href: "/tasks",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Kanban Board",
      description: "Visualize workflow",
      icon: Trello,
      href: "/kanban",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Sprints",
      description: "Plan development cycles",
      icon: CalendarDays,
      href: "/project-sprints",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Team",
      description: "Manage team members",
      icon: Users,
      href: "/teams/project-teams",
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "Reports",
      description: "View analytics",
      icon: BarChart3,
      href: "/reports",
      color: "bg-indigo-50 text-indigo-600",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Navigation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {navigationItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="fixed-card rounded-lg p-4 flex flex-col items-center text-center transition-transform hover:scale-105"
          >
            <div className={`p-3 rounded-full mb-3 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-sm">{item.title}</h3>
            <p className="text-xs text-[var(--fixed-sidebar-muted)]">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
