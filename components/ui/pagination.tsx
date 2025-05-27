"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { type ButtonProps, buttonVariants } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(1)

    // Calculate range of pages to show around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Adjust range to always show 3 pages if possible
    if (rangeEnd - rangeStart < 2) {
      if (rangeStart === 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + 2)
      } else if (rangeEnd === totalPages - 1) {
        rangeStart = Math.max(2, rangeEnd - 2)
      }
    }

    // Add ellipsis if needed
    if (rangeStart > 2) {
      pages.push(-1) // -1 represents ellipsis
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2) // -2 represents ellipsis
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)}>
      <div className="flex items-center space-x-2">
        <button
          aria-label="Go to previous page"
          className={cn("gap-1 pl-2.5", currentPage === 1 && "opacity-50 cursor-not-allowed")}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {pageNumbers.map((page, i) => {
          if (page === -1 || page === -2) {
            return (
              <button
                disabled
                key={`ellipsis-${i}`}
                className="flex h-9 w-9 items-center justify-center opacity-50 cursor-not-allowed"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </button>
            )
          }

          return (
            <button
              key={page}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: page === currentPage ? "default" : "outline",
                  size: "icon",
                }),
                page === currentPage ? "bg-[var(--fixed-primary)] text-white" : "border-[var(--fixed-card-border)]",
                "px-3 py-2 rounded hover:bg-[var(--fixed-primary)] hover:text-white",
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        })}

        <button
          aria-label="Go to next page"
          className={cn("gap-1 pr-2.5", currentPage === totalPages && "opacity-50 cursor-not-allowed")}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  )
}

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  ),
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious }
