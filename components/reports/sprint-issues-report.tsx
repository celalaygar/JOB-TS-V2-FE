"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import SprintReportFilters from "./sprint-report-filters"
import SprintStatusChart from "./charts/sprint-status-chart"
import SprintBurndownChart from "./charts/sprint-burndown-chart"
import SprintIssuesTable from "./sprint-issues-table"
import { differenceInBusinessDays, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function SprintIssuesReport() {
  // State for filters
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [selectedSprint, setSelectedSprint] = useState<string>("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])

  // Get data from Redux store
  const allIssues = useSelector((state: RootState) => state.issues.issues)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const sprints = useSelector((state: RootState) => state.sprints.sprints)
  const users = useSelector((state: RootState) => state.users.users)

  // Filtered sprints based on selected project
  const [filteredSprints, setFilteredSprints] = useState(sprints)

  // Filtered issues based on selected filters
  const [filteredIssues, setFilteredIssues] = useState(allIssues)
  const [isLoading, setIsLoading] = useState(false)

  // Current sprint data
  const [currentSprint, setCurrentSprint] = useState<any>(null)

  // Update filtered sprints when project changes
  useEffect(() => {
    if (selectedProject) {
      const projectSprints = sprints.filter(
        (sprint) =>
          // In a real app, sprints would have a projectId field
          // For this example, we'll assume all sprints belong to all projects
          true,
      )
      setFilteredSprints(projectSprints)

      // Reset selected sprint if it doesn't belong to the selected project
      if (selectedSprint && !projectSprints.some((s) => s.id === selectedSprint)) {
        setSelectedSprint("")
      }
    } else {
      setFilteredSprints([])
      setSelectedSprint("")
    }
  }, [selectedProject, sprints])

  // Update current sprint when selected sprint changes
  useEffect(() => {
    if (selectedSprint) {
      const sprint = sprints.find((s) => s.id === selectedSprint)
      setCurrentSprint(sprint || null)
    } else {
      setCurrentSprint(null)
    }
  }, [selectedSprint, sprints])

  // Apply filters
  useEffect(() => {
    setIsLoading(true)

    let filtered = [...allIssues]

    // Filter by project
    if (selectedProject) {
      filtered = filtered.filter((issue) => issue.projectId === selectedProject)
    }

    // Filter by sprint
    if (selectedSprint) {
      // In a real app, issues would have a sprintId field
      // For this example, we'll use a random subset of issues for the sprint
      const sprintIssueIds = new Set(filtered.slice(0, Math.floor(Math.random() * 20) + 10).map((issue) => issue.id))
      filtered = filtered.filter((issue) => sprintIssueIds.has(issue.id))
    } else {
      filtered = []
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((issue) => selectedStatuses.includes(issue.status))
    }

    // Filter by assignee
    if (selectedAssignees.length > 0) {
      filtered = filtered.filter((issue) => selectedAssignees.includes(issue.assigneeId))
    }

    setFilteredIssues(filtered)
    setIsLoading(false)
  }, [allIssues, selectedProject, selectedSprint, selectedStatuses, selectedAssignees])

  // Calculate report data
  const totalIssueCount = filteredIssues.length
  const completedIssues = filteredIssues.filter((i) => i.status === "Done" || i.status === "Closed").length
  const sprintProgress = totalIssueCount > 0 ? Math.round((completedIssues / totalIssueCount) * 100) : 0
  const blockedIssues = filteredIssues.filter((i) => i.status === "Blocked").length

  // Calculate average resolution time (in days)
  const avgResolutionTime = (() => {
    const completedIssuesWithDates = filteredIssues.filter(
      (i) => (i.status === "Done" || i.status === "Closed") && i.createdAt && i.updatedAt,
    )

    if (completedIssuesWithDates.length === 0) return 0

    const totalDays = completedIssuesWithDates.reduce((sum, issue) => {
      const createdDate = parseISO(issue.createdAt)
      const completedDate = parseISO(issue.updatedAt)
      return sum + differenceInBusinessDays(completedDate, createdDate)
    }, 0)

    return Math.round((totalDays / completedIssuesWithDates.length) * 10) / 10
  })()

  // Calculate velocity (story points completed)
  // In a real app, issues would have story points
  // For this example, we'll use a random value between 1-5 for each completed issue
  const velocity = completedIssues * (Math.floor(Math.random() * 3) + 2)

  // Reset all filters
  const resetFilters = () => {
    setSelectedProject("")
    setSelectedSprint("")
    setSelectedStatuses([])
    setSelectedAssignees([])
  }

  // Export report as CSV
  const exportReport = () => {
    // Implementation would go here
    console.log("Exporting sprint report...")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Sprint Issues Report</CardTitle>
              <CardDescription>Analyze sprint performance, progress, and issue distribution.</CardDescription>
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
          <SprintReportFilters
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            sprints={filteredSprints}
            selectedSprint={selectedSprint}
            setSelectedSprint={setSelectedSprint}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedAssignees={selectedAssignees}
            setSelectedAssignees={setSelectedAssignees}
            users={users}
          />
        </CardContent>
      </Card>

      {selectedSprint ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIssueCount}</div>
                <p className="text-xs text-muted-foreground">issues in this sprint</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{sprintProgress}%</div>
                  <div className="ml-auto h-4 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${sprintProgress}%` }} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedIssues} of {totalIssueCount} issues completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgResolutionTime} days</div>
                <p className="text-xs text-muted-foreground">per completed issue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sprint Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{velocity} points</div>
                <p className="text-xs text-muted-foreground">story points completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Issue Status Breakdown</CardTitle>
                <CardDescription>Distribution of issues by status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SprintStatusChart issues={filteredIssues} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Burndown Chart</CardTitle>
                <CardDescription>Ideal vs actual progress</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <SprintBurndownChart
                  sprint={currentSprint}
                  issues={filteredIssues}
                  totalIssues={totalIssueCount}
                  completedIssues={completedIssues}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle>Sprint Issues</CardTitle>
                  <CardDescription>List of issues in the current sprint</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-red-100">
                    {blockedIssues} Blocked
                  </Badge>
                  <Badge variant="outline" className="bg-green-100">
                    {completedIssues} Completed
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-100">
                    {totalIssueCount - completedIssues - blockedIssues} In Progress
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SprintIssuesTable issues={filteredIssues} users={users} sprint={currentSprint} />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-muted-foreground"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">No Sprint Selected</h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
              Please select a project and sprint to view the sprint report.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
