"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Status {
  name: string
  label: string
  color: string
  order: number
  turkish: string
  english: string
}

interface ProjectIssueStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  status: Status | null
  onSave: (status: Status) => void
}

export function ProjectIssueStatusDialog({ open, onOpenChange, status, onSave }: ProjectIssueStatusDialogProps) {
  const [formData, setFormData] = useState<Status>({
    name: "",
    label: "",
    color: "#E2E8F0",
    order: 1,
    turkish: "",
    english: "",
  })

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (status) {
      setFormData(status)
    } else {
      setFormData({
        name: "",
        label: "",
        color: "#E2E8F0",
        order: 1,
        turkish: "",
        english: "",
      })
    }
    setActiveTab("general")
  }, [status, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{status ? "Edit Status" : "Create Status"}</DialogTitle>
            <DialogDescription>
              {status ? "Update the details for this status." : "Add a new status for issues in this project."}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Status Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., in-progress"
                      required
                    />
                    <p className="text-xs text-[var(--fixed-sidebar-muted)]">System identifier used in code</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="label">Status Label</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g., In Progress"
                      required
                    />
                    <p className="text-xs text-[var(--fixed-sidebar-muted)]">Display name shown to users</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      type="number"
                      id="order"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                      min="1"
                      required
                    />
                    <p className="text-xs text-[var(--fixed-sidebar-muted)]">Display order in workflow</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="translations" className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="turkish">Turkish Value</Label>
                  <Input
                    id="turkish"
                    value={formData.turkish}
                    onChange={(e) => setFormData({ ...formData, turkish: e.target.value })}
                    placeholder="e.g., Devam Ediyor"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="english">English Value</Label>
                  <Input
                    id="english"
                    value={formData.english}
                    onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                    placeholder="e.g., In Progress"
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{status ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
