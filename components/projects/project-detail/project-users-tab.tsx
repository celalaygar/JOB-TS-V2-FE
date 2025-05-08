"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Filter,
  MoreHorizontal,
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  GraduationCap,
  Award,
} from "lucide-react"
import type { Project } from "@/types/project"
import type { User } from "@/types/user"
import { users as allUsers } from "@/data/users"

// Enhanced dummy data for users
const dummyUserData = {
  skills: [
    ["React", "TypeScript", "Next.js", "UI/UX"],
    ["Node.js", "Express", "MongoDB", "API Design"],
    ["Python", "Django", "PostgreSQL", "Data Analysis"],
    ["Java", "Spring Boot", "Microservices", "DevOps"],
    ["AWS", "Docker", "Kubernetes", "CI/CD"],
  ],
  departments: ["Engineering", "Product", "Design", "QA", "DevOps", "Marketing"],
  locations: ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "Remote"],
  education: [
    "B.S. Computer Science, Stanford University",
    "M.S. Software Engineering, MIT",
    "B.A. Design, RISD",
    "Ph.D. Computer Science, UC Berkeley",
    "B.S. Information Systems, Georgia Tech",
  ],
  languages: ["English", "Spanish", "Mandarin", "French", "German", "Japanese"],
  certifications: [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional",
    "Microsoft Certified: Azure Developer",
    "Certified Scrum Master",
    "PMP Certification",
  ],
  joinDates: ["2021-03-15", "2020-06-22", "2022-01-10", "2019-11-05", "2023-02-28"],
  titles: [
    "Senior Software Engineer",
    "Product Designer",
    "Frontend Developer",
    "DevOps Engineer",
    "QA Specialist",
    "Full Stack Developer",
    "UX Researcher",
  ],
  statuses: ["active", "inactive", "pending"],
  workHours: ["Full-time", "Part-time", "Contract"],
  projectRoles: [
    "Team Lead",
    "Developer",
    "Designer",
    "QA Engineer",
    "Product Owner",
    "Scrum Master",
    "DevOps Specialist",
    "Technical Writer",
  ],
}

// Helper function to get random item from array
const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

interface ProjectUsersTabProps {
  project: Project
  onInviteClick: () => void
}

