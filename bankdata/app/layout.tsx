import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Arsip Digital BPKAD — BPKAD Provinsi Sulawesi Tengah",
    template: "%s | Arsip Digital BPKAD Sulawesi Tengah",
  },
  description:
    "Sistem Arsip Digital BPKAD internal Kantor Gubernur Sulawesi Tengah. Kelola data kepegawaian, program kerja, aset, dan keuangan secara terpadu.",
  keywords: ["arsip digital bpkad", "sulawesi tengah", "kepegawaian", "aset", "keuangan"],
  robots: { index: false, follow: false }, // aplikasi internal
  icons: {
    icon: "/logo-sulteng.png",
    shortcut: "/logo-sulteng.png",
    apple: "/logo-sulteng.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <NextTopLoader
          color="#059669"
          showSpinner={false}
          shadow="0 0 10px #059669,0 0 5px #059669"
        />
        {children}
      </body>
    </html>
  );
}
