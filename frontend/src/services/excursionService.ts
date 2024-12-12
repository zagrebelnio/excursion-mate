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

export async function createExcursion(accessToken: string, data: FormData) {
  try {
    const response = await axiosInstance.post('/api/Excursions', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating excursion:', error);
    throw error;
  }
}

export async function deleteExcursion(
  accessToken: string,
  excursionId: number
) {
  try {
    const response = await axiosInstance.delete(
      `/api/Excursions/${excursionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { id: excursionId },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting excursion:', error);
    throw error;
  }
}

export async function getExcursion(accessToken: string, excursionId: number) {
  try {
    const response = await axiosInstance.get(`/api/Excursions/${excursionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching excursion:', error);
    throw error;
  }
}
