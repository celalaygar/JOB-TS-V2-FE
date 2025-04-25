"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useLanguage } from "@/lib/i18n/context"
import { Badge } from "@/components/ui/badge"
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
  Wrench,
  PlusCircle,
  Clock,
  DollarSign,
  CalendarCheck,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Users2,
  FolderKanban,
  Home,
  Building2,
  BuildingIcon as Buildings,
} from "lucide-react"
import type { SidebarDropdownSection, SidebarRoutes } from "@/types/sidebarRoute"

const SidebarLink = React.memo(
  ({
    href,
    icon: Icon,
    label,
    isActive,
    badge,
  }: {
    href: string
    icon: React.ElementType
    label: string
    isActive: boolean
    badge?: number
  }) => (
    <Link
      href={href}
      prefetch={true}
      className={`flex items-center justify-between h-10 px-3 py-2 rounded-md text-sm ${
        isActive ? "fixed-sidebar-item-active" : "fixed-sidebar-item"
      }`}
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-3 ${isActive ? "text-[var(--fixed-sidebar-accent)]" : ""}`} />
        <span>{label}</span>
      </div>
      {badge !== undefined && <Badge className="bg-[var(--fixed-primary)] text-white">{badge}</Badge>}
    </Link>
  ),
)
SidebarLink.displayName = "SidebarLink"

const SidebarDropdown = React.memo(
  ({
    title,
    icon: Icon,
    isOpen,
    setIsOpen,
    items,
    activeCheck,
    nested = false,
    pathname,
  }: {
    title: string
    icon: React.ElementType
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    items: { href: string; label: string; icon: React.ElementType }[]
    activeCheck: boolean
    pathname: string | null
    nested?: boolean
  }) => (
    <div className="space-y-1 mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
          activeCheck
            ? "text-[var(--fixed-sidebar-fg)] bg-[var(--fixed-sidebar-active)]"
            : "text-[var(--fixed-sidebar-fg)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)]"
        }`}
      >
        <div className="flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className={`space-y-1 ${nested ? "pl-6" : "pl-2"}`}>
          {items.map(({ href, label, icon: ItemIcon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-[var(--fixed-sidebar-fg)] bg-[var(--fixed-sidebar-active)]"
                    : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)]"
                }`}
              >
                <ItemIcon className="mr-2 h-4 w-4" />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  ),
)
SidebarDropdown.displayName = "SidebarDropdown"

export function AppSidebar() {
  const pathname = usePathname()
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebar()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const unreadNotifications = useSelector(
    (state: RootState) => state.notifications?.notifications.filter((n) => !n.read).length || 0,
  )
  const { translations } = useLanguage()

  const [isProjectToolsOpen, setIsProjectToolsOpen] = useState(pathname?.startsWith("/projects"))
  const [isRequestsOpen, setIsRequestsOpen] = useState(pathname?.includes("/requests"))
  const [isRequestApprovalsOpen, setIsRequestApprovalsOpen] = useState(pathname?.startsWith("/request-approvals"))
  const [isTeamsOpen, setIsTeamsOpen] = useState(pathname?.startsWith("/teams"))
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(pathname?.startsWith("/companies"))

  const setProjectToolsOpen = useCallback((open: boolean) => setIsProjectToolsOpen(open), [])
  const setRequestsOpen = useCallback((open: boolean) => setIsRequestsOpen(open), [])
  const setRequestApprovalsOpen = useCallback((open: boolean) => setIsRequestApprovalsOpen(open), [])
  const setTeamsOpen = useCallback((open: boolean) => setIsTeamsOpen(open), [])
  const setCompaniesOpen = useCallback((open: boolean) => setIsCompaniesOpen(open), [])
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role)
    }
  }, [currentUser])

  const routes: SidebarRoutes = useMemo(
    () => ({
      main: [
        { href: "/dashboard", icon: LayoutDashboard, label: translations.sidebar.dashboard },
        { href: "/weekly-board", icon: Calendar, label: translations.sidebar.weeklyBoard },
        { href: "/notifications", icon: Bell, label: translations.sidebar.notifications, badge: unreadNotifications },
        { href: "/reports", icon: BarChart3, label: translations.sidebar.reports },
        { href: "/users", icon: Users, label: translations.sidebar.users },
      ],
      projectTools: {
        title: "Project Tools",
        icon: Wrench,
        isOpen: isProjectToolsOpen,
        setIsOpen: setProjectToolsOpen,
        activeCheck: pathname?.startsWith("/projects") || pathname?.startsWith("/tasks"),
        items: [
          { href: "/projects", icon: Folder, label: translations.sidebar.projects },
          { href: "/tasks", icon: FileText, label: "Tasks" },
          { href: "/backlog", icon: ListTodo, label: translations.sidebar.backlog },
          { href: "/board", icon: Trello, label: translations.sidebar.kanbanBoard },
          { href: "/sprints", icon: CalendarDays, label: translations.sidebar.sprints },
        ],
      },
      requests: {
        title: translations.requests.title,
        icon: PlusCircle,
        isOpen: isRequestsOpen,
        setIsOpen: setRequestsOpen,
        activeCheck: pathname?.includes("/requests"),
        nested: true,
        items: [
          { href: "/requests/overtime", icon: Clock, label: translations.requests.overtime.title },
          { href: "/requests/leave", icon: Clock, label: translations.requests.leave.title },
          { href: "/requests/spending", icon: DollarSign, label: translations.requests.spending.title },
        ],
      },
      requestApprovals: {
        title: translations.sidebar.requestManagement,
        icon: ClipboardList,
        isOpen: isRequestApprovalsOpen,
        setIsOpen: setRequestApprovalsOpen,
        activeCheck: pathname?.startsWith("/request-approvals"),
        items: [
          {
            href: "/request-approvals/spending",
            icon: DollarSign,
            label: translations.sidebar.spendingRequestManagement,
          },
          { href: "/request-approvals/leave", icon: CalendarCheck, label: translations.sidebar.leaveRequestManagement },
          { href: "/request-approvals/overtime", icon: Clock, label: translations.sidebar.overtimeRequestManagement },
        ],
      },
      teams: {
        title: "Teams",
        icon: Users2,
        isOpen: isTeamsOpen,
        setIsOpen: setTeamsOpen,
        activeCheck: pathname?.startsWith("/teams"),
        items: [
          { href: "/teams/project-teams", icon: FolderKanban, label: "Project Teams" },
          { href: "/teams/company-teams", icon: Building2, label: "Company Teams" },
        ],
      },
      companies: {
        title: translations.companies?.title || "Companies",
        icon: Building2,
        isOpen: isCompaniesOpen,
        setIsOpen: setCompaniesOpen,
        activeCheck: pathname?.startsWith("/companies"),
        items: [{ href: "/companies", icon: Buildings, label: translations.companies?.list || "Companies" }],
      },
    }),
    [
      translations,
      unreadNotifications,
      isProjectToolsOpen,
      isRequestsOpen,
      isRequestApprovalsOpen,
      isTeamsOpen,
      isCompaniesOpen,
      pathname,
      setProjectToolsOpen,
      setRequestsOpen,
      setRequestApprovalsOpen,
      setTeamsOpen,
      setCompaniesOpen,
    ],
  )

  return (
    <>
      {isSidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={toggleSidebar} />}
      <aside
        className={`fixed top-0 bottom-0 z-30 w-64 fixed-sidebar border-r transition-transform md:static ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center fixed-sidebar-header border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={true}>
            <Home className="h-6 w-6 fixed-sidebar-icon" />
            <span className="fixed-sidebar-title text-lg">Task Tracker</span>
          </Link>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto sidebar-scrollbar">
          <div className="flex flex-col gap-2 p-4 flex-1">
            <div className="py-2">
              <h2 className="mb-4 px-2 text-xs font-semibold fixed-sidebar-muted uppercase tracking-wider">
                {translations.sidebar.mainMenu}
              </h2>
              <div className="space-y-1">
                {routes.main.map((route) => (
                  <SidebarLink
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    label={route.label}
                    badge={route.badge}
                    isActive={pathname === route.href}
                  />
                ))}

                {Object.entries(routes)
                  .filter(([key]) => key !== "main")
                  .map(([key, section]) => {
                    const typedSection = section as SidebarDropdownSection
                    return (
                      <SidebarDropdown
                        key={key}
                        title={typedSection.title}
                        icon={typedSection.icon}
                        isOpen={typedSection.isOpen}
                        setIsOpen={typedSection.setIsOpen}
                        items={typedSection.items}
                        activeCheck={typedSection.activeCheck}
                        pathname={pathname}
                        nested={typedSection.nested}
                      />
                    )
                  })}
              </div>
            </div>

            <div className="mt-auto py-2">
              <div className="mb-4 px-2 flex items-center justify-between">
                <span className="text-xs font-semibold fixed-sidebar-muted uppercase tracking-wider">
                  {translations.sidebar.user}
                </span>
                {userRole && (
                  <span className="text-xs py-1 px-2 rounded-full bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
                    {userRole}
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
              <Link
                href="/logout"
                className="flex items-center h-10 px-3 py-2 rounded-md text-sm fixed-sidebar-item"
                prefetch={true}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>{translations.sidebar.logOut}</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export const MemoizedAppSidebar = React.memo(AppSidebar)
