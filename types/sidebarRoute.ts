import type { ElementType } from "react"

export interface SidebarRouteItem {
    href: string
    icon: ElementType
    label: string
    badge?: number
}

export interface SidebarDropdownItem {
    href: string
    icon: ElementType
    label: string
}

export interface SidebarDropdownSection {
    title: string
    icon: ElementType
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    activeCheck: boolean
    items: SidebarDropdownItem[]
    nested?: boolean
}

export interface SidebarRoutes {
    main: SidebarRouteItem[]
    [key: string]: SidebarRouteItem[] | SidebarDropdownSection | undefined
}
