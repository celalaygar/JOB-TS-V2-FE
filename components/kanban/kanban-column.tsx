import { Badge } from "@/components/ui/badge"
import type { ReactNode } from "react"

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  children: ReactNode
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  // Get color based on column id
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "to-do":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "in-progress":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "review":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "done":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  // Get icon based on column id
  const getColumnIcon = (columnId: string) => {
    switch (columnId) {
      case "to-do":
        return "📋"
      case "in-progress":
        return "🔄"
      case "review":
        return "🔍"
      case "done":
        return "✅"
      default:
        return "📝"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getColumnIcon(id)}</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <Badge variant="outline" className={getColumnColor(id)}>
          {count}
        </Badge>
      </div>
      <div className="bg-muted/30 rounded-md p-2 h-[calc(100vh-240px)] overflow-y-auto">{children}</div>
    </div>
  )
}
