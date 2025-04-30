import type { Metadata } from "next"
import CompanyTeamDetailPage from "./CompanyTeamDetailPage"

export const metadata: Metadata = {
  title: "Company Team Details | Issue Tracker",
  description: "View and manage company team details",
}

export default function Page({ params }: { params: { companyId: string; teamId: string } }) {
  return <CompanyTeamDetailPage companyId={params.companyId} teamId={params.teamId} />
}
