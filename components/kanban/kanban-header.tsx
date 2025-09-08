import { Button } from "@/components/ui/button"
import { Project } from "@/types/project"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CreateTaskDialog } from "../tasks/create-task-dialog"
import { useLanguage } from "@/lib/i18n/context"


interface KanbanHeaderProps {
  projectList: Project[] | []
  loading: boolean
  fetchData?: () => void
}

export default function KanbanHeader({ projectList, loading, fetchData }: KanbanHeaderProps) {

  const { translations } = useLanguage()

  const [openDialog, setOpenDialog] = useState(false)
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">{translations.kanban.title}</h1>
        <p className="text-muted-foreground">{translations.kanban.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={loading}
          onClick={() => setOpenDialog(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {translations.kanban.newTask}
        </Button>
      </div>

      <CreateTaskDialog
        fetchData={fetchData}
        parentTask={null}
        open={openDialog}
        projectList={projectList}
        onOpenChange={setOpenDialog}
      />
    </div>
  )
}
