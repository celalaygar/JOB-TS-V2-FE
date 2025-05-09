import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReduxProvider } from "@/lib/redux/provider"
import { LanguageProvider } from "@/lib/i18n/context"
import { AppLayoutClient } from "@/components/app-layout-client"
import "./globals.css"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Issue Tracker",
  description: "A modern issue tracking system",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <ReduxProvider>
              <LanguageProvider>
                <AppLayoutClient>{children}</AppLayoutClient>
              </LanguageProvider>
            </ReduxProvider>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
