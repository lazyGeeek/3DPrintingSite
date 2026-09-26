"use client"

import Image from "next/image"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ShowcaseCarouselProps = {
  images: string[]
}

const DRAG_SPEED = 1
const AUTO_SCROLL_SPEED = 60
const BUFFER_GROUP_COUNT = 3

export const ShowcaseCarousel = ({ images }: ShowcaseCarouselProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })
  const isRecyclingRef = useRef(false)
  const isMouseInsideRef = useRef(false)
  const isPointerActiveRef = useRef(false)
  const initialCardIndexRef = useRef<number | null>(null)
  const [cardIds, setCardIds] = useState([0])

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
  }, [])

  useLayoutEffect(() => {
    const scrollArea = scrollAreaRef.current
    const initialCardIndex = initialCardIndexRef.current

    if (!scrollArea || initialCardIndex === null) return

    const firstMiddleCard = scrollArea.children.item(initialCardIndex) as HTMLElement | null

    if (!firstMiddleCard) return

    scrollArea.scrollLeft = firstMiddleCard.offsetLeft
    initialCardIndexRef.current = null
  }, [cardIds])

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

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    isPointerActiveRef.current = true

    if (event.pointerType !== "mouse" || event.button !== 0) return

    dragRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const drag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDragging) return

    event.currentTarget.scrollLeft =
      dragRef.current.scrollLeft -
      (event.clientX - dragRef.current.startX) * DRAG_SPEED
  }

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = false
    isPointerActiveRef.current = false

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

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
      dragRef.current.scrollLeft += cardStep
    } else {
      flushSync(() => {
        setCardIds((current) => [...current.slice(1), current.at(-1)! + 1])
      })
      scrollArea.scrollLeft -= cardStep
      dragRef.current.scrollLeft -= cardStep
    }

    window.requestAnimationFrame(() => {
      scrollArea.style.removeProperty("scroll-behavior")
      isRecyclingRef.current = false
    })
  }

  if (images.length === 0) return null

  return (
    <div
      ref={scrollAreaRef}
      className={cn(
        "flex cursor-grab gap-2 overflow-x-auto overflow-y-hidden rounded-2xl",
        "select-none active:cursor-grabbing",
        "border border-slate-200/70 bg-slate-100/90 p-2 shadow-2xl",
        "backdrop-blur-md [scrollbar-width:none]",
        "[overflow-anchor:none]",
        "dark:border-slate-700/70 dark:bg-slate-800/90",
        "[&::-webkit-scrollbar]:hidden"
      )}
      onMouseEnter={() => {
        isMouseInsideRef.current = true
      }}
      onMouseLeave={() => {
        isMouseInsideRef.current = false
      }}
      onPointerCancel={stopDragging}
      onPointerDown={startDragging}
      onPointerMove={drag}
      onPointerUp={stopDragging}
      onScroll={keepScrollingInfinite}
    >
      {cardIds.map((cardId) => {
        const imageIndex =
          ((cardId % images.length) + images.length) % images.length

        return (
          <Card
            key={cardId}
            className={cn(
              "relative h-50 w-96 shrink-0 gap-0 p-0 shadow-lg",
              "border border-slate-200/70 dark:border-slate-700/70"
            )}
          >
            <Image
              fill
              alt={`Showcase image ${imageIndex + 1}`}
              className="pointer-events-none object-cover"
              sizes="384px"
              src={images[imageIndex]}
            />
          </Card>
        )
      })}
    </div>
  )
}
