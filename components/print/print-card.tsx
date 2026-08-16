import Link from "next/link"
import Image from "next/image"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { PrintType } from "@/components/print/print-type"

const CHAR_CUT_NUMBER = 200;

interface Print {
  print: PrintType;
}

export const PrintCard = ({ print }: Print) => {
  const description = print.Description;
  const truncatedDescription =
    description && description.length > CHAR_CUT_NUMBER
      ? description.slice(0, CHAR_CUT_NUMBER) + "..."
      : description;

  return (
    <Link
      href={`/prints/${print.Id}`}
      className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="h-full gap-0 overflow-hidden border-border/80 bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
        {print.Images[0] && (
          <div className="relative h-60 w-full overflow-hidden bg-muted">
            <Image
              src={print.Images[0]}
              alt={print.Title}
              fill
              priority
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}

        <CardHeader className="p-5 pb-2">
          <CardTitle className="line-clamp-2 text-xl font-bold tracking-tight text-card-foreground transition-colors duration-200 group-hover:text-primary">
            {print.Title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col justify-between gap-5 p-5 pt-3">
          {truncatedDescription && (
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {truncatedDescription}
            </p>
          )}

          <Button
            variant="default"
            className="mt-auto w-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            View details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};
