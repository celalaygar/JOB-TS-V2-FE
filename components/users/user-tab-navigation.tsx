"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserTabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userCounts: {
    admin: number
    developer: number
    tester: number
    productOwner: number
  }
}

export function UserTabNavigation({ activeTab, setActiveTab, userCounts }: UserTabNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const tabs = [
    { id: "all", label: "All Users", count: null },
    { id: "admin", label: "Admins", count: userCounts.admin },
    { id: "developer", label: "Developers", count: userCounts.developer },
    { id: "tester", label: "Testers", count: userCounts.tester },
    { id: "product owner", label: "Product Owners", count: userCounts.productOwner },
  ]

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // Standard md breakpoint
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    window.addEventListener("resize", checkScrollButtons)
    return () => window.removeEventListener("resize", checkScrollButtons)
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const scrollToActiveTab = () => {
    if (scrollContainerRef.current) {
      const activeTabElement = scrollContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
      if (activeTabElement) {
        const containerRect = scrollContainerRef.current.getBoundingClientRect()
        const tabRect = activeTabElement.getBoundingClientRect()

        // Calculate if the active tab is outside the visible area
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          activeTabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
      }
    }
  }

  useEffect(() => {
    scrollToActiveTab()
  }, [activeTab])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScrollButtons)
      return () => {
        scrollContainerRef.current?.removeEventListener("scroll", checkScrollButtons)
      }
    }
  }, [])

  return (
    <div className="relative flex items-center border-b border-[var(--fixed-card-border)]">
      {showLeftScroll && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 z-10 h-full rounded-none border-r border-[var(--fixed-card-border)] bg-background/80 backdrop-blur-sm"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex w-full overflow-x-auto scrollbar-hide"
        onScroll={checkScrollButtons}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab={tab.id}
            className={`flex-shrink-0 px-4 py-2 text-center cursor-pointer whitespace-nowrap transition-colors
              ${isMobile ? "text-sm" : "text-base"}
              ${
                activeTab === tab.id
                  ? "bg-[var(--fixed-secondary)] text-[var(--fixed-sidebar-fg)] font-medium border-b-2 border-[var(--fixed-primary)]"
                  : "text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)] hover:bg-[var(--fixed-secondary-hover)]"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </div>
        ))}
      </div>

      {showRightScroll && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-10 h-full rounded-none border-l border-[var(--fixed-card-border)] bg-background/80 backdrop-blur-sm"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </div>
  )
}
