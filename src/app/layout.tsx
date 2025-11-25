import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const geist = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'AutoCare+',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body className={geist.className + ' font-sans'}>
        {children}

        <Toaster position="bottom-right" richColors expand />
      </body>
    </html>
  );
}
