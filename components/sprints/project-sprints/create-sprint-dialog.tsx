"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import { addSprint } from "@/lib/redux/features/sprints-slice";
import type { RootState } from "@/lib/redux/store";
import { teams } from "@/data/teams";

interface CreateSprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

interface ComboboxItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export function CreateSprintDialog({ open, onOpenChange, projectId }: CreateSprintDialogProps) {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 14)));
  const [completionStatus, setCompletionStatus] = useState<"done" | "review" | "in-progress" | "backlog">("done");
  const [sprintType, setSprintType] = useState<"standard" | "project-team">("standard");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [selectedProjectDisplay, setSelectedProjectDisplay] = useState<string | undefined>(
    projects.find((p) => p.id === projectId)?.name
  );
  const [isSprintTypeOpen, setIsSprintTypeOpen] = useState(false);
  const [selectedSprintTypeDisplay, setSelectedSprintTypeDisplay] = useState("Standard Sprint");
  const [isCompletionStatusOpen, setIsCompletionStatusOpen] = useState(false);
  const [selectedCompletionStatusDisplay, setSelectedCompletionStatusDisplay] = useState("Done");
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [selectedTeamDisplay, setSelectedTeamDisplay] = useState<string | undefined>();

  const projectComboboxRef = useRef<HTMLDivElement>(null);
  const sprintTypeComboboxRef = useRef<HTMLDivElement>(null);
  const completionStatusComboboxRef = useRef<HTMLDivElement>(null);
  const teamComboboxRef = useRef<HTMLDivElement>(null);

  const projectTeams = useMemo(() => teams.filter((team) => team.projectId === selectedProjectId), [selectedProjectId]);

  useEffect(() => {
    setSelectedTeamId("");
    setSelectedTeamDisplay(undefined);
  }, [selectedProjectId]);

  useEffect(() => {
    setSelectedProjectDisplay(projects.find((p) => p.id === selectedProjectId)?.name);
  }, [selectedProjectId, projects]);

  useEffect(() => {
    setSelectedSprintTypeDisplay(
      sprintType === "standard" ? "Standard Sprint" : sprintType === "project-team" ? "Project Team Sprint" : ""
    );
  }, [sprintType]);

  useEffect(() => {
    setSelectedCompletionStatusDisplay(
      completionStatus === "done"
        ? "Done"
        : completionStatus === "review"
          ? "Review"
          : completionStatus === "in-progress"
            ? "In Progress"
            : completionStatus === "backlog"
              ? "Move to Backlog"
              : ""
    );
  }, [completionStatus]);

  useEffect(() => {
    setSelectedTeamDisplay(teams.find((t) => t.id === selectedTeamId)?.name);
  }, [selectedTeamId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !selectedProjectId || !startDate || !endDate) {
      return;
    }

    if (sprintType === "project-team" && !selectedTeamId) {
      return;
    }

    const newSprint = {
      id: `sprint-${Date.now()}`,
      name,
      description,
      projectId: selectedProjectId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: "planning",
      completionStatus,
      sprintType,
      teamId: sprintType === "project-team" ? selectedTeamId : undefined,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addSprint(newSprint));
    resetForm();
    onOpenChange(false);
  };

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setSelectedProjectId(projectId || "");
    setStartDate(new Date());
    setEndDate(new Date(new Date().setDate(new Date().getDate() + 14)));
    setCompletionStatus("done");
    setSprintType("standard");
    setSelectedTeamId("");
    setSelectedProjectDisplay(projects.find((p) => p.id === projectId)?.name);
    setSelectedSprintTypeDisplay("Standard Sprint");
    setSelectedCompletionStatusDisplay("Done");
    setSelectedTeamDisplay(undefined);
  }, [projectId, projects]);

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
    [projectTeams]
  );

  const handleComboboxToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prev) => !prev);
  };

  const handleComboboxItemClick = (
    item: ComboboxItem,
    setterOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setterValue: React.Dispatch<React.SetStateAction<string>>,
    setterDisplay: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    if (!item.disabled) {
      setterValue(item.value);
      setterDisplay(item.label);
      setterOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectComboboxRef.current && !projectComboboxRef.current.contains(event.target as Node)) {
        setIsProjectOpen(false);
      }
      if (sprintTypeComboboxRef.current && !sprintTypeComboboxRef.current.contains(event.target as Node)) {
        setIsSprintTypeOpen(false);
      }
      if (completionStatusComboboxRef.current && !completionStatusComboboxRef.current.contains(event.target as Node)) {
        setIsCompletionStatusOpen(false);
      }
      if (teamComboboxRef.current && !teamComboboxRef.current.contains(event.target as Node)) {
        setIsTeamOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    projectComboboxRef,
    sprintTypeComboboxRef,
    completionStatusComboboxRef,
    teamComboboxRef,
  ]);

  const renderCombobox = ({
    id,
    placeholder,
    items,
    isOpen,
    setOpen,
    selectedValue,
    setSelectedValue,
    selectedDisplay,
    setSelectedDisplay,
    comboboxRef,
    required = false,
    disabled: propDisabled = false,
  }: {
    id: string;
    placeholder: string;
    items: ComboboxItem[];
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedValue: string;
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
    selectedDisplay: string | undefined;
    setSelectedDisplay: React.Dispatch<React.SetStateAction<string | undefined>>;
    comboboxRef: React.RefObject<HTMLDivElement>;
    required?: boolean;
    disabled?: boolean;
  }) => {
    const displayValue = selectedDisplay || placeholder;
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
            className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
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
            <DialogTitle>Create New Sprint</DialogTitle>
            <DialogDescription>Create a new sprint for your project.</DialogDescription>
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
                  selectedDisplay: selectedProjectDisplay,
                  setSelectedDisplay: setSelectedProjectDisplay,
                  comboboxRef: projectComboboxRef,
                  required: true,
                  disabled: !!projectId,
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
                  selectedDisplay: selectedSprintTypeDisplay,
                  setSelectedDisplay: setSelectedSprintTypeDisplay,
                  comboboxRef: sprintTypeComboboxRef,
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
                    selectedDisplay: selectedTeamDisplay,
                    setSelectedDisplay: setSelectedTeamDisplay,
                    comboboxRef: teamComboboxRef,
                    required: true,
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
                  selectedDisplay: selectedCompletionStatusDisplay,
                  setSelectedDisplay: setSelectedCompletionStatusDisplay,
                  comboboxRef: completionStatusComboboxRef,
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onOpenChange}>
              Cancel
            </Button>
            <Button type="submit" disabled={sprintType === "project-team" && !selectedTeamId}>
              Create Sprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}