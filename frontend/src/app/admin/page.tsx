'use client';

import { useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '@/services/userService';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(session?.accessToken as string);
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle role toggle
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(session?.accessToken as string, userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, role: user.role === 'User' ? 'Banned' : 'User' }
            : user
        )
      );
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="py-6 px-20">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    handleUpdateRole(
                      user.id,
                      user.role === 'User' ? 'Banned' : 'User'
                    )
                  }
                  className={`px-4 py-1 rounded ${
                    user.role === 'User'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {user.role === 'User' ? 'Ban' : 'Unban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
