import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getExcursions,
  getUserExcursions,
  getSavedExcursions,
  saveExcursion,
  unsaveExcursion,
} from '@/services/excursionService';
import { useSession } from 'next-auth/react';

export function useExcursions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const { data: session } = useSession();

  const [filters, setFilters] = useState({
    title: params.title || '',
    city: params.city || '',
    minPrice: Number(params.minPrice) || 0,
    maxPrice: Number(params.maxPrice) || 1000,
    date: params.date || '',
    page: Number(params.page) || 1,
    pageSize: Number(params.pageSize) || 9,
  });

  const [excursions, setExcursions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters((prevFilters) => ({
      ...prevFilters,
      title: params.title || '',
      city: params.city || '',
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 1000,
      date: params.date || '',
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 9,
    }));
  }, [searchParams]);

  const fetchExcursions = async (overrideFilters?: Partial<typeof filters>) => {
    const queryFilters = { ...filters, ...overrideFilters };

    setLoading(true);
    setError(null);

    try {
      const data = await getExcursions(queryFilters);
      setExcursions(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
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

    router.push(`${window.location.pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const fetchUserExcursions = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getUserExcursions(session?.accessToken as string);
      setExcursions(data || []);
    } catch (error) {
      console.error('Error fetching user excursions:', error);
      setError('Failed to fetch user excursions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedExcursions = async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getSavedExcursions(session?.accessToken as string);
      setExcursions(data || []);
    } catch (error) {
      console.error('Error fetching saved excursions:', error);
      setError('Failed to fetch saved excursions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToSaved = async (accessToken: string, excursionId: number) => {
    if (!session?.accessToken) return;

    try {
      await saveExcursion(accessToken, excursionId);
    } catch (error) {
      console.error('Error saving excursion:', error);
    }
  };

  const removeFromSaved = async (accessToken: string, excursionId: number) => {
    if (!session?.accessToken) return;

    try {
      await unsaveExcursion(accessToken, excursionId);
    } catch (error) {
      console.error('Error un-saving excursion:', error);
    }
  };

  return {
    filters,
    excursions,
    loading,
    error,
    totalPages,
    totalItems,
    fetchExcursions,
    updateQueryParams,
    fetchUserExcursions,
    fetchSavedExcursions,
    addToSaved,
    removeFromSaved,
  };
}
