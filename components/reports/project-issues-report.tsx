"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import ReportFilters from "./report-filters"
import IssueStatusChart from "./charts/issue-status-chart"
import IssueTypeChart from "./charts/issue-type-chart"
import IssuesCreatedVsResolvedChart from "./charts/issues-created-vs-resolved-chart"
import TopAssigneesChart from "./charts/top-assignees-chart"
import IssuesTable from "./issues-table"

export default function ProjectIssuesReport() {
  // State for filters
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])

  // Get data from Redux store
  const allIssues = useSelector((state: RootState) => state.issues.issues)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  // Filtered issues based on selected filters
  const [filteredIssues, setFilteredIssues] = useState(allIssues)
  const [isLoading, setIsLoading] = useState(false)

  // Apply filters
  useEffect(() => {
    setIsLoading(true)

    let filtered = [...allIssues]

    // Filter by project
    if (selectedProject !== "all") {
      filtered = filtered.filter((issue) => issue.projectId === selectedProject)
    }

    // Filter by date range
    if (dateRange.from) {
      filtered = filtered.filter((issue) => new Date(issue.createdAt) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((issue) => new Date(issue.createdAt) <= dateRange.to!)
    }

    // Filter by issue type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((issue) => selectedTypes.includes(issue.type))
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((issue) => selectedStatuses.includes(issue.status))
    }

    // Filter by assignee
    if (selectedAssignees.length > 0) {
      filtered = filtered.filter((issue) => selectedAssignees.includes(issue.assigneeId))
    }

    // Filter by priority
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((issue) => selectedPriorities.includes(issue.priority))
    }

    setFilteredIssues(filtered)
    setIsLoading(false)
  }, [allIssues, selectedProject, dateRange, selectedTypes, selectedStatuses, selectedAssignees, selectedPriorities])

  // Calculate report data
  const totalIssueCount = filteredIssues.length

  // Reset all filters
  const resetFilters = () => {
    setSelectedProject("all")
    setDateRange({ from: undefined, to: undefined })
    setSelectedTypes([])
    setSelectedStatuses([])
    setSelectedAssignees([])
    setSelectedPriorities([])
  }

  // Export report as CSV
  const exportReport = () => {
    // Implementation would go here
    console.log("Exporting report...")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Project Issues Report</CardTitle>
              <CardDescription>Analyze and visualize issue data across projects and time periods.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ReportFilters
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedAssignees={selectedAssignees}
            setSelectedAssignees={setSelectedAssignees}
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={setSelectedPriorities}
            users={users}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Issue Summary</CardTitle>
            <CardDescription>Key metrics for the selected filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Total Issues</span>
                <span className="text-3xl font-bold">{totalIssueCount}</span>
              </div>
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Open Issues</span>
                <span className="text-3xl font-bold">
                  {filteredIssues.filter((i) => i.status !== "Done" && i.status !== "Closed").length}
                </span>
              </div>
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Completed Issues</span>
                <span className="text-3xl font-bold">
                  {filteredIssues.filter((i) => i.status === "Done" || i.status === "Closed").length}
                </span>
              </div>
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">High Priority</span>
                <span className="text-3xl font-bold">{filteredIssues.filter((i) => i.priority === "High").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
            <CardDescription>Distribution of issues across statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <IssueStatusChart issues={filteredIssues} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Type</CardTitle>
            <CardDescription>Distribution of issues by type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <IssueTypeChart issues={filteredIssues} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Assignees</CardTitle>
            <CardDescription>Users with the most assigned issues</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <TopAssigneesChart issues={filteredIssues} users={users} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues Created vs Resolved</CardTitle>
          <CardDescription>Trend of issue creation and resolution over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <IssuesCreatedVsResolvedChart issues={filteredIssues} dateRange={dateRange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issues List</CardTitle>
          <CardDescription>Detailed list of issues matching the selected filters</CardDescription>
        </CardHeader>
        <CardContent>
          <IssuesTable issues={filteredIssues} users={users} projects={projects} />
        </CardContent>
      </Card>
    </div>
  )
}
