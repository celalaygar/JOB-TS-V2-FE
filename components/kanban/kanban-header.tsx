import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function KanbanHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <p className="text-muted-foreground">Manage your tasks with drag and drop</p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/issues/new">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Issue
          </Link>
        </Button>
      </div>
    </div>
  )
}
