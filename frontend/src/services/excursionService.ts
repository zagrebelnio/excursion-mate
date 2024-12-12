import axiosInstance from '@/lib/axios/axiosInstance';

export async function getExcursions(filters: {
  title?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  date?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const response = await axiosInstance.get('/api/Excursions', {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching excursions:', error);
    throw error;
  }
}

export async function getUserExcursions(accessToken: string) {
  try {
    const response = await axiosInstance.get(
      '/api/Excursions/user-excursions',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user excursions:', error);
    throw error;
  }
}
