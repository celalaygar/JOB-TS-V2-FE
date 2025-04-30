"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Check, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function LanguageSelector({ variant = "default" }: { variant?: "default" | "minimal" }) {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
          <Globe className="h-4 w-4" />
          {variant === "default" && (
            <>
              <span className="hidden sm:inline-block">{language === "en" ? "English" : "Türkçe"}</span>
              <span className="sr-only">Change language</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span>English</span>
          {language === "en" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("tr")}>
          <span>Türkçe</span>
          {language === "tr" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
