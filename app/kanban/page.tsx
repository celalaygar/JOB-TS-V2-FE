import { KanbanBoard } from "@/components/kanban/kanban-board"
import { KanbanHeader } from "@/components/kanban/kanban-header"

export const metadata = {
  title: "Kanban Board",
  description: "Visualize and manage your workflow with a drag-and-drop Kanban board.",
}

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <KanbanHeader />
      <KanbanBoard />
    </div>
  )
}
