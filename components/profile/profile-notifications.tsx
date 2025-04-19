"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/context"

export function ProfileNotifications() {
  const { translations } = useLanguage()
  const t = translations.profile.notifications

  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    email: {
      comments: true,
      mentions: true,
      assignments: true,
      statusChanges: false,
      newIssues: true,
      projectUpdates: true,
      digest: true,
    },
    push: {
      comments: true,
      mentions: true,
      assignments: true,
      statusChanges: true,
      newIssues: false,
      projectUpdates: false,
    },
  })

  function toggleEmailNotification(key: keyof typeof notifications.email) {
    setNotifications({
      ...notifications,
      email: {
        ...notifications.email,
        [key]: !notifications.email[key],
      },
    })
  }

  function togglePushNotification(key: keyof typeof notifications.push) {
    setNotifications({
      ...notifications,
      push: {
        ...notifications.push,
        [key]: !notifications.push[key],
      },
    })
  }

  function saveNotificationSettings() {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: t.settingsUpdated,
        description: t.settingsUpdatedDesc,
      })

      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.email.title}</CardTitle>
          <CardDescription>{t.email.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.comments.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.comments.description}</p>
              </div>
              <Switch
                checked={notifications.email.comments}
                onCheckedChange={() => toggleEmailNotification("comments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.mentions.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.mentions.description}</p>
              </div>
              <Switch
                checked={notifications.email.mentions}
                onCheckedChange={() => toggleEmailNotification("mentions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.assignments.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.assignments.description}</p>
              </div>
              <Switch
                checked={notifications.email.assignments}
                onCheckedChange={() => toggleEmailNotification("assignments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.statusChanges.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.statusChanges.description}</p>
              </div>
              <Switch
                checked={notifications.email.statusChanges}
                onCheckedChange={() => toggleEmailNotification("statusChanges")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.newIssues.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.newIssues.description}</p>
              </div>
              <Switch
                checked={notifications.email.newIssues}
                onCheckedChange={() => toggleEmailNotification("newIssues")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.projectUpdates.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.projectUpdates.description}</p>
              </div>
              <Switch
                checked={notifications.email.projectUpdates}
                onCheckedChange={() => toggleEmailNotification("projectUpdates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.email.digest.title}</h4>
                <p className="text-sm text-muted-foreground">{t.email.digest.description}</p>
              </div>
              <Switch checked={notifications.email.digest} onCheckedChange={() => toggleEmailNotification("digest")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.push.title}</CardTitle>
          <CardDescription>{t.push.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.comments.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.comments.description}</p>
              </div>
              <Switch
                checked={notifications.push.comments}
                onCheckedChange={() => togglePushNotification("comments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.mentions.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.mentions.description}</p>
              </div>
              <Switch
                checked={notifications.push.mentions}
                onCheckedChange={() => togglePushNotification("mentions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.assignments.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.assignments.description}</p>
              </div>
              <Switch
                checked={notifications.push.assignments}
                onCheckedChange={() => togglePushNotification("assignments")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.statusChanges.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.statusChanges.description}</p>
              </div>
              <Switch
                checked={notifications.push.statusChanges}
                onCheckedChange={() => togglePushNotification("statusChanges")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.newIssues.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.newIssues.description}</p>
              </div>
              <Switch
                checked={notifications.push.newIssues}
                onCheckedChange={() => togglePushNotification("newIssues")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{t.push.projectUpdates.title}</h4>
                <p className="text-sm text-muted-foreground">{t.push.projectUpdates.description}</p>
              </div>
              <Switch
                checked={notifications.push.projectUpdates}
                onCheckedChange={() => togglePushNotification("projectUpdates")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveNotificationSettings} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.saveSettings}
        </Button>
      </div>
    </div>
  )
}
