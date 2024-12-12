'use client';
import Link from 'next/link';
import { useExcursions } from '@/hooks/useExcursions';
import { useEffect } from 'react';
import {
  WideExcursionCard,
  WideExcursionCardSkeleton,
} from '@/components/excursionCards';
import { ExcursionType } from '@/types/excursion';

export default function MyExcursionsPage() {
  const { excursions, loading, error, fetchUserExcursions } = useExcursions();

  useEffect(() => {
    fetchUserExcursions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Excursions</h1>

        <div className="flex justify-end mb-6">
          <Link
            href="/my-excursions/new"
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
              <WideExcursionCard key={excursion.id} excursion={excursion} />
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
