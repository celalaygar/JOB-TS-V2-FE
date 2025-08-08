"use client"


import { useCallback, useEffect, useState } from "react";
import KanbanBoard from "@/components/kanban/kanban-board"
import KanbanHeader from "@/components/kanban/kanban-header"
import { getAllBacklogTaskHelper, getAllProjectsHelper, getAllProjectTaskStatusHelper, getNonCompletedSprintsHelper, getProjectUsersHelper } from "@/lib/service/api-helpers";
import { KanbanFilterRequest } from "@/types/kanban";
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project";
import { Loader2 } from "lucide-react";
import { KanbanFilters } from "@/components/kanban/kanban-filters";
import { ProjectTask, TaskResponse } from "@/types/task";
import { Sprint } from "@/types/sprint";


export default function KanbanPage() {

  const [filters, setFilters] = useState<KanbanFilterRequest>({
    searchText: "",
    projectId: "all",
    projectTaskStatusId: "all",
    assigneeId: "all",
    taskType: "all",
    sprintId: "",
  })
  const [projects, setProject] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false)
  const [sprintList, setSprintList] = useState<Sprint[] | null>([]);
  const [projectTaskStatus, setProjectTaskStatus] = useState<ProjectTaskStatus[] | null>([])
  const [loadingTaskTable, setLoadingTaskTable] = useState(false)
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null)
  const [taskList, setTaskList] = useState<ProjectTask[]>([])

  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | null>([])


  const fetchAllProjects = useCallback(async () => {
    const projectsData: Project[] | null = await getAllProjectsHelper({ setLoading: setLoading });
    if (projectsData) {
      setProject(projectsData);
    } else {
      setProject([]);
    }
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects])

  const fetchSprintList = useCallback(async (projectId: string) => {
    setSprintList([]);
    const response = await getNonCompletedSprintsHelper(projectId, { setLoading });
    if (response) {
      setSprintList(response);
    } else {
      setSprintList([]);
    }
  }, []);



  const fetchProjectUsers = useCallback(async (projectId: string) => {
    setProjectUsers(null);
    const usersData = await getProjectUsersHelper(projectId, { setLoading });
    if (usersData) {
      setProjectUsers(usersData);
    } else {
      setProjectUsers([]);
    }
  }, []);

  const fetchAllProjectTaskStatus = useCallback(async (projectId: string) => {
    setProjectTaskStatus(null);
    const statusesData = await getAllProjectTaskStatusHelper(projectId, { setLoading });
    if (statusesData) {
      setProjectTaskStatus(statusesData);
    } else {
      setProjectTaskStatus([]);
    }
  }, []);


  const fetchAllProjectTasks = useCallback(async (filters: KanbanFilterRequest) => {
    const response: TaskResponse | null = await getAllBacklogTaskHelper(0, 1000, filters, { setLoading: setLoadingTaskTable });
    if (response !== null) {
      setTaskResponse(response);
      setTaskList(response.content);
    } else {
      setTaskResponse(null);
    }
  }, []);

  const fetchData = () => {
    console.log("Fetching data with filters:", filters);
    let filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as KanbanFilterRequest;
    fetchAllProjectTasks(filter);
  }

  useEffect(() => {
    fetchData();
  }, [fetchAllProjectTasks])

  const clearFilters = () => {
    console.log("Clearing filters");
    let newFilters: KanbanFilterRequest = {
      searchText: "",
      projectId: "all",
      projectTaskStatusId: "all",
      assigneeId: "all",
      taskType: "all",
    }

    setFilters(newFilters);

    let filter = Object.fromEntries(
      Object.entries(newFilters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as KanbanFilterRequest;
    fetchAllProjectTasks(filter);
  }

  const handleChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "projectId") {
      if (value && value !== "" && value !== "all") {
        fetchAllProjectTaskStatus(value);
        fetchSprintList(value); // Burayı ekledik!
        fetchProjectUsers(value);
      } else {
        setSprintList([]); // Proje seçimi temizlendiğinde sprint listesini de temizler
        setProjectUsers([]); // Proje seçimi temizlendiğinde kullanıcı listesini de temizler

      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <KanbanHeader />
      {loadingTaskTable ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : (
        <>
          <KanbanFilters
            fetchData={fetchData}
            handleChange={handleChange}
            projects={projects}
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            loadingFilter={loading}
            sprintList={sprintList} // Yeni prop
            projectUsers={projectUsers} // Yeni prop
          />
          <div className="flex-1 overflow-hidden">
            <KanbanBoard />
          </div>
        </>
      )}
    </div>
  )
}
