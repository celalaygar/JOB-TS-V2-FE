import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export function Heading({ as: Component = "h2", className, ...props }: HeadingProps) {
  return <Component className={cn("scroll-m-20", className)} {...props} />
}
