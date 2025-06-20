"use client";

import type React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { updateSprint } from "@/lib/redux/features/sprints-slice";
import type { RootState } from "@/lib/redux/store";
import { teams } from "@/data/teams"; // Import teams directly from the data file

interface EditSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprintId: string;
}

interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export function EditSprintDialog({ open, onOpenChange, sprintId }: EditSprintDialogProps) {
  const dispatch = useDispatch();
  const sprint = useSelector((state: RootState) => state.sprints.sprints.find((s) => s.id === sprintId));
  const projects = useSelector((state: RootState) => state.projects.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<"planning" | "active" | "completed" | "cancelled">("planning");
  const [completionStatus, setCompletionStatus] = useState<"done" | "review" | "in-progress" | "backlog">("done");
  const [sprintType, setSprintType] = useState<"standard" | "project-team">("standard");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const projectTeams = teams.filter((team) => team.projectId === selectedProjectId);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [selectedProjectDisplay, setSelectedProjectDisplay] = useState("");
  const [isSprintTypeOpen, setIsSprintTypeOpen] = useState(false);
  const [selectedSprintTypeDisplay, setSelectedSprintTypeDisplay] = useState("");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatusDisplay, setSelectedStatusDisplay] = useState("");
  const [isCompletionStatusOpen, setIsCompletionStatusOpen] = useState(false);
  const [selectedCompletionStatusDisplay, setSelectedCompletionStatusDisplay] = useState("");
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [selectedTeamDisplay, setSelectedTeamDisplay] = useState("");

  useEffect(() => {
    if (sprint) {
      setName(sprint.name);
      setDescription(sprint.description || "");
      setSelectedProjectId(sprint.projectId);
      setSelectedProjectDisplay(projects.find(p => p.id === sprint.projectId)?.name || "Select a project");
      setStartDate(sprint.startDate ? new Date(sprint.startDate) : undefined);
      setEndDate(sprint.endDate ? new Date(sprint.endDate) : undefined);
      setStatus(sprint.status as "planning" | "active" | "completed" | "cancelled");
      setSelectedStatusDisplay(
        ({
          planning: "Planning",
          active: "Active",
          completed: "Completed",
          cancelled: "Cancelled",
        })[sprint.status] || "Select status"
      );
      setCompletionStatus(sprint.completionStatus as "done" | "review" | "in-progress" | "backlog" || "done");
      setSelectedCompletionStatusDisplay(
        ({
          done: "Done",
          review: "Review",
          "in-progress": "In Progress",
          backlog: "Move to Backlog",
        })[sprint.completionStatus || "done"] || "Select status for tasks"
      );
      setSprintType(sprint.sprintType as "standard" | "project-team" || "standard");
      setSelectedSprintTypeDisplay(
        ({
          standard: "Standard Sprint",
          "project-team": "Project Team Sprint",
        })[sprint.sprintType || "standard"] || "Select Sprint Type"
      );
      setSelectedTeamId(sprint.teamId || "");
      setSelectedTeamDisplay(teams.find(t => t.id === sprint.teamId)?.name || "Select a team");
    }
  }, [sprint, projects]);

  useEffect(() => {
    if (sprint && selectedProjectId !== sprint.projectId) {
      setSelectedTeamId("");
      setSelectedTeamDisplay("Select a team");
    }
  }, [selectedProjectId, sprint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprint || !name || !selectedProjectId || !startDate || !endDate) {
      return;
    }
    if (sprintType === "project-team" && !selectedTeamId) {
      return;
    }
    const updatedSprint = {
      ...sprint,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
      completionStatus,
      sprintType,
      teamId: sprintType === "project-team" ? selectedTeamId : undefined,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateSprint(updatedSprint));
    onOpenChange(false);
  };

  const projectOptions = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects]
  );

  const sprintTypeOptions = useMemo(
    () => [
      { value: "standard", label: "Standard Sprint" },
      { value: "project-team", label: "Project Team Sprint" },
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: "planning", label: "Planning" },
      { value: "active", label: "Active" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const completionStatusOptions = useMemo(
    () => [
      { value: "done", label: "Done" },
      { value: "review", label: "Review" },
      { value: "in-progress", label: "In Progress" },
      { value: "backlog", label: "Move to Backlog" },
    ],
    []
  );

  const teamOptions = useMemo(
    () =>
      projectTeams.length > 0
        ? projectTeams.map((team) => ({ value: team.id, label: team.name }))
        : [{ value: "no-teams", label: "No teams available for this project", disabled: true }],
    [projectTeams, selectedProjectId]
  );

  const handleComboboxToggle = (setter: (value: boolean) => void) => {
    setter((prev) => !prev);
  };

  const handleComboboxItemClick = (
    item: ComboboxItem,
    setterOpen: (value: boolean) => void,
    setterValue: (value: string) => void,
    setterDisplay: (value: string) => void
  ) => {
    if (!item.disabled) {
      setterValue(item.value);
      setterDisplay(item.label);
      setterOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false);
        setIsSprintTypeOpen(false);
        setIsStatusOpen(false);
        setIsCompletionStatusOpen(false);
        setIsTeamOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [comboboxRef]);

  if (!sprint) {
    return null;
  }

  const renderCombobox = ({
    id,
    placeholder,
    items,
    isOpen,
    setOpen,
    selectedValue,
    setSelectedValue,
    setSelectedDisplay,
    required = false,
    disabled: propDisabled = false,
  }: {
    id: string;
    placeholder: string;
    items: ComboboxItem[];
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    setSelectedDisplay: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
  }) => {
    const displayValue = items.find((item) => item.value === selectedValue)?.label || placeholder;
    return (
      <div ref={comboboxRef} className="relative w-full">
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            required && !selectedValue && "border-red-500",
            propDisabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => handleComboboxToggle(setOpen)}
          disabled={propDisabled}
        >
          {displayValue}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.04 1.08l-4.5 4.75a.75.75 0 01-1.08 0l-4.5-4.75a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full overflow-auto rounded-md border bg-popover shadow-md max-h-48 scroll-smooth">
            {items.map((item) => (
              <button
                key={item.value}
                onClick={() => handleComboboxItemClick(item, setOpen, setSelectedValue, setSelectedDisplay)}
                className={cn(
                  "flex w-full cursor-pointer items-center px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  selectedValue === item.value && "bg-accent text-accent-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
                disabled={item.disabled}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Sprint</DialogTitle>
            <DialogDescription>Update the sprint details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project" className="text-right">
                Project
              </Label>
              <div className="col-span-3">
                {renderCombobox({
                  id: "project",
                  placeholder: "Select a project",
                  items: projectOptions,
                  isOpen: isProjectOpen,
                  setOpen: setIsProjectOpen,
                  selectedValue: selectedProjectId,
                  setSelectedValue: setSelectedProjectId,
                  setSelectedDisplay: setSelectedProjectDisplay,
                  required: true,
                })}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sprintType" className="text-right">
                Sprint Type
              </Label>
              <div className="col-span-3">
                {renderCombobox({
                  id: "sprintType",
                  placeholder: "Select Sprint Type",
                  items: sprintTypeOptions,
                  isOpen: isSprintTypeOpen,
                  setOpen: setIsSprintTypeOpen,
                  selectedValue: sprintType,
                  setSelectedValue: setSprintType,
                  setSelectedDisplay: setSelectedSprintTypeDisplay,
                })}
              </div>
            </div>
            {sprintType === "project-team" && selectedProjectId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Project Team
                </Label>
                <div className="col-span-3">
                  {renderCombobox({
                    id: "team",
                    placeholder: "Select a team",
                    items: teamOptions,
                    isOpen: isTeamOpen,
                    setOpen: setIsTeamOpen,
                    selectedValue: selectedTeamId,
                    setSelectedValue: setSelectedTeamId,
                    setSelectedDisplay: setSelectedTeamDisplay,
                    required: sprintType === "project-team",
                    disabled: teamOptions.length === 1 && teamOptions[0].value === "no-teams",
                  })}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completionStatus" className="text-right">
                Task Status on Completion
              </Label>
              <div className="col-span-3">
                {renderCombobox({
                  id: "completionStatus",
                  placeholder: "Select status for tasks",
                  items: completionStatusOptions,
                  isOpen: isCompletionStatusOpen,
                  setOpen: setIsCompletionStatusOpen,
                  selectedValue: completionStatus,
                  setSelectedValue: setCompletionStatus,
                  setSelectedDisplay: selectedCompletionStatusDisplay,
                })}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>

              {renderCombobox({
                id: "status",
                placeholder: "Select status",
                items: statusOptions,
                isOpen: isStatusOpen,
                setOpen: setIsStatusOpen,
                selectedValue: status,
                setSelectedValue: setStatus,
                setSelectedDisplay: selectedStatusDisplay,
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={sprintType === "project-team" && !selectedTeamId}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  );
}
