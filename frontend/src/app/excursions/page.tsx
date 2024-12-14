'use client';
import { Slider, Box, Typography, Pagination } from '@mui/material';
import {
  ExcursionCard,
  ExcursionCardSkeleton,
} from '@/components/excursionCards';
import { useExcursions } from '@/hooks/useExcursions';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ExcursionType } from '@/types/excursion';

export default function ExcursionsPage() {
  const { data: session, status } = useSession();
  const {
    filters,
    excursions,
    loading,
    error,
    totalPages,
    fetchExcursions,
    updateQueryParams,
    addToSaved,
    removeFromSaved,
  } = useExcursions();

  useEffect(() => {
    fetchExcursions();
  }, [status]);

  const handleSearchClick = () => {
    updateQueryParams({ page: 1 });
    fetchExcursions();
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    updateQueryParams({ page });
    fetchExcursions({ page });
  };

  const handleFavoriteClick = (
    e: React.MouseEvent,
    excursion: ExcursionType
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (excursion.isFavorite) {
      removeFromSaved(session?.accessToken, excursion.id);
    } else {
      addToSaved(session?.accessToken, excursion.id);
    }
    fetchExcursions();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white py-4 shadow-md px-20">
        <input
          type="text"
          className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search excursions..."
          value={filters.title}
          onChange={(e) => updateQueryParams({ title: e.target.value })}
        />
        <button
          className="w-32 bg-blue-500 text-white py-2 mt-4 ml-8 rounded-lg hover:bg-blue-600 transition"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>

      <div className="flex justify-between pb-4 px-20 bg-white shadow-md">
        <div className="flex gap-4">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={(e) => updateQueryParams({ city: e.target.value })}
            className="p-3 border rounded-lg h-12 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={(e) => updateQueryParams({ date: e.target.value })}
            className="p-3 border rounded-lg h-12 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-4 w-1/3">
          <Typography className="font-bold text-gray-700">
            Price Range: ₴{filters.minPrice} - ₴{filters.maxPrice}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(e, value) =>
                updateQueryParams({ minPrice: value[0], maxPrice: value[1] })
              }
              valueLabelDisplay="auto"
              min={0}
              max={5000}
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
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: filters.pageSize }, (_, index) => (
            <ExcursionCardSkeleton key={index} />
          ))
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : excursions.length > 0 ? (
          excursions.map((excursion) => (
            <ExcursionCard
              key={excursion.id}
              excursion={excursion}
              onSave={handleFavoriteClick}
            />
          ))
        ) : (
          <p>No excursions found.</p>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          count={totalPages || 1}
          page={filters.page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
          shape="rounded"
          size="large"
        />
      </div>
    </div>
  );
}
