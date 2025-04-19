"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectIssuesReport from "@/components/reports/project-issues-report"
import SprintIssuesReport from "@/components/reports/sprint-issues-report"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("project-issues")
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

      <Tabs defaultValue="project-issues" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="project-issues">Project Issues</TabsTrigger>
          <TabsTrigger value="sprint-issues">Sprint Issues</TabsTrigger>
          <TabsTrigger value="user-performance">User Performance</TabsTrigger>
          <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="custom-reports" disabled={!isAdmin}>
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="project-issues" className="space-y-4">
          <ProjectIssuesReport />
        </TabsContent>

        <TabsContent value="sprint-issues" className="space-y-4">
          <SprintIssuesReport />
        </TabsContent>

        <TabsContent value="user-performance" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="time-tracking" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="custom-reports" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
