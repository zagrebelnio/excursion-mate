'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const excursions = [
  {
    id: 1,
    image: '/backgrounds/image 2.jpg',
    title: 'City Tour in Kyiv',
    description: 'Explore the heart of Kyiv with a local guide.',
    location: 'Kyiv, Ukraine',
    date: '2024-12-10',
    price: 50,
    likes: 200,
    dislikes: 5,
  },
  {
    id: 2,
    image: '/backgrounds/image 3.jpg',
    title: 'Lviv Old Town Tour',
    description: 'Discover the charming streets of Lviv.',
    location: 'Lviv, Ukraine',
    date: '2024-12-15',
    price: 45,
    likes: 150,
    dislikes: 3,
  },
];

export default function ExcursionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 100,
    date: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredExcursions = excursions.filter((excursion) => {
    const matchesSearch =
      excursion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excursion.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = excursion.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice = excursion.price >= filters.minPrice && excursion.price <= filters.maxPrice;
    const matchesDate = filters.date ? excursion.date.includes(filters.date) : true;

    return matchesSearch && matchesLocation && matchesPrice && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white py-4 shadow-md px-20">
        <input
          type="text"
          className="w-1/2 p-3 border rounded-lg"
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
            className="p-3 border rounded-lg"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg"
          />
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg"
          />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredExcursions.map((excursion) => (
          <div
            key={excursion.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          >
            <Link href={`/excursions/${excursion.id}`}>
              <Image
                src={excursion.image}
                alt={excursion.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{excursion.title}</h3>
                <p className="text-gray-600 mt-2">{excursion.description}</p>
                <div className="mt-4">
                  <p className="text-gray-500">{excursion.location}</p>
                  <p className="text-gray-500">{excursion.date}</p>
                  <p className="text-gray-500">Price: ${excursion.price}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-500 mr-2">Likes: {excursion.likes}</span>
                    <span className="text-gray-500">Dislikes: {excursion.dislikes}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
