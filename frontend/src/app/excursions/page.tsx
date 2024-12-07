'use client';
import { useState } from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { ExcursionCard } from '@/components/excursionCards';
import { EXCURSIONS } from '@/store/excursions';
import { ExcursionType } from '@/types/excursion';

export default function ExcursionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 500],
    date: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newValue as [number, number],
    }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredExcursions = EXCURSIONS.filter((excursion: ExcursionType) => {
    const matchesSearch =
      excursion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excursion.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = excursion.location
      .toLowerCase()
      .includes(filters.location.toLowerCase());
    const matchesPrice =
      excursion.price >= filters.priceRange[0] &&
      excursion.price <= filters.priceRange[1];
    const matchesDate = filters.date
      ? excursion.date.includes(filters.date)
      : true;

    return matchesSearch && matchesLocation && matchesPrice && matchesDate;
  });

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
      </div>

      <div className="flex justify-between pb-4 px-20 bg-white shadow-md">
        <div className="flex gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
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
              max={500}
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
        {filteredExcursions.map((excursion) => (
          <ExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </div>
    </div>
  );
}
