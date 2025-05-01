"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { KanbanColumn } from "./kanban-column"
import { KanbanCard } from "./kanban-card"
import { issues as initialIssues } from "@/data/issues"
import type { Issue } from "@/types/issue"

export function KanbanBoard() {
  const [issues, setIssues] = useState<Issue[]>([])

  useEffect(() => {
    // Initialize issues from data
    setIssues(initialIssues)
  }, [])

  // Group issues by status
  const columns = {
    "to-do": {
      id: "to-do",
      title: "To Do",
      issues: issues.filter((issue) => issue.status === "to-do"),
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      issues: issues.filter((issue) => issue.status === "in-progress"),
    },
    review: {
      id: "review",
      title: "In Review",
      issues: issues.filter((issue) => issue.status === "review"),
    },
    done: {
      id: "done",
      title: "Done",
      issues: issues.filter((issue) => issue.status === "done"),
    },
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Update the issue status
    setIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === draggableId ? { ...issue, status: destination.droppableId } : issue)),
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(columns).map((column) => (
          <KanbanColumn key={column.id} id={column.id} title={column.title} count={column.issues.length}>
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-4 min-h-[200px] p-1 rounded-md transition-colors ${
                    snapshot.isDraggingOver ? "bg-muted/60" : ""
                  }`}
                >
                  {column.issues.map((issue, index) => (
                    <Draggable key={issue.id} draggableId={issue.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-transform ${snapshot.isDragging ? "rotate-1 scale-105" : ""}`}
                        >
                          <KanbanCard issue={issue} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </KanbanColumn>
        ))}
      </div>
    </DragDropContext>
  )
}
