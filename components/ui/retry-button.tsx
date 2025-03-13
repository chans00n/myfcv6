import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface RetryButtonProps {
  onClick: () => void
  isLoading?: boolean
  className?: string
}

export function RetryButton({ onClick, isLoading, className }: RetryButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isLoading}
      className={className}
    >
      <RefreshCw className={cn(
        "h-4 w-4 mr-2",
        isLoading && "animate-spin"
      )} />
      {isLoading ? "Retrying..." : "Retry"}
    </Button>
  )
} 