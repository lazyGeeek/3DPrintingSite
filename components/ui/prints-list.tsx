import { PrintCard } from "@/components/ui/print-card"

interface Prints {
    prints: any[];
}

export const PrintsList = ({ prints }: Prints) => {
    return (
        <div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                { prints.map((print, key)=>{
                    return (
                        <li key={key}>
                            <PrintCard print={print} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};