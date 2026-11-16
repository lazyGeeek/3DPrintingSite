"use client";

import * as React from "react";
import Image from "next/image";
import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { PrintType } from "@/components/print/print-type";
import { PrintsLightbox } from "@/components/print/prints-lightbox";

type PrintImage = {
  src: string;
  alt: string;
};

export const PrintDetail: React.FC<{ print: PrintType }> = ({ print }) => {
  const images: PrintImage[] = React.useMemo(
    () =>
      Array.from(
        new Set([print.MainImage, ...(print.Images || [])].filter(Boolean)),
      ).map((img) => ({
        src: img,
        alt: print.Title,
      })),
    [print.MainImage, print.Images, print.Title],
  );

  const imagesSize = images.length;
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const currentImage = images[currentIndex];

  const clampIndex = React.useCallback(
    (index: number) => {
      if (imagesSize === 0) return 0;
      if (index < 0) return imagesSize - 1;
      if (index >= imagesSize) return 0;
      return index;
    },
    [imagesSize],
  );

  const goToIndex = React.useCallback(
    (index: number) => {
      if (!imagesSize) return;
      setCurrentIndex(clampIndex(index));
    },
    [clampIndex, imagesSize],
  );

  const scrollPrev = React.useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [currentIndex, goToIndex]);

  const scrollNext = React.useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [currentIndex, goToIndex]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isLightboxOpen) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      } else if (event.key === "Escape" && isLightboxOpen) {
        event.preventDefault();
        setIsLightboxOpen(false);
      }
    },
    [scrollPrev, scrollNext, isLightboxOpen],
  );

  const openLightbox = () => {
    if (!currentImage) return;
    setIsLightboxOpen(true);
  };

  return (
    <div
      onKeyDownCapture={handleKeyDown}
      className="relative min-h-screen bg-background px-8 py-8 text-foreground sm:px-12 sm:py-12"
    >
      <Background />
      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-8">
        <section className="grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Image area (thumbnails + main) */}
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row">
            {/* Thumbnails */}
            <div className="order-2 flex min-w-0 gap-2 overflow-x-auto p-1 sm:order-1 sm:max-h-[32rem] sm:w-24 sm:shrink-0 sm:flex-col sm:overflow-y-auto">
              {images.map((img, index) => (
                <button
                  key={img.src + index}
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Переглянути зображення ${index + 1}`}
                  aria-pressed={index === currentIndex}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-md
                              overflow-hidden transition border ${
                                index === currentIndex
                                  ? "border-accent ring-2 ring-accent/60"
                                  : "border-border"
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
            <div className="order-1 relative h-72 min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:order-2 sm:h-[32rem] sm:flex-1">
              {currentImage && (
                <>
                  <Image
                    src={currentImage.src}
                    alt={currentImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1280px) 720px, (min-width: 1024px) 60vw, 100vw"
                    className="object-contain cursor-zoom-in"
                    loading="eager"
                    onClick={openLightbox}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-3 z-20 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 hover:bg-card border-border text-foreground"
                    aria-label="Попереднє зображення"
                    disabled={imagesSize < 2}
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
                    className="absolute top-1/2 right-3 z-20 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 hover:bg-card border-border text-foreground"
                    aria-label="Наступне зображення"
                    disabled={imagesSize < 2}
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

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs bg-accent/80 text-accent-foreground">
                    {imagesSize > 0
                      ? `${currentIndex + 1} / ${imagesSize}`
                      : "0 / 0"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info area – right on desktop, under images on mobile */}
          <div className="min-w-0 break-words rounded-2xl border border-border/70 bg-card/90 px-6 py-8 text-card-foreground shadow-sm backdrop-blur-md">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {print.Title}
            </h1>
            {Boolean(print.Properties?.length) && (
              <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                {print.Properties?.map((property, index) => (
                  <li className="text-muted-foreground" key={index}>
                    <span className="text-foreground">{property}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Description section */}
        <section className="min-w-0 break-words rounded-2xl border border-border/70 bg-card/90 px-6 py-8 text-card-foreground shadow-sm backdrop-blur-md">
          <h2 className="text-xl font-bold mb-3 text-foreground">Опис</h2>
          {print.Description && (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {print.Description}
            </p>
          )}
        </section>
      </div>

      {isLightboxOpen && currentImage && (
        <PrintsLightbox
          print={print}
          initialImage={currentImage.src}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};
