import KanbanBoard from "@/components/kanban/kanban-board"
import KanbanFilters from "@/components/kanban/kanban-filters"
import KanbanHeader from "@/components/kanban/kanban-header"

export default function KanbanPage() {
  return (
    <div className="flex flex-col h-full">
      <KanbanHeader />
      <KanbanFilters />
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  )
}
