import axiosInstance from '@/lib/axios/axiosInstance';

export async function getUserProfile(accessToken: string) {
  try {
    const response = await axiosInstance.get('/api/Users/Profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    if (error.status === 401) throw new Error('Unauthorized');
    console.error('Error fetching user profile:', error);
  }
}

export async function editUserPorfile(accessToken: string, data: FormData) {
  try {
    const response = await axiosInstance.patch('/api/Users/edit', data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error editing user profile:', error);
  }
}

export async function getUsers(
  accessToken: string,
  filters: Record<string, any> = {}
) {
  const params = new URLSearchParams(filters).toString();
  try {
    const response = await axiosInstance.get(`/api/Admin/users?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

export async function updateUserRole(
  accessToken: string,
  userId: string,
  newRole: string
) {
  try {
    const repsonse = await axiosInstance.post(
      `/api/Admin/ban/${userId}`,
      newRole,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return repsonse.data;
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}
