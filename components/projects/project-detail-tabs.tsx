"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectOverview from "./project-overview"
import ProjectRolesManagement from "./project-roles/project-roles-management"
import type { Project } from "@/types/project"

interface ProjectDetailTabsProps {
  project: Project
}

export default function ProjectDetailTabs({ project }: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-0">
        <ProjectOverview project={project} />
      </TabsContent>

      <TabsContent value="roles" className="mt-0">
        <ProjectRolesManagement projectId={project.id} />
      </TabsContent>

      <TabsContent value="settings" className="mt-0">
        <div className="rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-4">Project Settings</h2>
          <p className="text-gray-500">Project settings will be implemented here.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
