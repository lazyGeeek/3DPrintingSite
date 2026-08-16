import { notFound } from 'next/navigation'

import { Navbar } from '@/components/ui/navbar'
import { PrintDetail } from '@/components/print/print-detail'
import { PrintType } from '@/components/print/print-type'

import { GetPrintsList } from '@/lib/supabase/client'

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const prints = await GetPrintsList();

  return prints.map((print) => ({
    id: String(print.Id),
  }));
}

export default async function PrintsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const prints = await GetPrintsList()

  if (!prints) {
    notFound();
  }

  const { id } = await params;
  const print = prints.find((item: PrintType) => item.Id === id);

  if (!print) {
    notFound();
  }

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <PrintDetail print={print} />
    </main>
  );
}
