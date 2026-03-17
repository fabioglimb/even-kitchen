import { cn } from "../../utils/cn"
import type { HTMLAttributes } from "react"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      className={cn("h-2 w-full rounded-full bg-surface-lighter overflow-hidden", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
