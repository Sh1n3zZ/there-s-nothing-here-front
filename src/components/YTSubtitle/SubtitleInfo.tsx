import * as React from "react"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { type YouTubeSubtitleResponse } from "@/client/subtitle"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SubtitleInfoProps {
  /** Response data from YouTube subtitle API */
  data: YouTubeSubtitleResponse
  /** Additional className */
  className?: string
}

export function SubtitleInfo({ data, className }: SubtitleInfoProps) {
  const [currentPage, setCurrentPage] = React.useState(1)

  // Get subtitle texts, default to empty array if null or undefined
  const subtitleTexts = data.subtitle_texts || []
  const totalPages = subtitleTexts.length

  // Reset to page 1 when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [data])

  // Get current subtitle text
  const currentSubtitle = subtitleTexts[currentPage - 1] || ""

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSubtitle)
      toast.success("Subtitle copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy subtitle")
    }
  }

  // If no subtitle texts, show message
  if (totalPages === 0) {
    return (
      <Card className={cn(className)}>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            {data.message || "No subtitles available"}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate pagination range
  const getPaginationItems = () => {
    const items: React.ReactNode[] = []
    const maxVisible = 5 // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than maxVisible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              href="#"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={1 === currentPage}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
            href="#"
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                href="#"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={totalPages === currentPage}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
            href="#"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          Subtitle {totalPages > 1 ? `(${currentPage} / ${totalPages})` : ""}
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy subtitle"
          >
            <Copy className="size-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                  href="#"
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {getPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                  href="#"
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        {/* Subtitle content */}
        <div className="min-h-[200px] rounded-md border bg-muted/50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {currentSubtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

