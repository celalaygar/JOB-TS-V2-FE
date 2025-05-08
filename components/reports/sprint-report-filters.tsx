"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const issueStatuses = ["To Do", "In Progress", "In Review", "Done", "Blocked", "Backlog"]

export default function SprintReportFilters({
  projects,
  selectedProject,
  setSelectedProject,
  sprints,
  selectedSprint,
  setSelectedSprint,
  selectedStatuses,
  setSelectedStatuses,
  selectedAssignees,
  setSelectedAssignees,
  users,
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Project Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sprint Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sprint</label>
          <Select
            value={selectedSprint}
            onValueChange={setSelectedSprint}
            disabled={!selectedProject || sprints.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name} {sprint.status === "active" ? "(Active)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Issue Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {selectedStatuses.length === 0
                    ? "All Statuses"
                    : selectedStatuses.length === 1
                      ? selectedStatuses[0]
                      : `${selectedStatuses.length} statuses selected`}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Issue Statuses</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {issueStatuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatuses([...selectedStatuses, status])
                    } else {
                      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Assignee Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assignee</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {selectedAssignees.length === 0
                    ? "All Assignees"
                    : selectedAssignees.length === 1
                      ? users.find((u) => u.id === selectedAssignees[0])?.name || "Unknown"
                      : `${selectedAssignees.length} assignees selected`}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search assignee..." />
                <CommandList>
                  <CommandEmpty>No assignee found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          if (selectedAssignees.includes(user.id)) {
                            setSelectedAssignees(selectedAssignees.filter((id) => id !== user.id))
                          } else {
                            setSelectedAssignees([...selectedAssignees, user.id])
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              selectedAssignees.includes(user.id) ? "bg-primary text-primary-foreground" : "opacity-50",
                            )}
                          >
                            {selectedAssignees.includes(user.id) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedStatuses.length > 0 || selectedAssignees.length > 0) && (
        <div className="pt-4">
          <div className="flex flex-wrap gap-2">
            {selectedProject && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Project: {projects.find((p) => p.id === selectedProject)?.name}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedProject("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </Badge>
            )}

            {selectedSprint && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sprint: {sprints.find((s) => s.id === selectedSprint)?.name}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedSprint("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </Badge>
            )}

            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                Status: {status}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedStatuses(selectedStatuses.filter((s) => s !== status))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </Badge>
            ))}

            {selectedAssignees.map((assigneeId) => {
              const assignee = users.find((u) => u.id === assigneeId)
              return (
                <Badge key={assigneeId} variant="secondary" className="flex items-center gap-1">
                  Assignee: {assignee?.name || "Unknown"}
                  <button
                    className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setSelectedAssignees(selectedAssignees.filter((id) => id !== assigneeId))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
