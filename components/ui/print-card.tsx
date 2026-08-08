import Link from "next/link"
import Image from "next/image"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { PrintType } from "@/components/ui/print-type"

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
        <Link href = { `prints/${print.Id}` } className="block h-full">
            <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
                {print.Images && print.Images[0] && (
                    <div className="relative h-60 w-full">
                        <Image
                            src={`prints/${print.Id}/${print.Images[0]}`}
                            alt={print.Title}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                            style={{ objectFit: "cover" }}
                            loading="eager"
                            className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
                        />
                    </div>
                )}

                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold text-gray-800">
                        {print.Title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    { truncatedDescription && (
                        <p className="text-gray-600 text-sm mb-2">{truncatedDescription}</p>
                    )}
                    <Button className="mt-4 bg-black text-white">View Details</Button>
                </CardContent>
            </Card>
        </Link>
    );
};