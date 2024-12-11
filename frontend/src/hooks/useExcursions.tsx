import { useState } from 'react';
import { getExcursions } from '@/services/excursionService';
import { ExcursionType } from '@/types/excursion';
import { useFilters } from '@/context/filtersContext';

export function useExcursions() {
  const [excursions, setExcursions] = useState<ExcursionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { searchQuery, filters } = useFilters();

  const fetchExcursions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExcursions(
        searchQuery,
        filters.city,
        filters.priceRange[0],
        filters.priceRange[1],
        filters.date,
        filters.page,
        filters.pageSize
      );
      setExcursions(data.items || []);
    } catch (err) {
      setError('Failed to fetch excursions. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { excursions, loading, error, fetchExcursions };
}
