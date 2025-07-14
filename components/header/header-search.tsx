"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface HeaderSearchProps {
  className?: string
}

export function HeaderSearch({ className }: HeaderSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className={className}>
      <form>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-[var(--fixed-background)] pl-8 md:w-[200px] lg:w-[300px] border-[var(--fixed-card-border)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  )
}
