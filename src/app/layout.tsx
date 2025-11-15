import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoCare+ | Smart Vehicle Service & Maintenance Management",
  description:
    "Cloud-powered vehicle service platform for car owners and workshops. Book services, track maintenance history, and get automated reminders powered by AWS.",
  keywords: [
    "vehicle service",
    "car maintenance",
    "workshop management",
    "auto service",
    "AWS cloud",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
