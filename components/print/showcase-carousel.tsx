"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

import Image from "next/image";

interface ShowcaseCarouselProps {
  prints: string[];
  amount: number;
}

export const ShowcaseCarousel = ({ prints, amount }: ShowcaseCarouselProps) => {
  const [current, setCurrent] = useState<number>(0);

  const numberOfIterItems = prints.length > amount ? amount : prints.length;

  useEffect(() => {
    if (numberOfIterItems <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % numberOfIterItems);
    }, 3000);

    return () => clearInterval(interval);
  }, [numberOfIterItems]);

  const currentImage = prints[current % numberOfIterItems];

  if (!currentImage) return null;

  return (
    <Card className="relative h-80 w-full overflow-hidden rounded-none border-0 p-0 shadow-none">
      <div className="relative h-full w-full">
        {prints.slice(0, numberOfIterItems).map((image, index) => (
          <Image
            key={`${image}-${index}`}
            alt={
              index === current % numberOfIterItems
                ? `Showcase image ${index + 1}`
                : ""
            }
            aria-hidden={index !== current % numberOfIterItems}
            src={image}
            fill
            sizes="100vw"
            loading="eager"
            className={`object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
              index === current % numberOfIterItems
                ? "opacity-100"
                : "opacity-0"
            }`}
          />
        ))}
      </div>
    </Card>
  );
};
