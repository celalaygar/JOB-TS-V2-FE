export type UserStatus = "Active" | "Inactive" | "Banned" | "Pending"

export interface UserStatusOption {
  value: UserStatus
  label: string
  color: string
  icon: string
}
