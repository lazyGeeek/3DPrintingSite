"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid"

import type { HeaderInfo } from '@/components/home/header-info'

type Headers = {
  headers: HeaderInfo[];
}

export function MainHeader({ headers }: Headers) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const visibleSlide = headers.length === 0 ? 0 : activeSlide % headers.length

  useEffect(() => {
    if (headers.length < 2 || isPaused) return

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % headers.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [headers.length, isPaused])

  return (
    <header
      className="relative isolate h-72 overflow-hidden sm:h-96 lg:h-[32rem]">
      {headers.map((header, index) => (
        <div
          key={`${header.Id}-${index}`}
          aria-hidden={index !== visibleSlide}
          className={`absolute inset-0 transition-opacity duration-700 ${index === visibleSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <Image
            src={header.LightImage}
            alt=""
            fill
            sizes="100vw"
            priority={index === 0}
            className="absolute inset-0 size-full object-cover dark:hidden"
          />
          <Image
            src={header.DarkImage || header.LightImage}
            alt=""
            fill
            sizes="100vw"
            priority={index === 0}
            className="absolute inset-0 hidden size-full object-cover dark:block"
          />
        </div>
      ))}

      {headers.length > 1 && <div className="absolute right-6 bottom-6 flex items-center gap-3 sm:right-10 sm:bottom-10">
        <button
          type="button"
          aria-label={isPaused ? "Resume slide change" : "Pause slide change"}
          onClick={() => setIsPaused((paused) => !paused)}
          className={cn("grid size-10 place-items-center rounded-full border",
                        "border-white/50 bg-black/25 text-white backdrop-blur-sm",
                        "transition hover:bg-black/45")}>
          {isPaused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
        </button>
        <div className="flex gap-2" role="tablist">
          {headers.map((header, index) => (
            <button
              key={`${header.Id}-${index}`}
              type="button"
              role="tab"
              aria-selected={index === visibleSlide}
              onClick={() => setActiveSlide(index)}
              className={`h-1.5 rounded-full transition-all ${index === visibleSlide ? "w-8 bg-white" : "w-3 bg-white/55 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>}
    </header>
  )
}
