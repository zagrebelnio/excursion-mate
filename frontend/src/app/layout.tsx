import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { Providers } from './providers';
import RedirectBanned from '@/components/redirectBanned';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Excursion Mate',
  description: 'Create and manage your excursions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <Providers>
          <RedirectBanned />
          <main className="flex">
            <Sidebar />
            <div className="flex-1">{children}</div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
