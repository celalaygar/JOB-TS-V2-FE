"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectProgress() {
  const allProjects = useSelector((state: RootState) => state.projects.projects)

  // Sort projects by progress (highest first) and take the first 5
  const topProjects = [...allProjects].sort((a, b) => b.progress - a.progress).slice(0, 5)

  return (
    <Card className="col-span-1 fixed-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription className="text-[var(--fixed-sidebar-muted)]">Track your active projects</CardDescription>
        </div>
        <Link href="/projects" className="fixed-secondary-button h-9 px-3 py-2 rounded-md text-sm font-medium">
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProjects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Link href={`/projects/${project.id}`} className="text-sm font-medium leading-none hover:underline">
                  {project.name}
                </Link>
                <div className="flex items-center">
                  <span className="text-sm text-[var(--fixed-sidebar-muted)] mr-2">{project.progress}%</span>
                  <span
                    className={`
                      text-xs py-0.5 px-1.5 rounded-full
                      ${
                        project.status === "Completed"
                          ? "bg-[var(--fixed-success)] text-white"
                          : project.status === "In Progress"
                            ? "bg-[var(--fixed-primary)] text-white"
                            : "bg-[var(--fixed-secondary)] text-[var(--fixed-secondary-fg)]"
                      }
                    `}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--fixed-secondary)]">
                <div
                  className="h-full rounded-full bg-[var(--fixed-primary)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--fixed-sidebar-muted)]">
                <span>{project.issueCount} issues</span>
                <span>{project.team.length} team members</span>
              </div>
            </div>
          ))}

          {topProjects.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[var(--fixed-sidebar-muted)]">No projects found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
