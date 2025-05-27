"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import type { TeamMember } from "@/data/company-teams"

interface EditRoleDialogProps {
  open: boolean
  onClose: () => void
  member: TeamMember
  onSave: (role: string) => void
}

export function EditRoleDialog({ open, onClose, member, onSave }: EditRoleDialogProps) {
  const { translations } = useLanguage()
  const [role, setRole] = useState(member.role)
  const [roleOpen, setRoleOpen] = useState(false)

  // Get roles from translations
  const roles = Object.entries(translations.teams?.teamDetail.roles || {}).map(([key, value]) => ({
    value: value,
    label: value,
  }))

  const handleSave = () => {
    onSave(role)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>{translations.teams?.companyTeams.editMemberRole}</DialogTitle>
          <DialogDescription>Change the role for {member.name}.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">{translations.teams?.companyTeams.memberName}</p>
              <p className="break-words">{member.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">{translations.teams?.companyTeams.memberEmail}</p>
              <p className="break-words text-sm">{member.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">{translations.teams?.companyTeams.memberRole}</p>
              <Popover open={roleOpen} onOpenChange={setRoleOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={roleOpen} className="w-full justify-between">
                    {role}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {roles.map((roleOption) => (
                          <CommandItem
                            key={roleOption.value}
                            value={roleOption.value}
                            onSelect={() => {
                              setRole(roleOption.value)
                              setRoleOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", roleOption.value === role ? "opacity-100" : "opacity-0")}
                            />
                            {roleOption.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            {translations.requests?.overtime.actions.cancel}
          </Button>
          <Button type="button" onClick={handleSave} className="w-full sm:w-auto">
            {translations.requests?.overtime.actions.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
