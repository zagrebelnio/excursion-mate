'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Slider, Box, Typography } from '@mui/material';
import { WideExcursionCard } from '@/components/excursionCards';
import { ExcursionType } from '@/types/excursion';
import { useUser } from '@/context/userContext';
import { useExcursions } from '@/hooks/useExcursions';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getRecommededExcursion } from '@/services/excursionService';

export default function Home() {
  const { data: session } = useSession();
  const { user, loading: userLoading } = useUser();
  const {
    filters,
    excursions,
    loading: excursionLoading,
    fetchExcursions,
    updateQueryParams,
  } = useExcursions();

  const [recommendedExcursion, setRecommendedExcursion] =
    useState<ExcursionType | null>(null);

  useEffect(() => {
    if (filters.pageSize !== 5) {
      updateQueryParams({ pageSize: 5 });
    }
    fetchExcursions({ pageSize: 5 });
  }, []);

  useEffect(() => {
    async function fetchRecommededExcursion() {
      if (!session?.accessToken) {
        setRecommendedExcursion(null);
        return;
      }

      try {
        const data = await getRecommededExcursion(session?.accessToken);
        setRecommendedExcursion(data);
      } catch (error) {
        console.error('Error fetching recommended excursion:', error);
        setRecommendedExcursion(null);
      }
    }

    fetchRecommededExcursion();
  }, [session?.accessToken]);

  const handleSearchClick = () => {
    updateQueryParams({ pageSize: 5 });
    fetchExcursions({ pageSize: 5 });
  };

  return (
    <div className="min-h-screen bg-black font-poppins pb-2">
      <div
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/backgrounds/image 2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="absolute top-8 right-8 text-lg flex space-x-4 items-center z-10 gap-4">
          {userLoading ? (
            <></>
          ) : user ? (
            <Link href="/profile">
              <Image
                width={100}
                height={100}
                src={
                  user.photo === null
                    ? '/placeholders/profile-avatar.svg'
                    : `data:image/png;base64,${user.photo}`
                }
                alt={user.firstName}
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:opacity-90"
              />
            </Link>
          ) : (
            <>
              <Link
                href="/auth?mode=login"
                className="px-4 py-1 text-white rounded-full font-semibold hover:bg-white hover:text-black transition duration-300 ease-in-out"
              >
                Увійти
              </Link>
              <Link
                href="/auth?mode=register"
                className="px-4 py-1 bg-white rounded-full font-semibold shadow hover:bg-black hover:text-white transition duration-300 ease-in-out"
              >
                Зареєструватись
              </Link>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white text-shadow z-10">
          ExcursionMate
        </h1>
      </div>

      {recommendedExcursion && (
        <section className="bg-blue-100 py-6 shadow-md px-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Recommended Excursion
            </h2>
            <WideExcursionCard excursion={recommendedExcursion} />
          </div>
        </section>
      )}

      <div className="bg-white py-6 shadow-md px-10">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            placeholder="Search excursions..."
            value={filters.title}
            onChange={(e) => updateQueryParams({ title: e.target.value })}
          />

          <div className="flex justify-between gap-4 mb-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={(e) => updateQueryParams({ city: e.target.value })}
              className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={(e) => updateQueryParams({ date: e.target.value })}
              className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Typography className="font-bold text-gray-700">
              Price Range: ₴{filters.minPrice} - ₴{filters.maxPrice}
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(e, value) =>
                  updateQueryParams({
                    minPrice: value[0],
                    maxPrice: value[1],
                  })
                }
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                sx={{
                  '& .MuiSlider-thumb': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    bgcolor: 'primary.main',
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: 'grey.300',
                  },
                }}
              />
            </Box>
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
      </div>

      <section className="w-full bg-blue-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-8">
          {excursions.map((excursion: ExcursionType) => (
            <WideExcursionCard key={excursion.id} excursion={excursion} />
          ))}
        </div>
      </section>

      <div className="text-center my-6">
        <Link
          href={`/excursions?${new URLSearchParams(
            Object.fromEntries(
              Object.entries(filters).filter(([key]) => key !== 'pageSize')
            )
          ).toString()}`}
        >
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
}