export function ProjectUsersTab({ project, onInviteClick }: ProjectUsersTabProps) {
  // Ensure project.team exists and is an array
  const teamMembers = project.team || []

  // Get project users from the project team with proper error handling and enhanced dummy data
  const projectUsers = teamMembers
    .map((member) => {
      if (!member) return null

      // Try to find the user in allUsers
      const user = allUsers.find((u) => u.id === member.id)

      // Generate random skills (2-4 skills)
      const randomSkills = getRandomItem(dummyUserData.skills)
      const skillCount = Math.floor(Math.random() * 3) + 2 // 2-4 skills
      const skills = randomSkills.slice(0, skillCount)

      // Generate random join date
      const joinDate = getRandomItem(dummyUserData.joinDates)

      // Generate random department
      const department = getRandomItem(dummyUserData.departments)

      // Generate random title
      const title = getRandomItem(dummyUserData.titles)

      // Generate random status
      const status = getRandomItem(dummyUserData.statuses)

      // Generate random work hours
      const workHours = getRandomItem(dummyUserData.workHours)

      // Generate random location
      const location = getRandomItem(dummyUserData.locations)

      // Generate random education
      const education = getRandomItem(dummyUserData.education)

      // Generate random languages (1-3 languages)
      const languageCount = Math.floor(Math.random() * 3) + 1 // 1-3 languages
      const languages = []
      for (let i = 0; i < languageCount; i++) {
        const lang = getRandomItem(dummyUserData.languages)
        if (!languages.includes(lang)) {
          languages.push(lang)
        }
      }

      // Generate random certifications (0-2 certifications)
      const certCount = Math.floor(Math.random() * 3) // 0-2 certifications
      const certifications = []
      for (let i = 0; i < certCount; i++) {
        const cert = getRandomItem(dummyUserData.certifications)
        if (!certifications.includes(cert)) {
          certifications.push(cert)
        }
      }

      // Generate random project role if not provided
      const role = member.role || getRandomItem(dummyUserData.projectRoles)

      // If user exists in allUsers, enhance it with dummy data
      if (user) {
        return {
          ...user,
          role,
          skills: user.skills || skills,
          joinDate: user.joinDate || joinDate,
          department: user.department || department,
          title: user.title || title,
          status: user.status || status,
          workHours: user.workHours || workHours,
          location: user.location || location,
          education: user.education || education,
          languages: user.languages || languages,
          certifications: user.certifications || certifications,
        }
      }

      // If user doesn't exist, create a dummy user
      return {
        id: member.id || `user-${Math.floor(Math.random() * 1000)}`,
        name: member.name || `Team Member ${Math.floor(Math.random() * 100)}`,
        email: member.email || `user${Math.floor(Math.random() * 1000)}@example.com`,
        role,
        initials: member.initials || member.name?.charAt(0) || "?",
        avatar: member.avatar || `/placeholder.svg?height=200&width=200`,
        skills,
        joinDate,
        department,
        title,
        status,
        workHours,
        location,
        education,
        languages,
        certifications,
        phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      }
    })
    .filter(Boolean) as (User & {
    role: string
    skills?: string[]
    workHours?: string
    location?: string
    education?: string
    languages?: string[]
    certifications?: string[]
  })[]

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Filter users based on search and filters
  const filteredUsers = projectUsers.filter((user) => {
    // Ensure user has required properties
    if (!user || !user.name || !user.email) return false

    // Search filter
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.skills?.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false
    }

    // Role filter
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false
    }

    // Department filter
    if (departmentFilter !== "all" && user.department !== departmentFilter) {
      return false
    }

    return true
  })

  // Get unique values for filter dropdowns
  const uniqueRoles = Array.from(new Set(projectUsers.map((user) => user.role)))
  const uniqueDepartments = Array.from(new Set(projectUsers.map((user) => user.department).filter(Boolean)))

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight">Project Users ({projectUsers.length})</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Role</p>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Status</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Department</p>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </div>
          <Button onClick={onInviteClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-primary">
                          {user.initials || user.name.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.title || "Team Member"}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove from Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(user.joinDate || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.role}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.department}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant={
                      user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                    }
                  >
                    {user.status === "active"
                      ? "Active"
                      : user.status === "inactive"
                        ? "Inactive"
                        : user.status === "pending"
                          ? "Pending"
                          : "Unknown"}
                  </Badge>
                  {user.workHours && <Badge variant="outline">{user.workHours}</Badge>}
                  {user.skills?.slice(0, 2).map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills && user.skills.length > 2 && (
                    <Badge variant="outline">+{user.skills.length - 2} more</Badge>
                  )}
                </div>

                {(user.certifications?.length > 0 || user.languages?.length > 0) && (
                  <div className="mt-4 pt-4 border-t">
                    {user.certifications?.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center text-sm mb-1">
                          <Award className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Certifications</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6">{user.certifications.join(", ")}</div>
                      </div>
                    )}

                    {user.languages?.length && user.languages?.length > 0 && (
                      <div>
                        <div className="flex items-center text-sm mb-1">
                          <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Languages</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6">{user.languages.join(", ")}</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {}}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium">User</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Department</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">Skills</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={"bg-white"}>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-primary">
                              {user.initials || user.name.charAt(0) || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{user.role}</div>
                      <div className="text-sm text-muted-foreground">{user.title}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell">{user.department || "—"}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {user.skills?.slice(0, 2).map((skill, i) => (
                          <Badge key={i} variant="outline" className="mr-1">
                            {skill}
                          </Badge>
                        ))}
                        {user.skills && user.skills.length > 2 && (
                          <Badge variant="outline">+{user.skills.length - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        variant={
                          user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "outline"
                        }
                      >
                        {user.status === "active"
                          ? "Active"
                          : user.status === "inactive"
                            ? "Inactive"
                            : user.status === "pending"
                              ? "Pending"
                              : "Unknown"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <UserPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No users found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || roleFilter !== "all" || statusFilter !== "all" || departmentFilter !== "all"
              ? "Try adjusting your search or filters"
              : "This project doesn't have any users yet"}
          </p>
          <Button onClick={onInviteClick}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Users
          </Button>
        </div>
      )}
    </div>
  )
}
