import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contrato Certo — Contratos de Prestação de Serviços em 2 minutos",
  description:
    "Gere contratos de prestação de serviços válidos juridicamente em apenas 2 minutos. Rápido, seguro e baseado no Código Civil Brasileiro.",
  keywords: [
    "contrato",
    "prestação de serviços",
    "freelancer",
    "MEI",
    "PJ",
    "contrato jurídico",
    "Código Civil",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-800">
                📄 Contrato Certo
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
              <Link href="/criar" className="hover:text-blue-700 transition-colors">
                Criar Contrato
              </Link>
              <Link
                href="/criar?plan=pro"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium"
              >
                Plano Pro
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-3">
            <LegalDisclaimer />
            <div className="text-center text-xs text-gray-500 pt-2">
              © {new Date().getFullYear()} Contrato Certo. Todos os direitos
              reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
