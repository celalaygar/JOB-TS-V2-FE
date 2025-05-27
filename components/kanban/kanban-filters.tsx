"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { projects } from "@/data/projects"
import { users } from "@/data/users"
import { FilterIcon, SearchIcon, XIcon } from "lucide-react"
import { useState } from "react"

export default function KanbanFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const taskTypes = ["bug", "feature", "story", "subtask"]

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedProjects([])
    setSelectedUsers([])
    setSelectedTypes([])
  }

  return (
    <div className="p-4 border-b">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <FilterIcon className="h-4 w-4 mr-2" />
                Projects {selectedProjects.length > 0 && `(${selectedProjects.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuCheckboxItem
                  key={project.id}
                  checked={selectedProjects.includes(project.id)}
                  onCheckedChange={() => toggleProject(project.id)}
                >
                  {project.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <FilterIcon className="h-4 w-4 mr-2" />
                Assignees {selectedUsers.length > 0 && `(${selectedUsers.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {users.map((user) => (
                <DropdownMenuCheckboxItem
                  key={user.id}
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUser(user.id)}
                >
                  {user.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <FilterIcon className="h-4 w-4 mr-2" />
                Types {selectedTypes.length > 0 && `(${selectedTypes.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {taskTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(searchTerm || selectedProjects.length > 0 || selectedUsers.length > 0 || selectedTypes.length > 0) && (
            <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
              <XIcon className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedProjects.map((projectId) => {
          const project = projects.find((p) => p.id === projectId)
          return (
            project && (
              <Badge key={projectId} variant="outline" className="flex items-center gap-1">
                {project.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleProject(projectId)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )
          )
        })}

        {selectedUsers.map((userId) => {
          const user = users.find((u) => u.id === userId)
          return (
            user && (
              <Badge key={userId} variant="outline" className="flex items-center gap-1">
                {user.name}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => toggleUser(userId)}>
                  <XIcon className="h-3 w-3" />
                </Button>
              </Badge>
            )
          )
        })}

        {selectedTypes.map((type) => (
          <Badge key={type} variant="outline" className="flex items-center gap-1">
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => toggleType(type)}>
              <XIcon className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
