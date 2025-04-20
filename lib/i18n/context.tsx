"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { en, tr, type Language, type Translations } from "./translations"

interface LanguageContextType {
  language: Language
  translations: Translations
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get initial language from localStorage if available, default to English
  const [language, setLanguageState] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tr")) {
      setLanguageState(savedLanguage)
      setTranslations(savedLanguage === "en" ? en : tr)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setTranslations(lang === "en" ? en : tr)
    localStorage.setItem("language", lang)
  }

  return <LanguageContext.Provider value={{ language, translations, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
