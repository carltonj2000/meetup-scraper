import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meetup Data",
  description: "Meetup Data Collector",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-200 py-4 px-2 flex items-center justify-between">
          <Link href="/">
            <Image width="32" height="32" src="/logo.svg" alt="logo" />
          </Link>
          <h1>Meetup Scraper</h1>
          <div className="text-blue-400 text-lg flex gap-3 items-center">
            <Link href="/stats" className="underline">
              View Stats
            </Link>
          </div>
        </nav>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
