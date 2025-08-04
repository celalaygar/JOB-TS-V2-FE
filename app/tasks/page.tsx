"use client"

import { useCallback, useEffect, useState } from "react"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksTable } from "@/components/tasks/tasks-table"
import { ProjectTask, ProjectTaskFilterRequest, TaskResponse } from "@/types/task"
import { getAllProjectsHelper, getAllProjectTaskHelper } from "@/lib/service/api-helpers"
import { useDispatch } from "react-redux"
import { setTasks } from "@/lib/redux/features/tasks-slice"
import { Project } from "@/types/project"

export default function TasksPage() {
  const dispatch = useDispatch()
  const [taskList, setTaskList] = useState<ProjectTask[] | null>(null)
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null)
  const [loading, setLoading] = useState(false);
  const [loadingTaskTable, setLoadingTaskTable] = useState(false);
  const [projectList, setProjectList] = useState<Project[] | []>([]);
  const [filters, setFilters] = useState<ProjectTaskFilterRequest>({
    search: "",
    projectId: "all",
    projectTaskStatusId: "all",
    priority: "all",
    assigneeId: "all",
    taskType: "all",
  })

  const fetchAllProjects = useCallback(async () => {
    const projectsData = await getAllProjectsHelper({ setLoading: setLoadingTaskTable });
    if (projectsData) {
      setProjectList(projectsData);
    } else {
      setProjectList([]);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects])


  const fetchAllProjectTasks = useCallback(async (filters: ProjectTaskFilterRequest) => {
    setTaskList([]) // Clear previous tasks
    const response: TaskResponse | null = await getAllProjectTaskHelper(0, 1000, filters, { setLoading });
    if (response) {
      setTaskResponse(response);
      dispatch(setTasks(response.content))
    } else {
      setTaskList([]);
    }
  }, []);

  const fetchData = useCallback(() => {
    let filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as ProjectTaskFilterRequest;
    fetchAllProjectTasks(filter);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchAllProjectTasks])



  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters);
    let filter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as ProjectTaskFilterRequest;

    fetchAllProjectTasks(filter);
  }



  return (
    <div className="container mx-auto py-6">
      <TasksHeader
        fetchData={fetchData}
        filters={filters}
        setFilters={setFilters}
        handleChange={handleChange}
        projectList={projectList}
        loadingTaskTable={loadingTaskTable}
      />
      <TasksTable
        loadingTaskTable={loadingTaskTable}
        projectList={projectList}
        filters={filters}
        taskResponse={taskResponse}
        loading={loading}
        fetchData={fetchData}
      />
    </div>
  )
}
