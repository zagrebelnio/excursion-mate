'use client';
import Link from 'next/link';
import { useExcursions } from '@/hooks/useExcursions';
import { useEffect } from 'react';
import {
  WideExcursionCard,
  WideExcursionCardSkeleton,
} from '@/components/excursionCards';
import { ExcursionType } from '@/types/excursion';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';

export default function SavedExcursionsPage() {
  const { data: session } = useSession();
  const { excursions, loading, error, fetchSavedExcursions, removeFromSaved } =
    useExcursions();

  const handleRemoveFromSaved = async (excursionId: number) => {
    await removeFromSaved(session?.accessToken as string, excursionId);
    await fetchSavedExcursions();
  };

  useEffect(() => {
    fetchSavedExcursions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Saved Excursions</h1>
          <Link
            href="/profile"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Back to Profile
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <WideExcursionCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : excursions.length > 0 ? (
          <div className="flex flex-col gap-6">
            {excursions.map((excursion: ExcursionType) => (
              <div
                key={excursion.id}
                className="relative flex bg-blue-50 rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex-1">
                  <WideExcursionCard excursion={excursion} />
                </div>
                <div className="flex flex-col justify-center items-center gap-2 p-4">
                  <IconButton
                    onClick={() => handleRemoveFromSaved(excursion.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            No excursions found in your saved excursions. Start by adding some!
          </div>
        )}
      </div>
    </div>
  );
}
