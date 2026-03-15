import { promises as fs } from 'fs';
import { PrintsList } from "@/components/ui/prints-list";

export default async function PrintsPage() {
    const file = await fs.readFile(process.cwd() + "/public/content.json", "utf-8");
    const data = JSON.parse(file);

    return (
        <div className="pb-8">
            <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
                All prints
            </h1>
            <PrintsList prints = { data } />
        </div>
    );
}