'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserProfile } from '@/services/userService';

interface UserProfile {
  firstName: string;
  lastName: string;
  photo: string;
  email: string;
}

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const profile = await getUserProfile(session.accessToken);
      setUser(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserData();
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refetchUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
