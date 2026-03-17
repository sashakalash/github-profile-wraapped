import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'GitHub Profile Wrapped',
  description: 'Spotify Wrapped for your GitHub activity. Beautiful stats for any GitHub user.',
  openGraph: {
    siteName: 'GitHub Profile Wrapped',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-gray-900 antialiased dark:bg-[#0d1117] dark:text-white`}
      >
        <Providers>
          <NavigationProgress />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
