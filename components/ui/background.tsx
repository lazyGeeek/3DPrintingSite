"use client"

import { cn } from "@/lib/utils"

export const Background = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className={cn("absolute right-[-80px] top-24 w-72 h-72",
                         "rounded-full bg-indigo-500/10 blur-3xl")} />
      <div className={cn("absolute left-[-90px] bottom-[-80px]",
                         "w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl")} />
      <div className={cn("absolute inset-0",
                         "bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15),transparent_45%)]",
                         "dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.25),transparent_45%)]")} />
    </div>
  )
}