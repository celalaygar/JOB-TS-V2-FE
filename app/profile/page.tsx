"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInformation } from "@/components/profile/profile-information"
import { ProfileSecurity } from "@/components/profile/profile-security"
import { ProfileNotifications } from "@/components/profile/profile-notifications"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("information")
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  if (!currentUser) {
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card border">
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="space-y-6">
          <ProfileInformation user={currentUser} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ProfileSecurity />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <ProfileNotifications />
        </TabsContent>
      </Tabs>
    </div>
  )
}
