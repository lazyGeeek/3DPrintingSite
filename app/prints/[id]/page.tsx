import { promises as fs } from 'fs';
import {
    PrintDetail,
    PrintType
} from "@/components/ui/print-detail";

interface PageParams {
    id: string;
}

async function getPrints(): Promise<PrintType[]> {
    const file = await fs.readFile(
        process.cwd() + "/public/content.json",
        "utf-8"
    );

    return JSON.parse(file);
}

// This runs during `next build`
export async function generateStaticParams(): Promise<PageParams[]> {
    const prints = await getPrints();

    return prints.map((print) => ({
        id: print.Id,
    }));
}

export default async function PrintsPage({
        params,
    }: {
        params: Promise<PageParams>;
    }) {

    const { id } = await params;
    const prints = await getPrints();

    const print = prints.find((item: PrintType) => item.Id === id)!;

    return <PrintDetail print={print} />;
}