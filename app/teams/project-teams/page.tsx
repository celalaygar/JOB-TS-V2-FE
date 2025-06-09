import type { Metadata } from "next"
import ProjectTeamsPage from "./ProjectTeamsPage"

export const metadata: Metadata = {
  title: "Project Teams | Issue Tracker",
  description: "View and manage teams for all projects",
}

export default function Page() {
  return <ProjectTeamsPage />
}
