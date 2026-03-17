import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"
import type { HTMLAttributes } from "react"

const cardVariants = cva("rounded-xl transition-all", {
  variants: {
    variant: {
      default: "bg-surface border border-border",
      elevated: "bg-surface border border-border shadow-lg shadow-black/20",
      interactive: "bg-surface border border-border hover:border-border-light transition-colors",
    },
    padding: {
      default: "p-4",
      sm: "p-3",
      lg: "p-6",
      none: "p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
  },
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
}
