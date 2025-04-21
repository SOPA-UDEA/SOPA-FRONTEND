import Nav from "@/components/layout/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/providers/providers";
import Sidebar from "@/components/layout/Sidebar";

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
      <html lang="es">
        <body className="min-h-screen bg-primary-200 text-primary-foreground">
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/*  principal content  */}
            <div className="flex-1 overflow-auto">

              {/* site content */}
              <main className="px-6 sm:px-12 md:px-24 lg:px-32 xl:px-56 py-6">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </Providers>
  );
}
