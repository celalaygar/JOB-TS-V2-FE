"use client"

interface TaskDetailDescriptionProps {
  description: string
  acceptanceCriteria?: string | null
}

export function TaskDetailDescription({ description, acceptanceCriteria }: TaskDetailDescriptionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="mt-2 text-muted-foreground whitespace-pre-line">{description || "No description provided."}</p>
      </div>

      {acceptanceCriteria && (
        <div>
          <h3 className="text-lg font-medium">Acceptance Criteria</h3>
          <p className="mt-2 text-muted-foreground whitespace-pre-line">{acceptanceCriteria}</p>
        </div>
      )}
    </div>
  )
}
