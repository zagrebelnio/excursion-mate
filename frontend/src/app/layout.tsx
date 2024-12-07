import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';
import { FiltersProvider } from '@/context/filtersContext';

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
        <main className="flex">
          <Sidebar />
          <div className="flex-1">
            <FiltersProvider>{children}</FiltersProvider>
          </div>
        </main>
      </body>
    </html>
  );
}
