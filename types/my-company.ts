export interface MyCompanyLocation {
  country: string
  city: string
  district: string
  fullAddress: string
}

export interface MyCompanyEmployee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive"
  joinedDate: string
  position: string
  skills: string[]
  projects: string[]
}

export interface MyCompanyTeam {
  id: string
  name: string
  description: string
  lead: string
  createdAt: string
  membersCount: number
  members: MyCompanyEmployee[]
}

export interface MyCompany {
  id: string
  name: string
  industry: string
  description: string
  website: string
  email: string
  phone: string
  foundedYear: number
  employeeCount: number
  location: MyCompanyLocation
  employees: MyCompanyEmployee[]
  teams: MyCompanyTeam[]
  createdAt: string
  updatedAt: string
}
