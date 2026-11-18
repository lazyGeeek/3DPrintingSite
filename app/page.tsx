import Link from "next/link";
import Image from "next/image";

import { Background } from "@/components/ui/background";
import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/home/main-header";
import { PrintsCarousel } from "@/components/print/prints-carousel";
import { ShowcaseCarousel } from "@/components/print/showcase-carousel";

import {
  createSupabaseClient,
  GetHeadersList,
  GetShowcaseImages,
  GetPrintsList,
} from "@/lib/supabase/client";

export default async function Home() {
  const { data: mainImage } = createSupabaseClient()
    .storage.from("faceless_void")
    .getPublicUrl("IMG_2460.JPG");

  const headers = await GetHeadersList();
  const prints = await GetPrintsList();
  const showcaseImages = await GetShowcaseImages();

  return (
    <main>
      {headers?.length > 0 && <MainHeader headers={headers} />}
      <section className="home-section-colors min-h-screen bg-background text-foreground flex justify-center px-4 relative">
        {/* background accents */}
        <Background />

        <section className="relative z-10 w-full min-w-0 rounded-lg py-8 sm:py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center justify-items-center gap-8 px-6 sm:px-10 md:px-16 md:grid-cols-2 rounded-2xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-md py-8">
            {/* Text block*/}
            <div className="order-1 max-w-md space-y-4 md:order-1 flex flex-col items-center text-center md:items-start md:text-left">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                3D-друк та колекційні мініатюри ручного розпису
              </h2>

              <p className="text-muted-foreground">
                Від цифрових моделей до готових високодеталізованих фігур та
                ексклюзивного розпису.
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
            {prints.length >= 3 && (
              <div className="order-3 w-full min-w-0 md:col-span-2">
                <PrintsCarousel prints={prints} />
              </div>
            )}
          </div>
        </section>
      </section>
      {showcaseImages.length >= 3 && (
        <section className="home-section-colors bg-background py-8">
          <ShowcaseCarousel
            prints={showcaseImages}
            amount={showcaseImages.length}
          />
        </section>
      )}
    </main>
  );
}
