"use client"

import { useState } from "react"
import { IssuesHeader } from "@/components/issues/issues-header"
import { IssuesTable } from "@/components/issues/issues-table"
import { IssuesBoard } from "@/components/issues/issues-board"
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Issues() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "board">("table")
  const [filters, setFilters] = useState({
    search: "",
    project: "all",
    status: "all",
    priority: "all",
    assignee: "all",
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <IssuesHeader
        onCreateIssue={() => setIsCreateDialogOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Tabs defaultValue="table" value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "board")}>
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-0">
          <IssuesTable filters={filters} />
        </TabsContent>

        <TabsContent value="board" className="mt-0">
          <IssuesBoard />
        </TabsContent>
      </Tabs>

      <CreateIssueDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
