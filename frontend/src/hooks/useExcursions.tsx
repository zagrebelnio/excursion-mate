import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getExcursions } from '@/services/excursionService';

export function useExcursions() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    title: '',
    city: '',
    minPrice: 0,
    maxPrice: 5000,
    date: '',
    page: 1,
    pageSize: 1,
  });

  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters({
      title: params.title || '',
      city: params.city || '',
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 5000,
      date: params.date || '',
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 1,
    });
  }, [searchParams]);

  const fetchExcursions = async (overrideFilters?: Partial<typeof filters>) => {
    const queryFilters = { ...filters, ...overrideFilters };
    setLoading(true);
    setError(null);

    try {
      const data = await getExcursions(queryFilters);
      setExcursions(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch excursions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateQueryParams = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });

    router.push(`/excursions?${params.toString()}`);
    fetchExcursions(newFilters);
  };

  return {
    filters,
    excursions,
    loading,
    error,
    totalPages,
    fetchExcursions,
    updateQueryParams,
  };
}
