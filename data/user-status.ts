import type { UserStatusOption } from "../types/user-status"

export const userStatusOptions: UserStatusOption[] = [
  {
    value: "Active",
    label: "Active",
    color: "bg-green-500",
    icon: "check-circle",
  },
  {
    value: "Inactive",
    label: "Inactive",
    color: "bg-yellow-500",
    icon: "alert-circle",
  },
  {
    value: "Banned",
    label: "Banned",
    color: "bg-red-500",
    icon: "ban",
  },
  {
    value: "Pending",
    label: "Pending",
    color: "bg-blue-500",
    icon: "clock",
  },
]
