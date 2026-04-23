import * as React from "react"
import { cn } from "@/lib/utils"

type CardSize = "sm" | "default" | "lg"

interface CardProps extends React.ComponentProps<"div"> {
  size?: CardSize
}

/**
 * Card
 *
 * - Keeps original layout and spacing (padding/gaps) intact.
 * - Only adjusts vertical size via min-height / max-height variants so the card footprint is shorter.
 * - Width behavior is unchanged from the original component.
 */
function Card({ className, size = "default", ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        // original base classes preserved
        "group/card flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card py-6 text-sm text-card-foreground shadow-sm transition-shadow has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        // ONLY vertical size variants (min-height / max-height)
        // using explicit pixel values to avoid reliance on non-standard utility classes
        size === "sm" && "min-h-[120px] max-h-[220px]",
        size === "default" && "min-h-[180px] max-h-[320px]",
        size === "lg" && "min-h-[240px] max-h-[420px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardHeader
 *
 * Unchanged layout rules; keeps original px/spacing so horizontal layout is identical.
 * The header will naturally compress vertically when the parent min-height is reduced.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-xl px-6 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardTitle
 *
 * Font sizing preserved; title will wrap/line-clamp naturally if vertical space is constrained.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-semibold tracking-tight text-foreground group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardDescription
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * CardAction
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * CardContent
 *
 * Horizontal padding preserved; content will compress vertically according to the parent's min-height.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  )
}

/**
 * CardFooter
 *
 * Footer spacing preserved; when the card height is reduced the footer remains visible and the content area will shrink first.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/40 px-6 py-4 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
