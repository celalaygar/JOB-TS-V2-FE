"use client"


import { useCallback, useEffect, useState } from "react";
import KanbanBoard from "@/components/kanban/kanban-board"
import KanbanHeader from "@/components/kanban/kanban-header"
import { getAllBacklogTaskHelper, getAllKanbanTaskHelper, getAllProjectsHelper, getAllProjectTaskStatusHelper, getNonCompletedSprintsHelper, getActiveProjectUsersHelper } from "@/lib/service/api-helpers";
import { KanbanFilterRequest } from "@/types/kanban";
import { Project, ProjectTaskStatus, ProjectUser } from "@/types/project";
import { Loader2 } from "lucide-react";
import { KanbanFilters } from "@/components/kanban/kanban-filters";
import { ProjectTask, TaskResponse } from "@/types/task";
import { Sprint } from "@/types/sprint";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setProjects } from "@/lib/redux/features/projects-slice";
import { setTasks } from "@/lib/redux/features/tasks-slice";


export default function KanbanPage() {

  const [filters, setFilters] = useState<KanbanFilterRequest>({
    searchText: "",
    projectId: "all",
    projectTaskStatusId: "all",
    assigneeId: "all",
    taskType: "all",
    sprintId: "",
  })
  const [sprintList, setSprintList] = useState<Sprint[] | null>([]);
  const [projectTaskStatus, setProjectTaskStatus] = useState<ProjectTaskStatus[] | null>([])
  const [loadingTaskTable, setLoadingTaskTable] = useState(false)
  const [taskResponse, setTaskResponse] = useState<TaskResponse | null>(null)

  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | null>([])

  const [projects, setProject] = useState<Project[] | []>([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const fetchAllProjects = useCallback(async () => {
    const projectsData: Project[] | null = await getAllProjectsHelper({ setLoading: setLoading });
    if (projectsData) {
      setProject(projectsData);
      dispatch(setProjects(projectsData));
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
    const usersData = await getActiveProjectUsersHelper(projectId, { setLoading });
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
    const response: TaskResponse | null = await getAllKanbanTaskHelper(0, 1000, filters, { setLoading: setLoadingTaskTable });
    if (response !== null) {
      setTaskResponse(response);
      dispatch(setTasks(response.content))
    } else {
      setTaskResponse(null);
    }
  }, []);

  const fetchData = () => {
    dispatch(setTasks(null))
    let filter = Object.fromEntries(
      Object.entries(filters).map(([key, value]) => [
        key,
        value === "all" || value === "" ? null : value,
      ])
    ) as unknown as KanbanFilterRequest;
    if (filter.projectId) {
      fetchAllProjectTasks(filter);
    } else {
      toast({
        title: "Please select a project and sprint to filter tasks.",
        variant: "destructive",
      });
    }
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
      sprintId: "all", // Sprint ID added
    }
    setSprintList([]); // Clear sprint list when filters are cleared
    setProjectUsers([]); // Clear project users when filters are cleared
    setProjectTaskStatus([]); // Clear project task status when filters are cleared

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
    let updatedFilters = { ...filters, [name]: value };
    if (name === "projectId") {
      updatedFilters.sprintId = "all";
      updatedFilters.assigneeId = "all";
      if (value && value !== "" && value !== "all") {
        fetchAllProjectTaskStatus(value);
        fetchSprintList(value);
        fetchProjectUsers(value);
      } else {
        setSprintList([]);
        setProjectUsers([]);

      }
    }
    setFilters(updatedFilters);

  };

  return (
    <div className="flex flex-col h-full">
      <KanbanHeader
        fetchData={fetchData}
        projectList={projects}
        loading={loading}
      />
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
            <KanbanBoard
              projectTaskStatus={projectTaskStatus}
              taskResponse={taskResponse}
              loading={loadingTaskTable}
              fetchData={fetchData}
              filters={filters}
            />
          </div>
        </>
      )}
    </div>
  )
}
