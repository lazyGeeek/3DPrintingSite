"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";

import Image from "next/image";

interface Prints {
    models: any[];
}

export const Carousel = ({models}: Prints) => {
    const [current, setCurrent] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % models.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [models.length]);

    const currentModel = models[current];

    return (
        <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300">
            {
                currentModel.Images && currentModel.Images[0] && (
                    <div className="relative h-80 w-full">
                        <Image
                            alt = { currentModel.Title }
                            src = { "/" + currentModel.Images[0] }
                            fill
                            style = {{ objectFit:"cover" }}
                            className="transition-opacity duration-500 ease-in-out"/>
                    </div>
                )
            }
            <CardContent className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <CardTitle className="text-3xl font-bold text-white mb-2">
                    { currentModel.Title }
                </CardTitle>
            </CardContent>
        </Card>
    );
};