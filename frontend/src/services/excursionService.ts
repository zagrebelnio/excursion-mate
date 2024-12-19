import axiosInstance from '@/lib/axios/axiosInstance';

export async function getExcursions(
  accessToken: string | null = null,
  filters: {
    title?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    date?: string;
    page?: number;
    pageSize?: number;
  }
) {
  try {
    const response = await axiosInstance.get('/api/Excursions', {
      params: filters,
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
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

export async function getExcursion(
  accessToken: string | null,
  excursionId: number
) {
  try {
    const response = await axiosInstance.get(`/api/Excursions/${excursionId}`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching excursion:', error);
    throw error;
  }
}

export async function editExcursion(
  accessToken: string,
  excursionId: number,
  data: FormData
) {
  try {
    const response = await axiosInstance.patch(
      `/api/Excursions/${excursionId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing excursion:', error);
    throw error;
  }
}

export async function getSavedExcursions(accessToken: string) {
  try {
    const response = await axiosInstance.get('/api/Favorites', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved excursions:', error);
    throw error;
  }
}

export async function saveExcursion(accessToken: string, excursionId: number) {
  try {
    const response = await axiosInstance.post(
      `/api/Favorites/${excursionId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving excursion:', error);
    throw error;
  }
}

export async function unsaveExcursion(
  accessToken: string,
  excursionId: number
) {
  try {
    const response = await axiosInstance.delete(
      `/api/Favorites/${excursionId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error un-saving excursion:', error);
    throw error;
  }
}

export async function addReaction(
  accessToken: string,
  excursionId: number,
  reaction: 'Like' | 'Dislike'
) {
  try {
    const response = await axiosInstance.post(
      '/api/Reaction/react',
      {
        excursionId,
        reaction,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding reaction:', error);
    throw error;
  }
}

export async function postView(accessToken: string, excursionId: number) {
  try {
    const response = await axiosInstance.post(
      '/api/Excursions/viewed',
      {
        excursionId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error posting view:', error);
    throw error;
  }
}

export async function getRecommededExcursion(accessToken: string) {
  try {
    const response = await axiosInstance.get('/api/Excursions/recommended', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching recommended excursion:', error);
    throw error;
  }
}
