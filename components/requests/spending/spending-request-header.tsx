"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/context"

interface SpendingRequestHeaderProps {
  onCreateRequest: () => void
}

export function SpendingRequestHeader({ onCreateRequest }: SpendingRequestHeaderProps) {
  const { translations } = useLanguage()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{translations.requests.spending.title}</h1>
          <p className="text-muted-foreground">{translations.requests.spending.description}</p>
        </div>
        <Button onClick={onCreateRequest}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {translations.requests.spending.newRequest}
        </Button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">{translations.requests.spending.myRequests}</h2>
        <p className="text-muted-foreground">{translations.requests.spending.myRequestsDescription}</p>
      </div>
    </div>
  )
}
