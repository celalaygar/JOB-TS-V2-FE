import type { Project } from "@/types/project"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, UsersIcon, ListChecksIcon, ClockIcon } from "lucide-react"

interface ProjectOverviewProps {
  project: Project
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  project.status === "active"
                    ? "bg-green-500"
                    : project.status === "completed"
                      ? "bg-blue-500"
                      : project.status === "on-hold"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                }`}
              ></div>
              <span className="text-2xl font-bold capitalize">{project.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <UsersIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-2xl font-bold">12</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <ListChecksIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-2xl font-bold">24</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-2xl font-bold">75%</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
              <p className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                {new Date(project.startDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
              <p className="flex items-center mt-1">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Project Manager</h4>
              <p className="mt-1">{project.manager || "Not assigned"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{project.description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
