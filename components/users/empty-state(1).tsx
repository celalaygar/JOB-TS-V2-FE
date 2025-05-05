import { UserX } from "lucide-react"

interface EmptyStateProps {
  type: string
}

export function EmptyState({ type }: EmptyStateProps) {
  let message = "No users found"

  switch (type) {
    case "admin":
      message = "No admin users found"
      break
    case "developer":
      message = "No developer users found"
      break
    case "tester":
      message = "No tester users found"
      break
    case "product owner":
      message = "No product owner users found"
      break
    default:
      if (type !== "all") {
        message = `No ${type} users found`
      }
  }

  return (
    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg border-[var(--fixed-card-border)] bg-[var(--fixed-secondary)]">
      <UserX className="h-12 w-12 text-[var(--fixed-sidebar-muted)] mb-4" />
      <h3 className="text-lg font-medium mb-1">{message}</h3>
      <p className="text-[var(--fixed-sidebar-muted)]">
        Try adjusting your search or filter to find what you're looking for.
      </p>
    </div>
  )
}
