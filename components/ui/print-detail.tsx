"use client";

import * as React from "react"
import Image from "next/image"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface Print {
    print: any
}

export const PrintDetail = ({ print }: Print) => {
    const imagesSize = print.Images ? print.Images.length : 0;
    
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentImage, setCurrentImage] = useState<any>(print.Images[currentIndex]);

    const updateImage = (index: number) => {
        if (print && print.Images && print.Images.length > index)
            setCurrentImage(print.Images[index]);
    };

    const scrollPrev = () => {
        let newIndex = 0;
        if (currentIndex <= 0 && imagesSize !== 0)
                newIndex = imagesSize - 1;
        else
            newIndex = currentIndex - 1;

        setCurrentIndex(newIndex);
        updateImage(newIndex);
    };

    const scrollNext = () => {
        let newIndex = 0;
        if (currentIndex < imagesSize - 1)
            newIndex = currentIndex + 1;
        
        setCurrentIndex(newIndex);
        updateImage(newIndex);
    };

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault()
                scrollPrev()
            } else if (event.key === "ArrowRight") {
                event.preventDefault()
                scrollNext()
            }
        },
        [scrollPrev, scrollNext]
    );
    
    return (
        <div onKeyDownCapture={handleKeyDown}>
            <section className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-top">
                { currentImage && (
                    <div className="relative h-screen w-full md:w-3/4 rounded-lg overflow-hidden">
                        <Image
                            src={ `/prints/${print.Id}/${currentImage}` }
                            alt={ print.Title }
                            fill
                            style = {{ objectFit: "contain" }}
                            className="transition duration-300 hover:opacity-90"
                        />
                        <Button
                            data-slot = "carousel-previous"
                            variant = "outline"
                            size = "icon-sm"
                            className = "flex absolute top-1/2 left-3 z-40 items-center justify-center w-10 h-10 bg-gray-200/50 rounded-full hover:bg-gray-300 focus:outline-none transition"
                            // disabled={!canScrollPrev}
                            onClick={scrollPrev}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </Button>

                        <Button
                            data-slot = "carousel-next"
                            variant = "outline"
                            size = "icon-sm"
                            className = "flex absolute top-1/2 right-3 z-40 items-center justify-center w-10 h-10 bg-gray-200/50 rounded-full hover:bg-gray-300 focus:outline-none transition"
                            // disabled={!canScrollPrev}
                            onClick={scrollNext}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </Button>
                    </div>
                ) }
                <div className="md:w-1/4">
                    <h1 className="text-3xl font-bold mb-4">{ print.Title }</h1>
                    <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                        {
                            print.Properties.map((property: string, index: number) => (
                                <li className="text-gray-400" key={index}><span className="text-gray-600">{property}</span></li>
                            ))
                        }
                    </ul>
                </div>
            </section>
            <section className="container mx-auto px-4 py-8 gap-8">
                <h1 className="text-xl font-bold mb-4">Опис</h1>
                {
                    print.Description && (
                        <p className="text-gray-700 mb-4">{ print.Description }</p>
                    )
                }
            </section>
        </div>
    );
};