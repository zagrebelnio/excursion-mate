'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { WideExcursionCard } from '@/components/excursionCards';
import { EXCURSIONS } from '@/store/excursions';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 500],
    date: '',
  });

  const router = useRouter();

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

  const handleSeeMore = () => {
    const queryParams = new URLSearchParams({
      searchQuery,
      location: filters.location,
      date: filters.date,
      priceRange: filters.priceRange.join(','),
    });
    router.push(`/excursions?${queryParams.toString()}`);
  };

  const filteredExcursions = EXCURSIONS.filter((excursion) => {
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
    <div className="min-h-screen bg-black font-poppins pb-10">
      {/* Heading Section */}
      <div
        className="h-screen flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/backgrounds/image 2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="absolute top-8 right-8 text-lg flex space-x-4 items-center z-10 gap-4">
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
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white text-shadow z-10">
          ExcursionMate
        </h1>
      </div>

      {/* Search Section */}
      <div className="bg-white py-6 shadow-md px-10">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            placeholder="Search excursions..."
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <div className="flex justify-between gap-4 mb-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="p-3 border rounded-lg w-1/2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
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
      </div>

      {/* Excursion List Section */}
      <div className="p-6 flex flex-col gap-8 max-w-6xl w-screen bg-blue-100">
        {filteredExcursions.slice(0, 5).map((excursion) => (
          <WideExcursionCard key={excursion.id} excursion={excursion} />
        ))}
      </div>

      <div className="text-center my-6">
        <button
          onClick={handleSeeMore}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          See More
        </button>
      </div>
    </div>
  );
}
