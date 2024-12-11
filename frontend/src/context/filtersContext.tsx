'use client';
import { createContext, useContext, useState } from 'react';
import { ExcursionType } from '@/types/excursion';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 5000],
    date: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSliderChange = (event: Event, newValue: number[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: newValue,
    }));
  };

  const filterExcursions = (excursions: ExcursionType[]) => {
    return excursions.filter((excursion: ExcursionType) => {
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
  };

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        filters,
        handleSearchChange,
        handleFilterChange,
        handleSliderChange,
        filterExcursions,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
