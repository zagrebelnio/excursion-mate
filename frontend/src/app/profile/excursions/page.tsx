'use client';
import Link from 'next/link';
import { useExcursions } from '@/hooks/useExcursions';
import { useEffect } from 'react';
import {
  WideExcursionCard,
  WideExcursionCardSkeleton,
} from '@/components/excursionCards';
import { ExcursionType } from '@/types/excursion';
import { Edit, Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { deleteExcursion } from '@/services/excursionService';
import { useSession } from 'next-auth/react';

export default function MyExcursionsPage() {
  const { data: session } = useSession();
  const { excursions, loading, error, fetchUserExcursions } = useExcursions();

  useEffect(() => {
    fetchUserExcursions();
  }, []);

  const handleDelete = async (excursionId: string) => {
    try {
      await deleteExcursion(
        session?.accessToken as string,
        Number(excursionId) as number
      );
      fetchUserExcursions();
    } catch (error) {
      console.error('Error deleting excursion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Excursions</h1>
          <Link
            href="/profile"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Back to Profile
          </Link>
        </div>

        <div className="flex justify-end mb-6">
          <Link
            href="/profile/excursions/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Create New Excursion
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
                  <Link href={`/profile/excursions/edit/${excursion.id}`}>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(excursion.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            No excursions found. Start by creating a new one!
          </div>
        )}
      </div>
    </div>
  );
}
