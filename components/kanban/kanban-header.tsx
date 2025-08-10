import { Button } from "@/components/ui/button"
import { Project } from "@/types/project"
import { PlusIcon } from "lucide-react"
import Link from "next/link"


interface KanbanHeaderProps {
  projectList: Project[] | []
  loading: boolean
}

export default function KanbanHeader({ projectList, loading }: KanbanHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Manage your tasks with drag and drop</p>
      </div>
      <div className="flex items-center gap-2">
        <Button >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>
  )
}
