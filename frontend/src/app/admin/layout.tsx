'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { useSession } from 'next-auth/react';
import { CircularProgress, Box } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { user, loading, error } = useUser();
  const router = useRouter();

  const [roleError, setRoleError] = useState<string | null>(null);

  useEffect(() => {
    setRoleError(null);
    if (session?.user?.role !== 'Admin') {
      setRoleError('You are not authorized to access this page.');
    }
  }, [session, router]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (roleError) {
    return <div>{roleError}</div>;
  }

  return <>{children}</>;
}
