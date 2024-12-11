'use client';
import { Slider, Box, Typography, Pagination } from '@mui/material';
import { ExcursionCard } from '@/components/excursionCards';
import { useFilters } from '@/context/filtersContext';
import { ExcursionType } from '@/types/excursion';
import { useExcursions } from '@/hooks/useExcursions';
import React, { useEffect } from 'react';

export default function ExcursionsPage() {
  const {
    filters,
    searchQuery,
    handleSearchChange,
    handleSliderChange,
    handleFilterChange,
    setPageData,
  } = useFilters();

  const { excursions, loading, error, fetchExcursions, totalPages } =
    useExcursions();

  useEffect(() => {
    fetchExcursions();
  }, [filters.page]);

  const handleSearchClick = () => {
    fetchExcursions();
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setPageData(page, filters.pageSize);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white py-4 shadow-md px-20">
        <input
          type="text"
          className="w-1/2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search excursions..."
          value={searchQuery}
          onChange={handleSearchChange}
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
            onChange={handleFilterChange}
            className="p-3 border rounded-lg h-12 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg h-12 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-4 w-1/3">
          <Typography className="font-bold text-gray-700">
            Price Range: ₴{filters.priceRange[0]} - ₴{filters.priceRange[1]}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Slider
              value={filters.priceRange}
              onChange={handleSliderChange}
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
        {excursions.map((excursion: ExcursionType) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
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
