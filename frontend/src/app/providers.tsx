'use client';
import { SessionProvider } from 'next-auth/react';
import { FiltersProvider } from '@/context/filtersContext';
import { UserProvider } from '@/context/userContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FiltersProvider>
      <SessionProvider>
        <UserProvider>{children}</UserProvider>
      </SessionProvider>
    </FiltersProvider>
  );
}
