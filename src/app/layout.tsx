import Nav from "@/components/layout/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/providers/providers";

export const metadata: Metadata = {
  title: "SOPA",
  description: "SOPA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className="min-h-screen bg-primary-200 text-primary-foreground">
          <Nav />
          <main className="min-h-[calc(100vh-4.25rem)] h-0 px-6 sm:px-12 md:px-24 lg:px-32 xl:px-56 py-6 overflow-auto">
            {children}
          </main>
        </body>
      </html>
    </Providers>
  );
}
