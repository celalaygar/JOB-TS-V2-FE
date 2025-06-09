"use client"

import React, { useState, useEffect, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useLanguage } from "@/lib/i18n/context"
import {
  LayoutDashboard,
  Calendar,
  Bell,
  BarChart3,
  Users,
  Folder,
  FileText,
  ListTodo,
  Trello,
  CalendarDays,
  LogOut,
  Clock,
  DollarSign,
  CalendarCheck,
  ChevronDown,
  FolderKanban,
  Home,
  Building2,
  BuildingIcon as Buildings,
  HomeIcon,
} from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Badge } from "@/components/ui/badge"
import type { SidebarRoutes } from "@/types/sidebarRoute" // Declare the SidebarRoutes variable
import { signOut, useSession } from "next-auth/react"
import { useAuthUser } from "@/lib/hooks/useAuthUser"

function AppSidebar() {

  const authUser = useAuthUser();
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const { translations } = useLanguage()
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const [userRole, setUserRole] = useState<string | null>(null)
  const unreadNotifications = useSelector(
    (state: RootState) => state.notifications?.notifications.filter((n) => !n.read).length || 0,
  )
  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role)
    }
  }, [currentUser])

  const routes: SidebarRoutes[] = [
    {
      key: "mainMenu",
      category: translations.sidebar.mainMenu,
      icon: HomeIcon,
      routes: [
        { href: "/dashboard", icon: LayoutDashboard, label: translations.sidebar.dashboard },
        { href: "/weekly-board", icon: Calendar, label: translations.sidebar.weeklyBoard },
        { href: "/notifications", icon: Bell, label: translations.sidebar.notifications, badge: unreadNotifications },
        { href: "/reports", icon: BarChart3, label: translations.sidebar.reports },
        { href: "/users", icon: Users, label: translations.sidebar.users },
      ],
    },
    {
      key: "projectTools",
      category: translations.sidebar.projectTools,
      icon: CalendarDays,
      routes: [
        { href: "/projects", icon: Folder, label: translations.sidebar.projects },
        { href: "/tasks", icon: FileText, label: translations.sidebar.tasks },
        { href: "/backlog", icon: ListTodo, label: translations.sidebar.backlog },
        { href: "/kanban", icon: Trello, label: translations.sidebar.kanbanBoard },
        { href: "/sprints", icon: CalendarDays, label: translations.sidebar.sprints },
        { href: "/project-sprints", icon: CalendarDays, label: translations.sidebar.projectSprints },
      ],
    },
    {
      key: "requests",
      category: translations.requests.title,
      icon: DollarSign,
      routes: [
        { href: "/requests/overtime", icon: Clock, label: translations.requests.overtime.title },
        { href: "/requests/leave", icon: Clock, label: translations.requests.leave.title },
        { href: "/requests/spending", icon: DollarSign, label: translations.requests.spending.title },
      ],
    },
    {
      key: "requestManagement",
      category: translations.sidebar.requestManagement,
      icon: Clock,
      routes: [
        {
          href: "/request-approvals/spending",
          icon: DollarSign,
          label: translations.sidebar.spendingRequestManagement,
        },
        { href: "/request-approvals/leave", icon: CalendarCheck, label: translations.sidebar.leaveRequestManagement },
        { href: "/request-approvals/overtime", icon: Clock, label: translations.sidebar.overtimeRequestManagement },
      ],
    },
    {
      key: "teams",
      category: translations.sidebar.teams,
      icon: FolderKanban,
      routes: [
        { href: "/teams/project-teams", icon: FolderKanban, label: translations.sidebar.projectTeams },
        { href: "/teams/company-teams", icon: Building2, label: translations.sidebar.companyTeams },
      ],
    },
    {
      key: "companies",
      category: translations.sidebar.companies,
      icon: Buildings,
      routes: [
        { href: "/companies", icon: Buildings, label: translations.sidebar.companies },
        { href: "/my-company", icon: Buildings, label: translations.sidebar.myCompany },
      ],
    },
  ]

  // Initialize open categories based on current path
  useEffect(() => {
    const currentCategory = routes.find((category) =>
      category.routes.some((route) => pathname === route.href || pathname.startsWith(`${route.href}/`)),
    )

    if (currentCategory) {
      setOpenCategories((prev) =>
        prev.includes(currentCategory.category) ? prev : [...prev, currentCategory.category],
      )
    }
  }, [pathname])

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const handleLogout = async () => {
    try {
      const currentOrigin = window.location.origin;
      await fetch("/api/auth/logout");
      await signOut({ callbackUrl: currentOrigin + "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Overlay for mobile only */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden " onClick={toggleSidebar} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0 " : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6 ">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-[var(--fixed-primary)]" />
            <span className="text-lg font-bold text-[var(--fixed-sidebar-fg)]">Issue Tracker</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-4 text-[var(--fixed-sidebar-fg)]">
            {routes.map((category) => (
              <div key={category.key} className="mb-4">
                <button
                  onClick={() => toggleCategory(category.key)}
                  className="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-[var(--fixed-sidebar-muted)] hover:bg-[var(--fixed-sidebar-hover)]"
                >
                  <div className="flex items-center gap-2 text-left">
                    {React.createElement(category.icon, { className: "h-4 w-4" })}
                    <span className="text-left">{category.category}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform ml-auto",
                      openCategories.includes(category.key) ? "rotate-180" : "",
                    )}
                  />
                </button>

                {openCategories.includes(category.key) && (
                  <div className="ml-2 mt-1">
                    {category.routes.map((route) => {
                      const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)
                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "bg-[var(--fixed-sidebar-active)] text-[var(--fixed-sidebar-active-fg)]"
                              : "text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)]",
                          )}
                        >
                          {React.createElement(route.icon, { className: "h-4 w-4" })}
                          <span>{route.label}</span>
                          {route.badge !== undefined && (
                            <Badge className="bg-[var(--fixed-primary)] text-white">{route.badge}</Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-auto py-2">
              <div className="mb-4 px-2 flex items-center justify-between">
                <span className="text-xs font-semibold fixed-sidebar-muted uppercase tracking-wider">
                  {translations.sidebar.user}
                </span>
                {authUser?.user?.email && (
                  <span className="text-xs py-1 px-2 rounded-full bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
                    {authUser.user.email}
                  </span>
                )}
              </div>
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded-md text-sm text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)]"
                prefetch={true}
              >
                <Users className="mr-2 h-5 w-5" />
                <span>Profile</span>
              </Link>
              <div
                onClick={handleLogout}
                className="flex items-center cursor-pointer h-10 px-3 py-2 bg-white hover:bg-white rounded-md text-sm fixed-sidebar-item"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>{translations.sidebar.logOut}</span>
              </div>
            </div>
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}

// Memoize the sidebar to prevent unnecessary re-renders
export const MemoizedAppSidebar = memo(AppSidebar)
