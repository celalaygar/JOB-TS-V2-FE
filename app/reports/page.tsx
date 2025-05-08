"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectIssuesReport from "@/components/reports/project-issues-report"
import SprintIssuesReport from "@/components/reports/sprint-issues-report"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { cn } from "@/lib/utils"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<
    "project-issues" | "sprint-issues" | "user-performance" | "time-tracking" | "custom-reports"
  >("project-issues")
  const currentUser = useSelector((state: RootState) => state.users.currentUser)
  const isAdmin = currentUser?.role === "Admin"

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and analyze project and issue metrics to track progress and identify trends.
        </p>
      </div>

      {/* Custom Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        <button
          onClick={() => setActiveTab("project-issues")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "project-issues" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          Project Issues
        </button>
        <button
          onClick={() => setActiveTab("sprint-issues")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "sprint-issues" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          Sprint Issues
        </button>
        <button
          onClick={() => setActiveTab("user-performance")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "user-performance" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          User Performance
        </button>
        <button
          onClick={() => setActiveTab("time-tracking")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            activeTab === "time-tracking" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          Time Tracking
        </button>
        <button
          onClick={() => setActiveTab("custom-reports")}
          disabled={!isAdmin}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !isAdmin && "opacity-50 cursor-not-allowed",
            activeTab === "custom-reports" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
          )}
        >
          Custom Reports
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "project-issues" && <ProjectIssuesReport />}

        {activeTab === "sprint-issues" && <SprintIssuesReport />}

        {activeTab === "user-performance" && (
          <Card>
            <CardHeader>
              <CardTitle>User Performance Reports</CardTitle>
              <CardDescription>
                Analyze user productivity, issue resolution rates, and contribution metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">User Performance reports coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "time-tracking" && (
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking Reports</CardTitle>
              <CardDescription>Analyze time spent on issues, projects, and by team members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Time Tracking reports coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "custom-reports" && (
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>
                Create and save custom reports with your preferred metrics and visualizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Custom reports coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
