import type { Metadata } from "next"
import CompanyTeamsPage from "./CompanyTeamsPage"

export const metadata: Metadata = {
  title: "Company Teams | Issue Tracker",
  description: "View and manage teams for all companies",
}

export default function Page() {
  return <CompanyTeamsPage />
}
