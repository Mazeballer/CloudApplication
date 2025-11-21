import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./provider";
import { Inter } from "next/font/google";

const geist = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "AutoCare+",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body className={geist.className + " font-sans"}>{children}</body>
    </html>
  );
}
