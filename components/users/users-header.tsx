"use client"

interface UsersHeaderProps {
  title: string
  description: string
}

export function UsersHeader({ title, description }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-[var(--fixed-sidebar-muted)]">{description}</p>
    </div>
  )
}
