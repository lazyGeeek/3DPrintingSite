"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { PrintType } from "@/components/print/print-type"

const CHAR_CUT_NUMBER = 200;

interface Print {
  print: PrintType;
}

export const PrintCard = ({ print }: Print) => {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const description = print.Description;
  const truncatedDescription =
    description && description.length > CHAR_CUT_NUMBER
      ? description.slice(0, CHAR_CUT_NUMBER) + "..."
      : description;

  return (
    <section className={cn("relative block h-full rounded-xl focus-visible:outline-none",
                           "focus-visible:ring-2 focus-visible:ring-ring",
                           "focus-visible:ring-offset-2",
                           "focus-visible:ring-offset-background")}
             style={{ zIndex: isImageHovered ? 60 : 0 }}>

      <Card className={cn("h-full gap-0 border-border/80 bg-card py-0 shadow-sm transition-all",
                          "duration-300 hover:-translate-y-1 hover:border-primary/40",
                          "hover:shadow-2xl hover:shadow-primary/10 overflow-visible")}>

        {print.Images[0] && (
          <div className="relative bg-muted rounded-t-xl w-full h-60"
               onMouseEnter={() => setIsImageHovered(true)}
               onMouseLeave={() => setIsImageHovered(false)}>

            <div className="absolute rounded-t-xl inset-0 overflow-hidden">
              <Image
                src={print.MainImage}
                alt={print.Title}
                fill
                priority
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
                style=
                {{
                  opacity: isImageHovered ? 0.1 : 1,
                  transition: "opacity 300ms, transform 500ms",
                }} />
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-t",
                                 "from-black/20 via-transparent to-transparent")}
                   style={{ opacity: isImageHovered ? 1 : 0 }}
              />
            </div>

            <div className="absolute top-1/2 left-1/2 z-50 pointer-events-none"
              style={{
                width: "65%",
                opacity: isImageHovered ? 1 : 0,
                transform: `translate(-50%, -50%) scale(${isImageHovered ? 1 : 0.95})`,
                transition: "opacity 300ms, transform 500ms",
              }}
            >
              <img
                src={print.MainImage}
                alt={`${print.Title} preview`}
                className="block h-auto w-full rounded-xl object-contain"
              />
            </div>
          </div>

        )}
        <Link href={`/prints/${print.Id}`} >
          <CardHeader className="p-5 pb-2">
            <CardTitle className={cn("line-clamp-2 text-xl font-bold tracking-tight",
                                     "text-card-foreground transition-colors",
                                     "duration-200 group-hover:text-primary")}>
              {print.Title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-grow flex-col justify-between gap-5 p-5 pt-3">
            {truncatedDescription && (
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                {truncatedDescription}
              </p>
            )}

            <Button variant="default"
                    className={cn("mt-auto w-full bg-primary text-primary-foreground shadow-sm",
                                  "transition-colors hover:bg-primary/90")}>
              Детальніше
            </Button>
          </CardContent>
        </Link>
      </Card>
    </section>
  );
};
