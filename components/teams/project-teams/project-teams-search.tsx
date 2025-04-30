"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProjectTeamsSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProjectTeamsSearch({ searchQuery, onSearchChange }: ProjectTeamsSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search teams..."
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
