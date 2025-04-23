// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],             // או ['latin', 'latin-ext']
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: 'My V0 Project',
  description: '...'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
