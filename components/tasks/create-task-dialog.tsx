"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { addTask } from "@/lib/redux/features/tasks-slice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bug, Lightbulb, BookOpen, GitBranch, Loader2 } from "lucide-react"
import type { Task } from "@/lib/redux/features/tasks-slice"
import type { TaskType } from "@/types/task"
import { toast } from "@/hooks/use-toast"
import BaseService from "@/lib/service/BaseService"
import { httpMethods } from "@/lib/service/HttpService"
import { PROJECT_URL } from "@/lib/service/BasePath" // Sadece PROJECT_URL kaldı, diğerleri serviste
import { Project, ProjectUser } from "@/types/project"
import { Sprint } from "@/types/sprint"

// Yeni veri çekme servisinden fonksiyonları import et
import { fetchProjectUsers, fetchSprints } from "@/lib/service/data-fetch-service";

import Select from "react-select"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentTaskId?: string
  projectList?: Project[] | []
}

interface SelectOption {
  value: string;
  label: string;
}

export function CreateTaskDialog({ open, onOpenChange, parentTaskId, projectList }: CreateTaskDialogProps) {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users.users)
  const allTasks = useSelector((state: RootState) => state.tasks.tasks)

  const [loading, setLoading] = useState(false);
  const [projectUsers, setProjectUsers] = useState<ProjectUser[] | []>([]);
  const [loadingSprints, setLoadingSprints] = useState(false);
  const [sprintList, setSprintList] = useState<Sprint[] | []>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "" as string | null,
    assignee: "" as string | null,
    priority: "Medium" as string,
    taskType: "feature" as TaskType | null,
    sprint: "" as string | null,
    parentTask: (parentTaskId || "") as string | null,
  })

  const projectOptions: SelectOption[] = useMemo(() =>
    (projectList || []).map(p => ({ value: p.id, label: p.name })),
    [projectList]
  );

  const assigneeOptions: SelectOption[] = useMemo(() =>
    (projectUsers || []).map(user => ({ value: user.id, label: user.email })),
    [projectUsers]
  );

  const priorityOptions: SelectOption[] = useMemo(() => [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ], []);

  const taskTypeOptions: SelectOption[] = useMemo(() => [
    { value: "bug", label: "Bug", icon: <Bug className="mr-2 h-4 w-4 text-red-500" /> },
    { value: "feature", label: "Feature", icon: <Lightbulb className="mr-2 h-4 w-4 text-blue-500" /> },
    { value: "story", label: "Story", icon: <BookOpen className="mr-2 h-4 w-4 text-purple-500" /> },
    { value: "subtask", label: "Subtask", icon: <GitBranch className="mr-2 h-4 w-4 text-gray-500" /> },
  ], []);

  const sprintOptions: SelectOption[] = useMemo(() =>
    (sprintList || []).map(sprint => ({ value: sprint.id, label: sprint.name })),
    [sprintList]
  );

  const parentTaskOptions: SelectOption[] = useMemo(() =>
    allTasks
      .filter((task) => task.taskType !== "subtask" && (formData.project ? task.project === formData.project : true))
      .map(task => ({ value: task.id, label: `${task.taskNumber} - ${task.title}` })),
    [allTasks, formData.project]
  );

  // Proje kullanıcılarını çekmek için useCallback'lenmiş fonksiyon
  const handleFetchProjectUsers = useCallback(async (projectId: string) => {
    setLoading(true);
    try {
      const users = await fetchProjectUsers(projectId); // Servis çağrısı
      setProjectUsers(users);
      toast({
        title: `Proje Kullanıcıları Yüklendi`,
        description: `Proje ${projectId} için kullanıcılar alındı.`,
      });
    } catch (error: any) {
      console.error('Proje kullanıcıları yüklenemedi:', error);
      toast({
        title: `Proje Kullanıcıları Yüklenemedi`,
        description: error.message || "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []); // Bağımlılık yok, çünkü projectId argüman olarak geçiliyor

  // Sprintleri çekmek için useCallback'lenmiş fonksiyon
  const handleFetchSprints = useCallback(async (projectId: string) => {
    setLoadingSprints(true);
    try {
      const sprints = await fetchSprints(projectId); // Servis çağrısı
      setSprintList(sprints);
      toast({
        title: "Sprintler Yüklendi",
        description: `Proje ${projectId} için sprintler alındı.`,
      });
    } catch (error: any) {
      console.error("Sprintler yüklenemedi:", error);
      toast({
        title: "Sprintler Yüklenemedi",
        description: error.message || "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoadingSprints(false);
    }
  }, []); // Bağımlılık yok, çünkü projectId argüman olarak geçiliyor


  useEffect(() => {
    if (parentTaskId) {
      const parentTask = allTasks.find((task) => task.id === parentTaskId)
      if (parentTask) {
        setFormData((prev) => ({
          ...prev,
          project: parentTask.project,
          taskType: "subtask",
          parentTask: parentTaskId,
        }))
        if (parentTask.project) {
          handleFetchProjectUsers(parentTask.project);
          handleFetchSprints(parentTask.project);
        }
      }
    }
  }, [parentTaskId, allTasks, handleFetchProjectUsers, handleFetchSprints])


  const handleChange = useCallback((field: keyof typeof formData, value: string | SelectOption | null) => {
    let actualValue: string | null;

    if (typeof value === 'object' && value !== null && 'value' in value) {
      actualValue = value.value;
    } else if (typeof value === 'string' || value === null) {
      actualValue = value;
    } else {
      actualValue = null;
    }

    setFormData((prev) => ({ ...prev, [field]: actualValue }));

    if (field === "project" && typeof actualValue === 'string' && actualValue !== "all") {
      // Proje değiştiğinde ilgili kullanıcıları ve sprintleri çek
      handleFetchProjectUsers(actualValue);
      handleFetchSprints(actualValue);
    }
  }, [handleFetchProjectUsers, handleFetchSprints]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.project || !formData.assignee || !formData.taskType ||
      (formData.taskType === "subtask" && !formData.parentTask)) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen gerekli tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    const selectedProjectData = projectList?.find((p) => p.id === formData.project) || { name: "" };
    const selectedAssigneeData = users.find((user) => user.id === formData.assignee);

    const { title, description, project, assignee, priority, taskType, sprint, parentTask } = formData

    let prefix = ""
    switch (taskType) {
      case "bug":
        prefix = "BUG"
        break
      case "feature":
        prefix = "FTR"
        break
      case "story":
        prefix = "STORY"
        break
      case "subtask":
        prefix = "SUB"
        break
      default:
        prefix = "PBI"
    }

    const newTask: Task = {
      id: null as any, // Backend'den geleceği varsayılır
      taskNumber: null as any, // Backend'den geleceği varsayılır
      title,
      description,
      status: "to-do",
      priority: priority as "High" | "Medium" | "Low",
      taskType: taskType as TaskType,
      project: project!,
      projectName: selectedProjectData.name,
      assignee: {
        id: assignee!,
        name: selectedAssigneeData?.name || "",
        avatar: selectedAssigneeData?.avatar || "",
        initials: selectedAssigneeData?.initials || "",
      },
      sprint: sprint || undefined,
      createdAt: new Date().toISOString(),
      comments: [],
      parentTaskId: parentTask || undefined,
    }

    dispatch(addTask(newTask)) // Redux state'e ekle
    toast({
      title: "Görev Oluşturuldu",
      description: `Görev "${newTask.title}" başarıyla oluşturuldu.`,
    });
    onOpenChange(false)
    setFormData({ // Formu sıfırla
      title: "",
      description: "",
      project: null,
      assignee: null,
      priority: "Medium",
      taskType: "feature",
      sprint: null,
      parentTask: null,
    })
  }

  const saveTask = async () => {
    let project = null; // Bu değişken ismi, task kaydetme değil proje kaydetme çağrısına işaret ediyor
    setLoading(true)
    try {
      const response = await BaseService.request(PROJECT_URL, { // PROJECT_URL kullanıldığı için dikkat!
        method: httpMethods.POST,
        body: formData // Tüm form verisini gönderiyor, bu da genellikle bir Task objesi değil Project objesidir.
      })
      project = response;
      toast({
        title: `Proje kaydedildi.`, // Mesajı da buna göre düzenledim
        description: `Proje başarıyla kaydedildi.`,
      })
      onOpenChange(false)
    } catch (error: any) {
      if (error.status === 400 && error.message) {
        toast({
          title: `Proje kaydetme başarısız. (400)`,
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.error('Proje kaydetme başarısız:', error)
        toast({
          title: `Proje kaydetme başarısız.`,
          description: error.message,
          variant: "destructive",
        })
      }
    }
    setLoading(false)
    return project;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Yeni Görev Oluştur</DialogTitle>
            <DialogDescription>Projenize yeni bir görev ekleyin. Aşağıdaki detayları doldurun.</DialogDescription>
          </DialogHeader>
          {
            loading || loadingSprints ?
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              </div>
              :
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Görevin başlığını girin"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Görevi ayrıntılı olarak açıklayın"
                      rows={3}
                    />
                  </div>

                  {/* Project Select */}
                  <div className="grid gap-2">
                    <Label htmlFor="project">Proje</Label>
                    <Select
                      id="project"
                      options={projectOptions}
                      value={projectOptions.find(option => option.value === formData.project)}
                      onChange={(option) => handleChange("project", option)}
                      placeholder="Proje Seçin"
                      required
                      isDisabled={!!parentTaskId}
                    />
                  </div>

                  {formData.taskType === "subtask" && (
                    <div className="grid gap-2">
                      <Label htmlFor="parentTask">Üst Görev</Label>
                      <Select
                        id="parentTask"
                        options={parentTaskOptions}
                        value={parentTaskOptions.find(option => option.value === formData.parentTask)}
                        onChange={(option) => handleChange("parentTask", option)}
                        placeholder="Üst görev seçin"
                        isDisabled={!!parentTaskId}
                        isClearable
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {/* Task Type Select */}
                      <Label htmlFor="taskType">Görev Tipi</Label>
                      <Select
                        id="taskType"
                        options={taskTypeOptions}
                        value={taskTypeOptions.find(option => option.value === formData.taskType)}
                        onChange={(option) => handleChange("taskType", option)}
                        placeholder="Görev tipi seçin"
                        isDisabled={!!parentTaskId}
                        // Özel render için formatOptionLabel kullanın
                        formatOptionLabel={(option: SelectOption & { icon?: React.ReactNode }) => (
                          <div className="flex items-center">
                            {option.icon}
                            {option.label}
                          </div>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      {/* Assignee Select */}
                      <Label htmlFor="assignee">Atanan Kişi</Label>
                      <Select
                        id="assignee"
                        options={assigneeOptions}
                        value={assigneeOptions.find(option => option.value === formData.assignee)}
                        onChange={(option) => handleChange("assignee", option)}
                        placeholder="Atama Yap"
                        required
                        isClearable
                        isDisabled={!formData.project || assigneeOptions.length === 0}
                        noOptionsMessage={() => "Atanan kişileri görmek için önce bir proje seçin."}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      {/* Priority Select */}
                      <Label htmlFor="priority">Öncelik</Label>
                      <Select
                        id="priority"
                        options={priorityOptions}
                        value={priorityOptions.find(option => option.value === formData.priority)}
                        onChange={(option) => handleChange("priority", option)}
                        placeholder="Öncelik seçin"
                      />
                    </div>
                    <div className="grid gap-2">
                      {/* Sprint Select */}
                      <Label htmlFor="sprint">Sprint</Label>
                      <Select
                        id="sprint"
                        options={sprintOptions}
                        value={sprintOptions.find(option => option.value === formData.sprint)}
                        onChange={(option) => handleChange("sprint", option)}
                        placeholder="Sprint seçin"
                        isClearable
                        isDisabled={!formData.project || sprintOptions.length === 0}
                        noOptionsMessage={() => "Sprintleri görmek için önce bir proje seçin."}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    İptal
                  </Button>
                  <Button type="submit">Görev Oluştur</Button>
                </DialogFooter>
              </>
          }
        </form>
      </DialogContent>
    </Dialog>
  )
}