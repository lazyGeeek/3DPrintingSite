import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/ui/navbar'
import { promises as fs } from 'fs'

import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const file = await fs.readFile(process.cwd() + "/public/content.json", "utf-8");
  const data = JSON.parse(file);

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <section className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex justify-center px-4 relative overflow-hidden">
        {/* background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[-80px] top-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute left-[-90px] bottom-[-80px] w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.25),transparent_45%)]" />
        </div>

        <section className="relative z-10 rounded-lg py-8 sm:py-12">
          <div className="
              mx-auto grid max-w-5xl
              grid-cols-1 items-center justify-items-center gap-8
              px-6 sm:px-10 md:px-16
              md:grid-cols-2
              rounded-2xl border border-slate-200/70
              bg-slate-100/90 shadow-2xl backdrop-blur-md px-6 py-8
              dark:border-slate-700/70 dark:bg-slate-800/90
            "
          >
            {/* Text block*/}
            <div className="order-1 max-w-md space-y-4 md:order-1 flex flex-col items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                3D Printing & Hand-Painted Collectibles
              </h2>

              <p className="text-neutral-700 dark:text-neutral-300">
                From digital models to highly detailed physical figures and custom hand-painted statues
              </p>

              <Button
                asChild
                variant="default"
                className="inline-flex items-center justify-center rounded-lg px-12 py-6"
              >
                <Link
                  href="/prints"
                  className="inline-flex items-center justify-center rounded-lg px-12 py-6"
                >
                  See All Prints
                </Link>
              </Button>
            </div>

            {/* Image block */}
            <div className="order-2 md:order-2 flex justify-center">
              <Image
                className="rounded-lg shadow-lg"
                alt="Banner Image"
                width={450}
                height={450}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "450px",
                }}
                loading="eager"
                src={`prints/FacelessVoid/IMG_2460.JPG`}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
