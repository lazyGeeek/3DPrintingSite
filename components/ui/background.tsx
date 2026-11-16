"use client";

import { cn } from "@/lib/utils";

export const Background = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={cn(
          "absolute right-[-80px] top-24 w-72 h-72",
          "rounded-full bg-primary/10 blur-3xl",
        )}
      />
      <div
        className={cn(
          "absolute left-[-90px] bottom-[-80px]",
          "w-96 h-96 rounded-full bg-primary/5 blur-3xl",
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-radial-[at_top] from-primary/15 to-transparent to-45%",
          "dark:from-primary/25",
        )}
      />
    </div>
  );
};
