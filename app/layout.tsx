import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider'

const nunitoSans = Nunito_Sans({variable:'--font-sans'});

export const metadata: Metadata = {
  title: "3D Printing",
  description: "Shows printed 3D models",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", nunitoSans.variable)} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
