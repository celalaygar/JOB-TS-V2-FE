"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface OvertimeRequestHeaderProps {
  onNewRequest: () => void
}

export function OvertimeRequestHeader({ onNewRequest }: OvertimeRequestHeaderProps) {
  const { translations } = useLanguage()
  const t = translations.requests.overtime

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>
      <Button className="w-full sm:w-auto" onClick={onNewRequest}>
        <Plus className="mr-2 h-4 w-4" />
        {t.newRequest}
      </Button>
    </div>
  )
}
