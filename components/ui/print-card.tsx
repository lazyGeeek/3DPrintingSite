import Link from "next/link"
import Image from "next/image"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'

interface Print {
    print: any;
}

export const PrintCard = ({ print }: Print) => {
    return (
        <Link href = { `/prints/${print.Id}` } className="block h-full">
            <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
                { print.Images && print.Images[0] && (
                    <div className="relative h-60 w-full">
                        <Image
                            src = {`/prints/${print.Id}/${print.Images[0]}`}
                            alt = { print.Title }
                            fill
                            style = {{ objectFit:"cover" }}
                            className="group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"/>
                    </div>
                )}

                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-bold text-gray-800">
                        {print.Title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    { print.Description && (
                        <p className="text-gray-600 text-sm mb-2">{print.description}</p>
                    )}
                    <Button className="mt-4 bg-black text-white">View Details</Button>
                </CardContent>
            </Card>
        </Link>
    );
};