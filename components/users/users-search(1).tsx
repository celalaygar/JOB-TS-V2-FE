"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, PlusCircle, Filter, X } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

interface UsersSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreateUser: () => void
  showFilters: boolean
  onToggleFilters: () => void
}

export function UsersSearch({
  searchQuery,
  onSearchChange,
  onCreateUser,
  showFilters,
  onToggleFilters,
}: UsersSearchProps) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (searchInputRef.current) {
      onSearchChange(searchInputRef.current.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    onSearchChange("")
    if (isMobileSearchOpen) {
      setIsMobileSearchOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full mb-4">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search users..."
              className="pl-9 pr-8 border-[var(--fixed-card-border)]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} variant="outline" className="border-[var(--fixed-card-border)]">
            Search
          </Button>
          <Button onClick={onToggleFilters} variant="outline" className="border-[var(--fixed-card-border)]">
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <Button onClick={onCreateUser} className="bg-[var(--fixed-primary)] text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden items-center justify-between gap-2 w-full">
        {isMobileSearchOpen ? (
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search users..."
                className="pl-9 pr-8 border-[var(--fixed-card-border)]"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 text-[var(--fixed-sidebar-muted)] hover:text-[var(--fixed-sidebar-fg)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => setIsMobileSearchOpen(false)}
              variant="outline"
              size="sm"
              className="border-[var(--fixed-card-border)]"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsMobileSearchOpen(true)}
                variant="outline"
                size="icon"
                className="border-[var(--fixed-card-border)]"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                onClick={onToggleFilters}
                variant="outline"
                size="icon"
                className="border-[var(--fixed-card-border)]"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={onCreateUser} size="sm" className="bg-[var(--fixed-primary)] text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
