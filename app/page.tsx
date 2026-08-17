import { Background } from '@/components/ui/background'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/ui/navbar'

import { createSupabaseClient } from '@/lib/supabase/client'

import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const { data: mainImage } = createSupabaseClient().storage.
                              from('faceless_void').
                              getPublicUrl('IMG_2460.JPG');

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <section className="min-h-screen bg-slate-100 text-slate-900
                          dark:bg-slate-900 dark:text-slate-100 flex
                          justify-center px-4 relative overflow-hidden">
        {/* background accents */}
        <Background />

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
            <div className="order-1 max-w-md space-y-4 md:order-1 flex flex-col
                            items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                3D-друк та колекційні мініатюри ручного розпису
              </h2>

              <p className="text-neutral-700 dark:text-neutral-300">
                Від цифрових моделей до готових високодеталізованих фігур та ексклюзивного розпису.
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
                  Відкрити галерею
                </Link>
              </Button>
            </div>

            {/* Image block */}
            <div className="order-2 md:order-2 flex justify-center">
              <Image
                className="rounded-lg shadow-lg"
                alt="Main Image"
                width={450}
                height={450}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  maxHeight: "450px",
                }}
                loading="eager"
                src={mainImage.publicUrl}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
