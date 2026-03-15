import { promises as fs } from 'fs';
import { PrintDetail } from "@/components/ui/print-detail";

export default async function PrintsPage({
        params,
    }: {
        params: Promise<{ id: string }>;
    }) {
    const file = await fs.readFile(process.cwd() + "/public/content.json", "utf-8");
    const data = JSON.parse(file);

    let print = data[0];
    const { id } = await params;

    data.forEach((elem: any) => {
        if (elem["Id"] == id) {
            print = elem;
        }
    });

    return <PrintDetail print={print} />;
}