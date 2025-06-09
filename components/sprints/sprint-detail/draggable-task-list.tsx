"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  UserPlus,
  FolderInput,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignee?: string;
  storyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
  order?: number;
}

interface DraggableTaskListProps {
  tasks: Task[];
  onEdit: (id: string) => void;
  onAssign: (id: string) => void;
  onMove: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onReorder: (tasks: Task[]) => void;
}

interface SortableTaskRowProps {
  task: Task;
  onEdit: (id: string) => void;
  onAssign: (id: string) => void;
  onMove: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  users: any[];
  index: number;
}

// Sortable task row component (no longer sortable directly)
function SortableTaskRow({
  task,
  onEdit,
  onAssign,
  onMove,
  onDelete,
  onView,
  users,
  index,
}: SortableTaskRowProps) {
  const assignedUser = task.assignee
    ? users.find((u) => u.id === task.assignee)
    : null;

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
      case "to-do":
        return "bg-slate-500";
      case "in-progress":
        return "bg-blue-500";
      case "review":
        return "bg-purple-500";
      case "done":
        return "bg-green-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-slate-500";
      case "medium":
        return "bg-blue-500";
      case "high":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-red-500";
      case "feature":
        return "bg-green-500";
      case "task":
        return "bg-blue-500";
      case "improvement":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <TableRow className="group">
      <TableCell className="w-[40px] text-muted-foreground">{index + 1}.</TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <span
            className="cursor-pointer hover:text-primary hover:underline"
            onClick={() => onView(task.id)}
          >
            {task.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={`${getTypeColor(task.type)} text-white`}>
          {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(task.status)} text-white`}>
          {task.status === "todo"
            ? "To Do"
            : task.status === "in-progress"
              ? "In Progress"
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={`${getPriorityColor(task.priority)} text-white`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {assignedUser ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={assignedUser.avatar || "/placeholder.svg"}
                alt={assignedUser.name}
              />
              <AvatarFallback>{assignedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{assignedUser.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell>
        {task.storyPoints ? (
          <Badge variant="outline" className="bg-background">
            {task.storyPoints} {task.storyPoints === 1 ? "point" : "points"}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(task.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAssign(task.id)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign to User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMove(task.id)}>
                <FolderInput className="mr-2 h-4 w-4" />
                Move
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DraggableTaskList({
  tasks,
  onEdit,
  onAssign,
  onMove,
  onDelete,
  onView,
  onReorder,
}: DraggableTaskListProps) {
  const {
    taskStatusFilter,
    taskPriorityFilter,
    taskTypeFilter,
    taskAssigneeFilter,
    taskSearchQuery,
  } = useSelector((state: RootState) => state.filters);

  const users = useSelector((state: RootState) => state.users.users);

  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);

  // Filter and sort tasks using useMemo to prevent recalculation on every render
  const filteredAndSortedTasks = useMemo(() => {
    // Filter tasks based on filters
    const filtered = tasks.filter((task) => {
      // Status filter
      if (taskStatusFilter && task.status !== taskStatusFilter) return false;

      // Priority filter
      if (taskPriorityFilter && task.priority !== taskPriorityFilter)
        return false;

      // Type filter
      if (taskTypeFilter && task.type !== taskTypeFilter) return false;

      // Assignee filter
      if (taskAssigneeFilter) {
        if (taskAssigneeFilter === "unassigned" && task.assignee) return false;
        if (
          taskAssigneeFilter !== "unassigned" &&
          task.assignee !== taskAssigneeFilter
        )
          return false;
      }

      // Search query
      if (taskSearchQuery) {
        const query = taskSearchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort tasks
    return [...filtered].sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      // Handle special case for assignee (get user name)
      if (sortField === "assignee") {
        const aUser = a.assignee
          ? users.find((u) => u.id === a.assignee)?.name || ""
          : "";
        const bUser = b.assignee
          ? users.find((u) => u.id === b.assignee)?.name || ""
          : "";
        aValue = aUser;
        bValue = bUser;
      }

      if (aValue === undefined) aValue = "";
      if (bValue === undefined) bValue = "";

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [
    tasks,
    taskStatusFilter,
    taskPriorityFilter,
    taskTypeFilter,
    taskAssigneeFilter,
    taskSearchQuery,
    sortField,
    sortDirection,
    users,
  ]);

  // Update sortedTasks when filteredAndSortedTasks changes
  useEffect(() => {
    setSortedTasks(filteredAndSortedTasks);
  }, [filteredAndSortedTasks]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Basic reorder function (without drag and drop library)
  const reorderTasks = (startIndex: number, endIndex: number) => {
    const newTasks = [...sortedTasks];
    const [movedTask] = newTasks.splice(startIndex, 1);
    newTasks.splice(endIndex, 0, movedTask);

    // Optionally update the order property if needed for your backend
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setSortedTasks(updatedTasks);
    onReorder(updatedTasks);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">#</TableHead>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => handleSort("title")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Title
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("type")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Type
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Status
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("priority")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Priority
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("assignee")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Assignee
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("storyPoints")}
                className="flex items-center gap-1 px-0 hover:bg-transparent"
              >
                Points
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task, index) => (
              <SortableTaskRow
                key={task.id}
                task={task}
                onEdit={onEdit}
                onAssign={onAssign}
                onMove={onMove}
                onDelete={onDelete}
                onView={onView}
                users={users}
                index={index}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No tasks found matching the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}