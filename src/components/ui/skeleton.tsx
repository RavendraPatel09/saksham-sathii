import React from "react"
import { cn } from "@/lib/utils"
import { useAccessibility } from "@/context/AccessibilityContext"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { prefs } = useAccessibility()
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        !prefs.reducedMotion && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
