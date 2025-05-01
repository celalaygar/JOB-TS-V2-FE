"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useLanguage } from "@/lib/i18n/context"
import { users } from "@/data/users"
import type { TeamMember } from "@/data/company-teams"

const formSchema = z.object({
  userId: z.string({
    required_error: "Please select a user",
  }),
  role: z.string({
    required_error: "Please select a role",
  }),
})

interface AddMemberDialogProps {
  open: boolean
  onClose: () => void
  onAddMember: (member: TeamMember) => void
  teamId: string
  companyId: string
  existingMemberIds: string[]
}

export function AddMemberDialog({
  open,
  onClose,
  onAddMember,
  teamId,
  companyId,
  existingMemberIds,
}: AddMemberDialogProps) {
  const { translations } = useLanguage()
  const [userOpen, setUserOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      role: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedUser = users.find((user) => user.id === values.userId)
    if (!selectedUser) return

    const newMember: TeamMember = {
      id: `team-member-${Date.now()}`,
      userId: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      role: values.role,
      status: "Active",
      avatar: selectedUser.avatar,
      initials: selectedUser.initials,
      department: selectedUser.department,
      phone: selectedUser.phone,
      joinedAt: new Date().toISOString(),
    }

    onAddMember(newMember)
    onClose()
    form.reset()
  }

  // Filter out users who are already members
  const availableUsers = users.filter((user) => !existingMemberIds.includes(user.id))

  // Get roles from translations
  const roles = Object.entries(translations.teams?.teamDetail.roles || {}).map(([key, value]) => ({
    value: value,
    label: value,
  }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{translations.teams?.companyTeams.addMember}</DialogTitle>
          <DialogDescription>Add a new member to the team. Select a user and assign a role.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translations.teams?.companyTeams.selectUser}</FormLabel>
                  <Popover open={userOpen} onOpenChange={setUserOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userOpen}
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? users.find((user) => user.id === field.value)?.name
                            : translations.teams?.companyTeams.selectUser}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder={translations.teams?.companyTeams.searchUsers} />
                        <CommandList>
                          <CommandEmpty>{translations.teams?.companyTeams.noUsersFound}</CommandEmpty>
                          <CommandGroup>
                            {availableUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.id}
                                onSelect={() => {
                                  form.setValue("userId", user.id)
                                  setUserOpen(false)
                                }}
                              >
                                <Check
                                  className={cn("mr-2 h-4 w-4", user.id === field.value ? "opacity-100" : "opacity-0")}
                                />
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                {user.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translations.teams?.companyTeams.selectRole}</FormLabel>
                  <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={roleOpen}
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value || translations.teams?.companyTeams.selectRole}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {roles.map((role) => (
                              <CommandItem
                                key={role.value}
                                value={role.value}
                                onSelect={() => {
                                  form.setValue("role", role.value)
                                  setRoleOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    role.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {role.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                {translations.requests?.overtime.actions.cancel}
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {translations.teams?.companyTeams.addMember}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
