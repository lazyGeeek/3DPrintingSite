import { PrintsList } from '@/components/print/prints-list'
import { PrintType } from '@/components/print/print-type'
import { Navbar } from '@/components/ui/navbar'

import { GetPrintsList } from '@/lib/supabase/client'

export default async function PrintsPage() {
  const prints: PrintType[] = await GetPrintsList();

  return (
    <main>
      <section>
        <Navbar />
      </section>
      <section className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex justify-center px-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-[-80px] top-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute left-[-90px] bottom-[-80px] w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.15),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.25),transparent_45%)]" />
        </div>
        <div className="pb-8">
          <h1 className="mb-8 text-center text-3xl font-bold leading-none tracking-tight">
            All prints
          </h1>
          {prints?.length ? (
            <PrintsList prints={prints} />
          ) : (
            <p className="mb-8 text-center text-3xl tracking-tight">
              No prints yet
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
