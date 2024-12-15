'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';
import { useSession } from 'next-auth/react';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {error.message || 'An unexpected error occurred.'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Go to Homepage
        </Button>
      </Box>
    );
  }

  if (roleError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Unauthorized Access
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {roleError}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/')}
        >
          Go to Homepage
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
}
