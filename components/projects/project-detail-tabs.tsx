"use client"

import { useState } from "react"
import ProjectOverview from "./project-overview"
import ProjectRolesManagement from "./project-roles/project-roles-management"
import type { Project } from "@/types/project"

interface ProjectDetailTabsProps {
  project: Project
}

export default function ProjectDetailTabs({ project }: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "overview"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "roles"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("roles")}
        >
          Roles
        </div>
        <div
          className={`px-4 py-2 cursor-pointer ${
            activeTab === "settings"
              ? "border-b-2 border-primary font-medium text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="mt-0">
          <ProjectOverview project={project} />
        </div>
      )}

      {activeTab === "roles" && (
        <div className="mt-0">
          <ProjectRolesManagement projectId={project.id} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="mt-0">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">Project Settings</h2>
            <p className="text-gray-500">Project settings will be implemented here.</p>
          </div>
        </div>
      )}
    </div>
  )
}
