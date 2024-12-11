'use client';
import { createContext, useContext, useState } from 'react';
import { ExcursionType } from '@/types/excursion';

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    priceRange: [0, 5000],
    date: '',
    page: 1,
    pageSize: 9,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const setPageData = (page: number, pageSize: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      pageSize,
    }));
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
      const matchesLocation = excursion.city
        .toLowerCase()
        .includes(filters.city.toLowerCase());
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
        setPageData,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
