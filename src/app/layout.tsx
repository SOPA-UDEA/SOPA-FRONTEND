import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/providers/providers";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "SOPA",
  description: "SOPA",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="es">
        <body className="min-h-screen bg-background text-primary-foreground font-sans">
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Principal content */}
            <div className="flex-1 overflow-auto">
              {/* Site content */}
              <main className="px-1 sm:px-3 md:px-6 lg:px-8 xl:px-14 py-6">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </Providers>
  );
}