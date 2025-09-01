"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, UserPlus, ShieldCheck, AlignJustify } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project } from "@/types/project"
import { useLanguage } from "@/lib/i18n/context"

interface ProjectHeaderProps {
  project: Project
  onEditClick: () => void
  onInviteClick: () => void
  onDeleteClick: () => void
  onManageRolesClick: () => void
}

export function ProjectHeader({
  project,
  onEditClick,
  onInviteClick,
  onDeleteClick,
  onManageRolesClick,
}: ProjectHeaderProps) {
  const router = useRouter()
  const { translations } = useLanguage()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-[var(--fixed-card-border)] text-[var(--fixed-sidebar-fg)]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{translations.projects.back}</span>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{project.name}</h1>
        <Badge
          className={`ml-2 ${project.status === "Completed"
            ? "bg-[var(--fixed-success)] text-white"
            : project.status === "In Progress"
              ? "bg-[var(--fixed-primary)] text-white"
              : ""
            }`}
        >
          {project.status}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{translations.projects.openMenu}</span>
              <AlignJustify className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEditClick}>
              <Edit className="mr-2 h-4 w-4" />
              {translations.projects.editProject}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onInviteClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              {translations.projects.inviteUser}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageRolesClick}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              {translations.projects.manageRoles}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteClick} className="text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              {translations.projects.deleteProject}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
