import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"
import type { HTMLAttributes } from "react"

const badgeVariants = cva("inline-flex items-center rounded-md font-medium", {
  variants: {
    variant: {
      default: "bg-surface-light text-text-dim",
      accent: "bg-accent-alpha text-accent",
      success: "bg-success/15 text-success",
    },
    size: {
      default: "px-3 py-1 text-xs",
      lg: "px-4 py-1.5 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
