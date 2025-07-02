"use client"

import { useCallback, useState } from "react"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksTable } from "@/components/tasks/tasks-table"
import { ProjectTask, ProjectTaskFilterRequest } from "@/types/task"
import { getAllProjectTaskHelper } from "@/lib/service/api-helpers"

export default function TasksPage() {
  const [taskList, setTaskList] = useState<ProjectTask[] | null>()
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<ProjectTaskFilterRequest>({
    search: "",
    projectId: "all",
    projectTaskStatusId: "all",
    priority: "all",
    assigneeId: "all",
    taskType: "all",
  })

  const fetchAllProjectTasks = useCallback(async (filters: ProjectTaskFilterRequest) => {
    setTaskList([]) // Clear previous tasks
    const tasksData = await getAllProjectTaskHelper(0, 1000, filters, { setLoading });
    if (tasksData) {
      setTaskList(tasksData);
    } else {
      setTaskList([]);
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters);
    let filter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as ProjectTaskFilterRequest;

    console.log("filter");
    console.log(filter);
    fetchAllProjectTasks(filter);
  }

  return (
    <div className="container mx-auto py-6">
      <TasksHeader
        filters={filters}
        setFilters={setFilters}
        handleChange={handleChange}
      />
      <TasksTable filters={filters} taskList={taskList} loading={loading} />
    </div>
  )
}
