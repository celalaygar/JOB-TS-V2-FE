"use client"

import { useLanguage } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "tr")
  }
  return (
    <>
      <div className="border border-2 languageDiv" >
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[90px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">
              <div className="flex items-center">
                <span className="mr-2">🇺🇸</span> EN
              </div>
            </SelectItem>
            <SelectItem value="tr">
              <div className="flex items-center">
                <span className="mr-2">🇹🇷</span> TR
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
