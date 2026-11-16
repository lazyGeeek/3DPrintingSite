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
      (print.Images || []).map((img) => ({
        src: img,
        alt: print.Title,
      })),
    [print.Images, print.Title],
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
    <div onKeyDownCapture={handleKeyDown} tabIndex={0} className="outline-none">
      {/* Top section: image + info */}
      <section className="relative container mx-auto px-4 py-8 bg-card/80">
        {/* background accents */}
        <Background />

        <div className="relative flex flex-col md:flex-row gap-8 rounded-lg p-4">
          {/* Image area (thumbnails + main) */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="order-2 md:order-1 md:w-24 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[70vh]">
              {images.map((img, index) => (
                <button
                  key={img.src + index}
                  type="button"
                  onClick={() => goToIndex(index)}
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
            <div className="order-1 md:order-2 relative flex-1 min-h-[260px] md:min-h-[420px] rounded-md overflow-hidden bg-muted">
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
                    className="absolute top-1/2 left-3 z-20 -translate-y-1/2 w-9 h-9 rounded-full bg-card/80 hover:bg-card border-border text-foreground"
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
          {print.Properties && (
            <div className="md:w-1/3 rounded-2xl border bg-card/90 border-border/70 shadow-2xl backdrop-blur-md px-6 py-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {print.Title}
              </h1>
              <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                {print.Properties.map((property, index) => (
                  <li className="text-muted-foreground" key={index}>
                    <span className="text-foreground">{property}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Description section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="rounded-2xl border bg-card/90 border-border/70 shadow-2xl backdrop-blur-md px-6 py-8">
          <h2 className="text-xl font-bold mb-3 text-foreground">Опис</h2>
          {print.Description && (
            <p className="whitespace-pre-line text-foreground/80">
              {print.Description}
            </p>
          )}
        </div>
      </section>

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
