import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"
import type { ButtonHTMLAttributes } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] focus:outline-none focus:ring-1 focus:ring-accent/30",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:opacity-90",
        outline: "border border-border bg-surface text-text hover:bg-surface-light hover:border-border-light",
        ghost: "text-text-dim hover:text-text hover:bg-surface-light",
        danger: "bg-red-600/20 text-red-400 hover:bg-red-600/30",
        secondary: "bg-surface-light text-text hover:bg-surface-lighter",
      },
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-7 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
