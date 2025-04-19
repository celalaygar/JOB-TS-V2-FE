"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Github, Gitlab, Slack, Trello, Figma, BugIcon as Jira, ChromeIcon as Google } from "lucide-react"

type Connection = {
  id: string
  name: string
  icon: React.ElementType
  connected: boolean
  lastConnected?: string
}

export function ProfileConnections() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      connected: true,
      lastConnected: "Connected 2 days ago",
    },
    {
      id: "gitlab",
      name: "GitLab",
      icon: Gitlab,
      connected: false,
    },
    {
      id: "slack",
      name: "Slack",
      icon: Slack,
      connected: true,
      lastConnected: "Connected 1 week ago",
    },
    {
      id: "trello",
      name: "Trello",
      icon: Trello,
      connected: false,
    },
    {
      id: "figma",
      name: "Figma",
      icon: Figma,
      connected: true,
      lastConnected: "Connected 3 days ago",
    },
    {
      id: "jira",
      name: "Jira",
      icon: Jira,
      connected: false,
    },
    {
      id: "google",
      name: "Google",
      icon: Google,
      connected: true,
      lastConnected: "Connected 1 month ago",
    },
  ])

  function toggleConnection(id: string) {
    setConnections(
      connections.map((connection) => {
        if (connection.id === id) {
          const newConnection = {
            ...connection,
            connected: !connection.connected,
          }

          if (newConnection.connected) {
            newConnection.lastConnected = "Connected just now"
          } else {
            delete newConnection.lastConnected
          }

          toast({
            title: newConnection.connected ? `Connected to ${connection.name}` : `Disconnected from ${connection.name}`,
            description: newConnection.connected
              ? `Your account is now connected to ${connection.name}.`
              : `Your account has been disconnected from ${connection.name}.`,
          })

          return newConnection
        }
        return connection
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Applications</CardTitle>
        <CardDescription>Manage applications that have access to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-muted p-2 rounded-md">
                  <connection.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{connection.name}</h4>
                  {connection.connected && <p className="text-xs text-muted-foreground">{connection.lastConnected}</p>}
                </div>
              </div>
              <Button
                variant={connection.connected ? "destructive" : "outline"}
                size="sm"
                onClick={() => toggleConnection(connection.id)}
              >
                {connection.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
