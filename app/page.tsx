import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/carousel'
import { promises as fs } from 'fs'

import Link from "next/link"
import Image from "next/image"

export default async function Home() {
    const file = await fs.readFile(process.cwd() + "/public/content.json", "utf-8");
    const data = JSON.parse(file);

    return (
        <div>
            <section className="rounded bg-neutral-100 py-8 sm:py-12">
                <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Welcome to 3D Print Galery
                        </h2>
                        <p className="text-neutral-600">
                            Latest models
                        </p>
                        <Button
                            asChild
                            variant="default"
                            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white">
                            <Link
                                href="/prints"
                                className="inline-flex items-center justify-center rounded-full px-6 py-3">
                                    Sholl All Prints
                            </Link>
                        </Button>
                    </div>
                    <Image
                        alt = "Banner Image"
                        width = { 450 }
                        height = { 450 }
                        src = { "/prints/" + data[0].Id + "/" + data[0].Images[0] }
                    />
                </div>
            </section>
            <section className="py-8">
                <Carousel prints={data}/>
            </section>
        </div>
    );
}
