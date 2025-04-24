"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentIssues() {
  const allIssues = useSelector((state: RootState) => state.issues.issues)

  // Sort issues by creation date (newest first) and take the first 5
  const recentIssues = [...allIssues]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card className="col-span-1 fixed-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Issues</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">
            Latest issues across all projects
          </CardDescription>
        </div>
        <Link href="/issues" className="fixed-secondary-button h-9 px-3 py-2 rounded-md text-sm font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentIssues.map((issue) => (
            <div key={issue.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={issue.assignee.avatar} alt={issue.assignee.name} />
                  <AvatarFallback>{issue.assignee.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{issue.title}</p>
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">
                    {issue.projectName} · {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`
                  text-xs py-1 px-2 rounded-full font-medium
                  ${
                    issue.priority === "High"
                      ? "bg-[var(--fixed-danger)] text-white"
                      : issue.priority === "Medium"
                        ? "bg-[var(--fixed-warning)] text-white"
                        : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                  }
                `}
              >
                {issue.priority}
              </span>
            </div>
          ))}

          {recentIssues.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[var(--fixed-sidebar-muted)]">No issues found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
