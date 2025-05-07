"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Menu, Search, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/lib/hooks/use-sidebar"
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
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { LanguageSelector } from "@/components/language-selector"

export function AppHeader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("")
  const { toggleSidebar } = useSidebar()
  const currentUser = useSelector((state: RootState) => state.auth.currentUser)
  const notifications = useSelector((state: RootState) => state.notifications.notifications)

  const unreadNotifications = notifications.filter((n) => !n.read)
  const recentNotifications = notifications.slice(0, 5)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 fixed-header border-b px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden text-[var(--fixed-header-fg)]" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex-1 md:grow-0 md:w-64 lg:w-80">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[var(--fixed-sidebar-muted)]" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-[var(--fixed-background)] pl-8 md:w-[200px] lg:w-[300px] border-[var(--fixed-card-border)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LanguageSelector />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-[var(--fixed-header-fg)]">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-[var(--fixed-primary)] text-white text-[10px]">
                  {unreadNotifications.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadNotifications.length > 0 && (
                <Badge className="bg-[var(--fixed-primary)] text-white">{unreadNotifications.length} new</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="py-2 px-3 cursor-pointer"
                    onClick={() => router.push(`/issues?issue=${notification.issueId}`)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={notification.sender.avatar || "/placeholder.svg"}
                          alt={notification.sender.name}
                        />
                        <AvatarFallback>{notification.sender.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${!notification.read ? "text-[var(--fixed-primary)]" : ""}`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-[var(--fixed-primary)]"></div>}
                        </div>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] truncate">{notification.message}</p>
                        <p className="text-xs text-[var(--fixed-sidebar-muted)] mt-1">
                          {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-[var(--fixed-sidebar-muted)]">No notifications yet</p>
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center font-medium" onClick={() => router.push("/notifications")}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
      </div>
    </header>
  )
}
