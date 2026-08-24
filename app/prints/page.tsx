import { PrintsList } from '@/components/print/prints-list'
import { PrintType } from '@/components/print/print-type'
import { Background } from '@/components/ui/background'
import { Navbar } from '@/components/ui/navbar'

import { GetPrintsList } from '@/lib/supabase/client'

export default async function PrintsPage() {
  const prints: PrintType[] = await GetPrintsList();

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <section className="min-h-screen bg-slate-100 text-slate-900
                          dark:bg-slate-900 dark:text-slate-100
                          flex justify-center px-6 py-8 relative overflow-visible">
        <Background />
        <div className="pb-8">
          <h1 className="mb-8 text-center text-3xl font-bold leading-none tracking-tight">
            Всі роботи
          </h1>
          {prints?.length ? (
            <PrintsList prints={prints} />
          ) : (
            <p className="mb-8 text-center text-3xl tracking-tight">
              Не вдалося завантажити роботи
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
