import type { Metadata } from "next"
import TeamDetailPage from "./TeamDetailPage"

export const metadata: Metadata = {
  title: "Team Details | Issue Tracker",
  description: "View and manage team members",
}

export default function Page({ params }: { params: { projectId: string; teamId: string } }) {
  return <TeamDetailPage projectId={params.projectId} teamId={params.teamId} />
}
