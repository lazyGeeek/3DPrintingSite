"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

import Image from "next/image";

interface Prints {
    prints: any[];
    amount: number;
}

export const LatestPrintsCarousel = ({prints, amount}: Prints) => {
    const [current, setCurrent] = useState<number>(0);

    const numberOfIterItems = prints.length > amount ? amount : prints.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % numberOfIterItems);
        }, 3000);

        return () => clearInterval(interval);
    }, [numberOfIterItems]);

    const currentModel = prints[current];

    return (
        <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300">
            {
                currentModel.Images && currentModel.Images[0] && (
                    <div className="relative h-80 w-full">
                        <Image
                            alt = { currentModel.Title }
                            src = { "/prints/" + currentModel.Id + "/" + currentModel.Images[0] }
                            fill
                            style = {{ objectFit:"cover" }}
                            loading="eager"
                            className="transition-opacity duration-500 ease-in-out"/>
                    </div>
                )
            }
            <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <CardTitle className="text-3xl font-bold text-white mb-2 bg-zinc-800/80 px-4 py-2 rounded-md">
                    { currentModel.Title }
                </CardTitle>
            </CardContent>
        </Card>
    );
};