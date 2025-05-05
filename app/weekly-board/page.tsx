"use client"

import { useState } from "react"
import { WeeklyBoardHeader } from "@/components/weekly-board/weekly-board-header"
import { WeeklyBoardFilters } from "@/components/weekly-board/weekly-board-filters"
import { WeeklyBoard } from "@/components/weekly-board/weekly-board"
import { AddHourlyIssueDialog } from "@/components/weekly-board/add-hourly-issue-dialog"

export default function WeeklyBoardPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    project: "all",
    user: "all",
    completed: "all",
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddIssue = (day?: string, hour?: number) => {
    setSelectedDay(day || null)
    setSelectedHour(hour || null)
    setIsAddDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <WeeklyBoardHeader
        onAddIssue={() => handleAddIssue()}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && <WeeklyBoardFilters filters={filters} onFilterChange={handleFilterChange} />}

      <WeeklyBoard filters={filters} onAddIssue={handleAddIssue} />

      <AddHourlyIssueDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        selectedDay={selectedDay}
        selectedHour={selectedHour}
      />
    </div>
  )
}
