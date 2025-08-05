"use client"

import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { BacklogHeader } from "@/components/backlog/backlog-header"
import { BacklogTable } from "@/components/backlog/backlog-table"
import { BacklogFilters } from "@/components/backlog/backlog-filters"
import { Project } from "@/types/project"
import { ProjectTaskFilterRequest, Task, TaskResponse } from "@/types/task"
import { getAllBacklogTaskHelper, getAllProjectsHelper } from "@/lib/service/api-helpers"
import { setTasks } from "@/lib/redux/features/tasks-slice"
import { Loader2 } from "lucide-react"

export default function BacklogPage() {
  const projects = useSelector((state: RootState) => state.projects.projects)
  const users = useSelector((state: RootState) => state.users.users)

  /*
  const [filters, setFilters] = useState({
    search: "",
    project: "all",
    priority: "all",
    assignee: "all",
    taskType: "all",
  })
*/

  const dispatch = useDispatch()
  const [loadingTaskTable, setLoadingTaskTable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null)
  const [taskList, setTaskList] = useState<Task[]>([])
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
    const projectsData = await getAllProjectsHelper({ setLoading: setLoading });
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
    const response: TaskResponse | null = await getAllBacklogTaskHelper(0, 1000, filters, { setLoading: setLoadingTaskTable });
    if (response !== null) {
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




  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <BacklogHeader />
      <div className="p-6 space-y-6 flex-1 overflow-auto">
        <BacklogFilters
          filters={filters}
          handleChange={handleFilterChange}
          projects={projectList}
          fetchData={fetchData}
          loadingFilter={loading}
        />
        {
          loading || loadingTaskTable
            ?
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            </div>
            :
            <>

              <BacklogTable
                loadingTaskTable={loadingTaskTable}
                projectList={projectList}
                taskResponse={taskResponse}
                loading={loading}
                fetchData={fetchData}
                filters={filters} />
            </>
        }
      </div>
    </div>
  )
}
