"use client"

import { useState } from "react"
import type React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProjectTask, ProjectTaskPriority, ProjectTaskType, type Task } from "@/types/task"
import { AlertCircle, BookOpen, Bug, Edit, Eye, GitBranch, Lightbulb, MoreVertical } from "lucide-react"
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import Link from "next/link"
import { Project } from "@/types/project"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { getTaskTypeIcon, getTaskTypeIconClassName, getTypeColor } from "@/lib/utils/task-type-utils"
import { getPriorityClassName } from "@/lib/utils/priority-utils"

interface KanbanCardProps {
  task: ProjectTask
}

export default function KanbanCard({ task }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selecteddTask, setSelecteddTask] = useState<ProjectTask | null>(null)
  const projects = useSelector((state: RootState) => state.projects.projects)
  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    // Sürükleme bittiğinde oluşturduğumuz kopya elementi temizle
    const dragImage = document.getElementById("drag-image-copy");
    if (dragImage) {
      document.body.removeChild(dragImage);
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", task.id)
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)

    // Kartın bir kopyasını oluştur ve stil ver
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.id = "drag-image-copy"; // Kolayca erişmek için bir ID verelim
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px" // Ekran dışında konumlandır
    dragImage.style.left = "-1000px" // Ekran dışında konumlandır
    dragImage.style.background = "white" // Arka planı belirgin yap
    dragImage.style.border = "5px solid #111111" // Çerçeve ekle
    dragImage.style.borderRadius = "8px"
    dragImage.style.padding = "12px"
    dragImage.style.boxShadow = "0 10px 25px -3px rgba(0, 0, 0, 0.3)"
    dragImage.style.opacity = "1" // Tamamen görünür olmasını sağla
    dragImage.style.transform = "rotate(3deg) scale(1.05)" // Hafif döndürme ve büyütme
    dragImage.style.pointerEvents = "none" // Fare olaylarını engelle
    dragImage.style.zIndex = "9999" // Diğer elementlerin üzerinde olmasını sağla
    dragImage.style.width = e.currentTarget.offsetWidth + "px" // Genişliğini orijinal kart ile aynı yap
    dragImage.style.fontFamily = "inherit" // Fontu miras al
    document.body.appendChild(dragImage)

    // Bu kopyayı sürükleme görüntüsü olarak ayarla
    // Konumlandırmayı fare imlecinin ucunda ortalayacak şekilde ayarla
    e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2)

    // Sürükleme bittikten sonra bu elementi handleDragEnd içinde kaldıracağız.
    // Buradaki setTimeout'u kaldırıyoruz çünkü handleDragEnd içinde temizliği yapacağız.
  }



  const IconComponent = getTaskTypeIcon(task.taskType);
  const iconClassName = getTaskTypeIconClassName(task.taskType);
  return (
    <>
      <div
        className={`bg-white p-3 rounded-lg border shadow-sm cursor-grab hover:border-primary transition-all duration-200 relative ${isDragging
          ? "opacity-90 scale-105 rotate-2 shadow-xl border-primary ring-2 ring-primary/20"
          : "hover:shadow-md"
          }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={getTypeColor(task.taskType)}>
            <span className="flex items-center gap-1">
              <IconComponent className={`h-4 w-4 ${iconClassName}`} />
              {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
            </span>
          </Badge>

          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getPriorityClassName(task.priority)}`} title={`Priority: ${task.priority}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem  >
                  <Link href={`/tasks/${task.id}`} className="flex items-center cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowEditDialog(true)
                    setSelecteddTask(task)
                  }}
                ><Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <h4 className="font-medium mb-2 line-clamp-2">{task.title}</h4>
        <div className="text-xs text-muted-foreground mb-3">
          {task.taskNumber} • {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs">{task.createdProject?.name}</div>
          {task.assignee && (
            <Avatar className="h-6 w-6">
              <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                {task.assignee?.firstname?.charAt(0).toUpperCase() + " " + task.assignee?.lastname?.charAt(0).toUpperCase()}
              </div>
            </Avatar>
          )}
        </div>
      </div>

      {/* Task Details Dialog */}
      <TaskDetailsDialog taskId={task.id} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

      {/* Edit Task Dialog */}
      {selecteddTask &&
        <EditTaskDialog
          projectTask={selecteddTask}
          projectList={projects}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          fetchData={undefined}
        />
      }
    </>
  )
}