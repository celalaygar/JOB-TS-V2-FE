"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { MemoizedAppSidebar as AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

// Auth routes that should not show sidebar and header
const authRoutes = ["/", "/register"]

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  console.log("pathname : " + pathname)
  // Check if the current route is an auth route
  const isAuthRoute =
    authRoutes.includes(pathname) ||
    /^\/register\/invite\/[^/]+$/.test(pathname) ||
    /^\/public\/change-mail\/token\/[^/]+$/.test(pathname) ||
    /^\/public\/password-reset\/token\/[^/]+$/.test(pathname)

  if (isAuthRoute) {
    // For auth routes, render only the content without sidebar and header
    return <>{children}</>
  }

  // For all other routes, render the full layout
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--fixed-background)] text-[var(--fixed-foreground)]">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
