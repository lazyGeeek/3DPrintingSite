"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import type { PrintType } from "@/components/print/print-type"

export function PrintsLightbox({ print, onClose, initialImage }: { print: PrintType; onClose: () => void; initialImage?: string }) {
  const images = [print.MainImage, ...(print.Images ?? []).filter((image) => image !== print.MainImage)]
  const [index, setIndex] = useState(() => Math.max(0, images.indexOf(initialImage ?? print.MainImage)))
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + images.length) % images.length)
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % images.length)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose, images.length])

  const reset = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${print.Title} image preview`} className="fixed inset-0 z-[100] flex flex-col bg-slate-200/95 text-slate-900 dark:bg-black/90 dark:text-slate-100">
      <div className="flex items-center justify-between gap-2 bg-white/90 px-4 py-3 dark:bg-slate-900/90">
        <div className="text-sm">{print.Title} · {index + 1}/{images.length}</div>
        <div className="flex items-center gap-2">
          <span className="text-xs">{Math.round(zoom * 100)}%</span>
          <Button type="button" size="icon" variant="outline" className="text-foreground" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(value - 0.1, 0.5))}>−</Button>
          <Button type="button" size="icon" variant="outline" className="text-foreground" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(value + 0.1, 3))}>+</Button>
          <Button type="button" variant="outline" className="text-foreground" onClick={reset}>Reset</Button>
          <Button type="button" size="icon" variant="outline" className="text-foreground" aria-label="Close preview" onClick={onClose}>✕</Button>
        </div>
      </div>
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, y: event.clientY }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current) return
          const { x, y } = drag.current
          setOffset((value) => ({ x: value.x + event.clientX - x, y: value.y + event.clientY - y }))
          drag.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={() => { drag.current = null }}
        onPointerCancel={() => { drag.current = null }}
      >
        {images.length > 1 && (
          <>
            <Button type="button" variant="outline" size="icon" aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-foreground"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)}>‹</Button>
            <Button type="button" variant="outline" size="icon" aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-foreground"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => setIndex((current) => (current + 1) % images.length)}>›</Button>
          </>
        )}
        <Image src={images[index]} alt={`${print.Title} preview`} width={1200} height={800} draggable={false}
          className="max-h-[80vh] max-w-[90vw] select-none object-contain"
          style={{ width: "auto", height: "auto", transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }} />
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto bg-white/90 px-4 py-3 dark:bg-slate-900/90">
          {images.map((image, imageIndex) => (
            <button key={`${image}-${imageIndex}`} type="button" aria-label={`View image ${imageIndex + 1}`}
              onClick={() => setIndex(imageIndex)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border ${index === imageIndex ? "border-accent ring-2 ring-accent/70" : "border-border"}`}>
              <Image src={image} alt="" fill sizes="64px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
