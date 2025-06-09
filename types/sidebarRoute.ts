import type { ElementType } from "react"
import { IconType } from "recharts/types/component/DefaultLegendContent"



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

export interface SidebarRouteItem {
    href: string;
    icon: IconType | ElementType;
    label: string;
    badge?: number | string;
}

export interface SidebarRoutes {
    key: string;
    icon: IconType | ElementType;
    category: string;
    routes: SidebarRouteItem[];
}
