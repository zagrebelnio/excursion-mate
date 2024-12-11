import axiosInstance from '@/lib/axios/axiosInstance';

export async function getExcursions(
  title: string,
  city: string,
  minPrice: number,
  maxPrice: number,
  date: Date,
  page: number,
  pageSize: number
) {
  try {
    const response = await axiosInstance.get('/api/Excursions', {
      params: {
        title,
        city,
        minPrice,
        maxPrice,
        date,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching excursions:', error);
  }
}
