"use client"

import Image from "next/image"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { PrintType } from "@/components/print/print-type"

type ShowcaseCarouselProps = {
  prints: PrintType[]
}

const AUTO_SCROLL_SPEED = 60
const BUFFER_GROUP_COUNT = 3

export const ShowcaseCarousel = ({ prints }: ShowcaseCarouselProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isRecyclingRef = useRef(false)
  const isMouseInsideRef = useRef(false)
  const isPointerActiveRef = useRef(false)
  const initialCardIndexRef = useRef<number | null>(null)
  const previewCardRef = useRef<HTMLDivElement | null>(null)
  const [cardIds, setCardIds] = useState([0])
  const [preview, setPreview] = useState<{
    print: PrintType
    left: number
    top: number
    height: number
    width: number
  } | null>(null)
  const isVisible = prints.length >= 3

  useEffect(() => {
    const dismissPreview = (event: Event) => {
      if (
        event.type === "scroll" &&
        event.target === scrollAreaRef.current
      ) return

      previewCardRef.current = null
      setPreview(null)
    }

    window.addEventListener("scroll", dismissPreview, true)
    window.addEventListener("resize", dismissPreview)

    return () => {
      window.removeEventListener("scroll", dismissPreview, true)
      window.removeEventListener("resize", dismissPreview)
    }
  }, [])

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current
    const firstCard = scrollArea?.children.item(0) as HTMLElement | null

    if (!scrollArea || !firstCard) return

    const gap = Number.parseFloat(window.getComputedStyle(scrollArea).columnGap) || 0
    const cardStep = firstCard.offsetWidth + gap
    const visibleCardCount = Math.ceil(scrollArea.clientWidth / cardStep) + 1

    initialCardIndexRef.current = visibleCardCount
    setCardIds(
      Array.from(
        { length: visibleCardCount * BUFFER_GROUP_COUNT },
        (_, index) => index - visibleCardCount
      )
    )
  }, [isVisible])

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current
    const initialCardIndex = initialCardIndexRef.current

    if (!scrollArea || initialCardIndex === null) return

    const firstMiddleCard = scrollArea.children.item(initialCardIndex) as HTMLElement | null

    if (!firstMiddleCard) return

    scrollArea.scrollLeft = firstMiddleCard.offsetLeft
    initialCardIndexRef.current = null
  }, [cardIds, isVisible])

  useEffect(() => {
    let previousTime = performance.now()
    let animationFrame: number

    const autoScroll = (currentTime: number) => {
      const scrollArea = scrollAreaRef.current
      const elapsedSeconds = Math.min(currentTime - previousTime, 50) / 1000

      if (
        scrollArea &&
        !isMouseInsideRef.current &&
        !isPointerActiveRef.current &&
        !isRecyclingRef.current
      ) {
        scrollArea.scrollLeft += AUTO_SCROLL_SPEED * elapsedSeconds
      }

      previousTime = currentTime
      animationFrame = window.requestAnimationFrame(autoScroll)
    }

    animationFrame = window.requestAnimationFrame(autoScroll)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  const keepScrollingInfinite = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollArea = event.currentTarget

    if (isRecyclingRef.current) return

    const firstCard = scrollArea.children.item(0) as HTMLElement | null
    const secondCard = scrollArea.children.item(1) as HTMLElement | null

    if (!firstCard || !secondCard) return

    const cardStep = secondCard.offsetLeft - firstCard.offsetLeft
    const reachedStart = scrollArea.scrollLeft <= 1
    const reachedEnd =
      scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth - 1

    if (!reachedStart && !reachedEnd) return

    isRecyclingRef.current = true
    scrollArea.style.scrollBehavior = "auto"

    if (reachedStart) {
      flushSync(() => {
        setCardIds((current) => [current[0] - 1, ...current.slice(0, -1)])
      })
      scrollArea.scrollLeft += cardStep
    } else {
      flushSync(() => {
        setCardIds((current) => [...current.slice(1), current.at(-1)! + 1])
      })
      scrollArea.scrollLeft -= cardStep
    }

    window.requestAnimationFrame(() => {
      scrollArea.style.removeProperty("scroll-behavior")
      isRecyclingRef.current = false
    })
  }

  const scrollByCard = (direction: number) => {
    previewCardRef.current = null
    setPreview(null)
    const scrollArea = scrollAreaRef.current
    const firstCard = scrollArea?.children.item(0) as HTMLElement | null

    if (!scrollArea || !firstCard) return

    const gap = Number.parseFloat(window.getComputedStyle(scrollArea).columnGap) || 0
    scrollArea.scrollBy({
      left: direction * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <div
      className="group/showcase relative overflow-hidden rounded-2xl"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") isMouseInsideRef.current = true
      }}
      onPointerLeave={() => {
        isMouseInsideRef.current = false
        previewCardRef.current = null
        setPreview(null)
      }}
    >
    <div
      ref={scrollAreaRef}
      className={cn(
        "relative flex gap-2 overflow-hidden rounded-2xl",
        "select-none",
        "border border-slate-200/70 bg-slate-200/90 p-2 shadow-2xl",
        "backdrop-blur-md [scrollbar-width:none]",
        "[overflow-anchor:none]",
        "dark:border-slate-700/70 dark:bg-slate-900/90",
        "[&::-webkit-scrollbar]:hidden"
      )}
      onPointerCancel={() => {
        isPointerActiveRef.current = false
      }}
      onPointerDown={(event) => {
        isPointerActiveRef.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onLostPointerCapture={() => {
        isPointerActiveRef.current = false
      }}
      onPointerUp={() => {
        isPointerActiveRef.current = false
      }}
      onScroll={keepScrollingInfinite}
    >
      {cardIds.map((cardId) => {
        const printIndex =
          ((cardId % prints.length) + prints.length) % prints.length

        const showPreview = (event: React.PointerEvent<HTMLDivElement>) => {
          if (event.pointerType !== "mouse") return
          isMouseInsideRef.current = true

          const card = event.currentTarget
          if (previewCardRef.current === card) return

          const scrollArea = scrollAreaRef.current
          if (!scrollArea) return

          const rect = card.getBoundingClientRect()
          const bounds = scrollArea.getBoundingClientRect()
          previewCardRef.current = card

          setPreview({
            print: prints[printIndex],
            height: Math.min(rect.height, window.innerHeight - 16),
            width: Math.min(rect.width, window.innerWidth - 16),
            left: rect.left - bounds.left + rect.width / 2,
            top: rect.top - bounds.top + rect.height / 2,
          })
        }

        return (
          <Card
            key={cardId}
            onPointerEnter={showPreview}
            onPointerMove={showPreview}
            onPointerLeave={() => {
              previewCardRef.current = null
              setPreview(null)
            }}
            className={cn(
              "relative h-50 w-96 shrink-0 gap-0 p-0 shadow-lg",
              "border border-slate-200/70 dark:border-slate-700/70"
            )}
          >
            <Image
              fill
              alt={prints[printIndex].Title}
              className="pointer-events-none object-cover"
              sizes="384px"
              src={prints[printIndex].MainImage}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/30 p-4">
              <p className="rounded-lg bg-black/60 px-4 py-2 text-center text-xl font-semibold text-white drop-shadow-lg">
                {prints[printIndex].Title}
              </p>
            </div>
          </Card>
        )
      })}
    </div>
      {preview && (
        <div
          className="pointer-events-none absolute z-10 overflow-hidden rounded-xl bg-slate-950/60 shadow-2xl ring-1 ring-white/20"
          style={{
            left: preview.left,
            top: preview.top,
            height: preview.height,
            width: preview.width,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Image
            width={1200}
            height={800}
            src={preview.print.MainImage}
            alt={`${preview.print.Title} preview`}
            sizes="461px"
            className="block h-full w-full object-contain"
          />
        </div>
      )}
      {([-1, 1] as const).map((direction) => {
        const Icon = direction === -1 ? ChevronLeftIcon : ChevronRightIcon

        return (
          <button
            key={direction}
            type="button"
            aria-label={direction === -1 ? "Scroll left" : "Scroll right"}
            className={cn(
              "absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-900/80 p-2 text-white shadow-lg transition-opacity hover:bg-slate-900",
              "invisible opacity-0 [@media(hover:hover)]:group-hover/showcase:visible [@media(hover:hover)]:group-hover/showcase:opacity-100",
              direction === -1 ? "left-4" : "right-4"
            )}
            onClick={() => scrollByCard(direction)}
          >
            <Icon aria-hidden="true" className="size-6" />
          </button>
        )
      })}
    </div>
  )
}
