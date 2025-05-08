"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

// Public routes that don't require authentication
const publicRoutes = ["/", "/register", "/forgot-password"]

// Special routes like 404
const specialRoutes = ["/not-found"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for special routes
    if (specialRoutes.includes(pathname)) {
      setIsLoading(false)
      return
    }

    // Skip auth check for public routes
    if (publicRoutes.includes(pathname)) {
      setIsLoading(false)
      return
    }

    // If not authenticated and not on a public route, redirect to login
    if (!isAuthenticated) {
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, pathname, router])

  // Show nothing while checking authentication
  if (isLoading) {
    return null
  }

  return <>{children}</>
}
