import Image from "next/image"

interface Print {
    print: any
}

export const PrintDetail = ({ print }: Print) => {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
            { print.Images && print.Images[0] && (
                <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden">
                    <Image
                        src={ `/prints/${print.Id}/${print.Images[0]}` }
                        alt={ print.Title }
                        fill
                        style = {{ objectFit:"cover" }}
                        className="transition duration-300 hover:opacity-90"
                    />
                </div>
                ) }
            <div className="md:w-1/2">
                <h1 className="text-3xl font-bold mb-4">{ print.Title }</h1>
                { print.Description && (
                    <p className="text-gray-700 mb-4">{ print.Description }</p>
                )}
            </div>
        </div>
    );
};