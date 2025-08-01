"use client"

import { useRouter } from "next/navigation"
import { LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/lib/redux/features/auth-slice"
import type { RootState } from "@/lib/redux/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

export function UserProfileDropdown() {
  const router = useRouter()
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)

  const handleLogout = async () => {
    try {
      const currentOrigin = window.location.origin;
      await fetch("/api/auth/logout");
      await signOut({ callbackUrl: currentOrigin + "/" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-8 w-8 border border-[var(--fixed-card-border)]"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name || "User"} />
            <AvatarFallback>{currentUser?.initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
