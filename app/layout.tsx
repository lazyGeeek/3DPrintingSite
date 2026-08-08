import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";

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
    <html lang="en" className={cn("font-sans", nunitoSans.variable)}>
      <body className="flex min-h-full flex-col bg-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
