"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { Badge } from "@/components/ui/badge"

const issueTypes = ["Bug", "Feature", "Task", "Story", "Improvement", "Epic"]
const issueStatuses = ["To Do", "In Progress", "In Review", "Done", "Blocked", "Backlog"]
const issuePriorities = ["Low", "Medium", "High", "Critical"]

export default function ReportFilters({
  projects,
  selectedProject,
  setSelectedProject,
  dateRange,
  setDateRange,
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  selectedAssignees,
  setSelectedAssignees,
  selectedPriorities,
  setSelectedPriorities,
  users,
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Project Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project</label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange(range)
                  if (range.to) {
                    setIsCalendarOpen(false)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Issue Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Issue Type</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {selectedTypes.length === 0
                    ? "All Types"
                    : selectedTypes.length === 1
                      ? selectedTypes[0]
                      : `${selectedTypes.length} types selected`}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Issue Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {issueTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTypes([...selectedTypes, type])
                    } else {
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                    }
                  }}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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

        {/* Priority Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">
                  {selectedPriorities.length === 0
                    ? "All Priorities"
                    : selectedPriorities.length === 1
                      ? selectedPriorities[0]
                      : `${selectedPriorities.length} priorities selected`}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Issue Priorities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {issuePriorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={selectedPriorities.includes(priority)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPriorities([...selectedPriorities, priority])
                    } else {
                      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))
                    }
                  }}
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedTypes.length > 0 ||
        selectedStatuses.length > 0 ||
        selectedAssignees.length > 0 ||
        selectedPriorities.length > 0 ||
        dateRange.from) && (
        <div className="pt-4">
          <div className="flex flex-wrap gap-2">
            {selectedProject !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Project: {projects.find((p) => p.id === selectedProject)?.name}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedProject("all")}
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

            {dateRange.from && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date: {format(dateRange.from, "MMM d")} {dateRange.to && `- ${format(dateRange.to, "MMM d")}`}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
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

            {selectedTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                Type: {type}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
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

            {selectedPriorities.map((priority) => (
              <Badge key={priority} variant="secondary" className="flex items-center gap-1">
                Priority: {priority}
                <button
                  className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))}
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
          </div>
        </div>
      )}
    </div>
  )
}
