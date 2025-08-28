"use client"

import { useState } from "react"
import { ProfileInformation } from "@/components/profile/profile-information"
import { ProfileNotifications } from "@/components/profile/profile-notifications"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthUser } from "@/lib/hooks/useAuthUser"
import EmailChangeForm from "@/components/profile/Email-change-form"
import { ProfileSecurity } from "@/components/profile/profile-security"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"information" | "changeEmail" | "security" | "notifications">("information")
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  const authUser = useAuthUser();
  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveTab("information")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "information" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab("changeEmail")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "changeEmail" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Change Email
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "security" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === "notifications" ? "border-b-2 border-primary text-primary" : "text-muted-foreground",
            )}
          >
            Notifications
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "information" && <ProfileInformation user={authUser.user} />}
          {activeTab === "changeEmail" && <EmailChangeForm />}
          {activeTab === "security" && <ProfileSecurity />}
          {activeTab === "notifications" && <ProfileNotifications />}
        </div>
      </div>
    </div>
  )
}
