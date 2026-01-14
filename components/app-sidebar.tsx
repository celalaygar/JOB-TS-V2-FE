"use client"

import React, { useState, useEffect, memo, use, useCallback } from "react"
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
import { InvitationStatus } from "@/types/invitation"
import { getAllInvitationsCountByInvitationStatusHelper } from "@/lib/service/api-helpers"


function AppSidebar() {
  const authUser = useAuthUser();
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const { translations } = useLanguage()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false)
  const [invitationCount, setInvitationCount] = useState<number>(0)

  const getAllInvitationsCount = useCallback(async () => {
    const response: number | null = await getAllInvitationsCountByInvitationStatusHelper(InvitationStatus.PENDING, {
      setLoading: setNotificationLoading
    })
    if (typeof response === "number") {
      setInvitationCount((prevCount) => prevCount + response)
    }
  }, [])

  useEffect(() => {
    getAllInvitationsCount()
  }, [getAllInvitationsCount])

  useEffect(() => {
    if (currentUser?.role) {
      setUserRole(currentUser.role)
    }
  }, [currentUser])

  // Düz liste halindeki menü öğeleri
  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: translations.sidebar.dashboard },
    { href: "/notifications", icon: Bell, label: translations.sidebar.notifications, badge: invitationCount > 0 ? invitationCount : undefined },
    { href: "/projects", icon: Folder, label: translations.sidebar.projects },
    { href: "/tasks", icon: FileText, label: translations.sidebar.tasks },
    { href: "/backlog", icon: ListTodo, label: translations.sidebar.backlog },
    { href: "/kanban", icon: Trello, label: translations.sidebar.kanbanBoard },
    { href: "/project-sprints", icon: CalendarDays, label: translations.sidebar.projectSprints },
    { href: "/teams/project-teams", icon: FolderKanban, label: translations.sidebar.projectTeams },
  ]

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
            {/* Menü öğelerini doğrudan listele */}
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-1",
                    isActive
                      ? "bg-[var(--fixed-sidebar-active)] text-[var(--fixed-sidebar-active-fg)]"
                      : "text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)]",
                  )}
                >
                  {React.createElement(item.icon, { className: "h-4 w-4" })}
                  <span>{item.label}</span>
                  {item.href === "/notifications" && invitationCount > 0 && (
                    <Badge className="bg-[var(--fixed-primary)] text-white ml-auto">
                      {invitationCount}
                    </Badge>
                  )}
                </Link>
              )
            })}

            {/* Profile ve Logout */}
            <div className="mt-auto py-2 border-t pt-4">
              <div className="mb-4 px-2 flex items-center justify-between">
                <span className="text-xs font-semibold fixed-sidebar-muted uppercase tracking-wider">
                  {translations.sidebar.user || "User"}
                </span>
                {authUser?.user?.email && (
                  <span className="text-xs py-1 px-2 rounded-full bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]">
                    {authUser.user.email}
                  </span>
                )}
              </div>
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded-md text-sm text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-sidebar-hover)] mb-1"
                prefetch={true}
              >
                <Users className="mr-2 h-5 w-5" />
                <span>{translations.sidebar.profile || "Profile"}</span>
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