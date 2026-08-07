"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

type PrintImage = {
  src: string
  alt: string
}

export interface PrintType {
  Id: string
  Title: string
  Description?: string
  Properties: string[]
  Images: string[]
}

interface PrintProps {
  print: PrintType
}

export const PrintDetail: React.FC<PrintProps> = ({ print }) => {
  const images: PrintImage[] = React.useMemo(
    () =>
      (print.Images || []).map((img) => ({
        src: `/prints/${print.Id}/${img}`,
        alt: print.Title,
      })),
    [print.Images, print.Id, print.Title]
  )

  const imagesSize = images.length
  const [currentIndex, setCurrentIndex] = React.useState<number>(0)

  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)
  const [zoom, setZoom] = React.useState(1) // 1 = 100%
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })

  // for drag/pan
  const isDraggingRef = React.useRef(false)
  const lastPosRef = React.useRef({ x: 0, y: 0 })

  // for swipe on mobile
  const touchStartXRef = React.useRef<number | null>(null)
  const touchEndXRef = React.useRef<number | null>(null)

  const currentImage = images[currentIndex]

  const clampIndex = React.useCallback(
    (index: number) => {
      if (imagesSize === 0) return 0
      if (index < 0) return imagesSize - 1
      if (index >= imagesSize) return 0
      return index
    },
    [imagesSize]
  )

  const goToIndex = React.useCallback(
    (index: number) => {
      if (!imagesSize) return
      setCurrentIndex(clampIndex(index))
    },
    [clampIndex, imagesSize]
  )

  const scrollPrev = React.useCallback(() => {
    goToIndex(currentIndex - 1)
  }, [currentIndex, goToIndex])

  const scrollNext = React.useCallback(() => {
    goToIndex(currentIndex + 1)
  }, [currentIndex, goToIndex])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      } else if (event.key === "Escape" && isLightboxOpen) {
        event.preventDefault()
        setIsLightboxOpen(false)
      }
    },
    [scrollPrev, scrollNext, isLightboxOpen]
  )

  // zoom controls
  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.1, 3)) // allow up to 300%
  }

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.1, 0.5)) // min 50%
  }

  const handleResetZoom = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  // drag / pan handlers for lightbox
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    lastPosRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - lastPosRef.current.x
    const dy = e.clientY - lastPosRef.current.y
    lastPosRef.current = { x: e.clientX, y: e.clientY }
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isDraggingRef.current = false
  }

  // touch swipe + pan
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    touchStartXRef.current = touch.clientX
    touchEndXRef.current = touch.clientX
    isDraggingRef.current = true
    lastPosRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    touchEndXRef.current = touch.clientX

    if (!isDraggingRef.current) return
    const dx = touch.clientX - lastPosRef.current.x
    const dy = touch.clientY - lastPosRef.current.y
    lastPosRef.current = { x: touch.clientX, y: touch.clientY }
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
    const startX = touchStartXRef.current
    const endX = touchEndXRef.current
    if (startX !== null && endX !== null) {
      const delta = endX - startX
      const threshold = 50 // px
      if (delta > threshold) {
        scrollPrev()
      } else if (delta < -threshold) {
        scrollNext()
      }
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  const openLightbox = () => {
    if (!currentImage) return
    setIsLightboxOpen(true)
    handleResetZoom()
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  return (
    <div onKeyDownCapture={handleKeyDown} tabIndex={0} className="outline-none">
      {/* Top section: image + info */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 bg-zinc-100/80 rounded-lg p-4">
          {/* Image area (thumbnails + main) */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="order-2 md:order-1 md:w-24 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[70vh]">
              {images.map((img, index) => (
                <button
                  key={img.src + index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 border rounded-md overflow-hidden transition ${
                    index === currentIndex
                      ? "border-purple-500 ring-2 ring-purple-500/60"
                      : "border-zinc-300"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 md:order-2 relative flex-1 min-h-[260px] md:min-h-[420px] rounded-md overflow-hidden bg-black/5">
              {currentImage && (
                <>
                  <Image
                    src={currentImage.src}
                    alt={currentImage.alt}
                    fill
                    priority
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-contain cursor-zoom-in"
                    loading="eager"
                    onClick={openLightbox}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-3 z-20 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-100/80 hover:bg-zinc-200"
                    onClick={scrollPrev}
                  >
                    <svg
                      className="w-5 h-5 text-zinc-800"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M15 18l-6-6 6-6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-3 z-20 -translate-y-1/2 w-9 h-9 rounded-full bg-zinc-100/80 hover:bg-zinc-200"
                    onClick={scrollNext}
                  >
                    <svg
                      className="w-5 h-5 text-zinc-800"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900/70 text-xs text-zinc-50">
                    {imagesSize > 0 ? `${currentIndex + 1} / ${imagesSize}` : "0 / 0"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info area – right on desktop, under images on mobile */}
          <div className="md:w-1/3">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{print.Title}</h1>
            <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
              {print.Properties.map((property, index) => (
                <li className="text-zinc-500" key={index}>
                  <span className="text-zinc-700">{property}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-zinc-100/80 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-bold mb-3">Опис</h2>
          {print.Description && (
            <p className="text-zinc-700 whitespace-pre-line">{print.Description}</p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {isLightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80"
          role="dialog"
          aria-modal="true"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/70 text-zinc-100">
            <div className="text-sm">
              {print.Title} · {currentIndex + 1}/{imagesSize}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">{Math.round(zoom * 100)}%</span>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 border-zinc-500 bg-zinc-800 text-zinc-100"
                onClick={handleZoomOut}
              >
                -
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 border-zinc-500 bg-zinc-800 text-zinc-100"
                onClick={handleZoomIn}
              >
                +
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-8 px-3 text-xs border-zinc-500 bg-zinc-800 text-zinc-100"
                onClick={handleResetZoom}
              >
                Reset
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                className="h-8 w-8 border-zinc-500 bg-zinc-800 text-zinc-100"
                onClick={closeLightbox}
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Image area */}
          <div
            className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Prev / Next on sides */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2 z-50 rounded-full bg-zinc-900/70 border-zinc-500 text-zinc-100"
              onClick={scrollPrev}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2 z-50 rounded-full bg-zinc-900/70 border-zinc-500 text-zinc-100"
              onClick={scrollNext}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M9 6l6 6-6 6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: isDraggingRef.current ? "none" : "transform 0.1s ease-out",
                }}
              >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={800}
                style={{ width: "auto", height: "auto", maxWidth: "90vw", maxHeight: "80vh" }}
                className="object-contain select-none"
                loading="eager"
                draggable={false}
                priority
              />
              </div>
            </div>
          </div>

          {/* Thumbnail strip inside lightbox */}
          <div className="w-full px-4 py-3 bg-zinc-900/80 flex gap-2 overflow-x-auto justify-center">
            {images.map((img, index) => (
              <button
                key={img.src + index}
                type="button"
                onClick={() => goToIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border ${
                  index === currentIndex ? "border-purple-400 ring-2 ring-purple-400/70" : "border-zinc-600"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="64px"
                  className="object-contain"
                  loading="eager"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}