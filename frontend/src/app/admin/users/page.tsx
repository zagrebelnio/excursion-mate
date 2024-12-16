'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUsers, updateUserRole } from '@/services/userService';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters = {
    name: searchParams.get('name') || '',
    surname: searchParams.get('surname') || '',
    role: searchParams.get('role') || '',
    page: Number(searchParams.get('page')) || 0,
    pageSize: Number(searchParams.get('pageSize')) || 5,
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);
  const [totalItems, setTotalItems] = useState(0);

  const updateQueryParams = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null) params.set(key, value.toString());
    });

    router.push(`/admin/users?${params.toString()}`, { scroll: false });
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        name: filters.name,
        surname: filters.surname,
        role: filters.role,
        page: filters.page + 1,
        pageSize: filters.pageSize,
      };
      const data = await getUsers(session?.accessToken as string, params);
      setUsers(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(session?.accessToken as string, userId, newRole);
      loadUsers();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateQueryParams({ pageSize: parseInt(event.target.value, 10), page: 0 });
  };

  return (
    <div className="py-6 px-20 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <Link
          href="/admin"
          className="block mt-4 text-center text-blue-600 hover:underline"
        >
          Back to Admin Panel
        </Link>
      </div>

      <div className="mb-4 flex gap-4">
        <TextField
          label="First Name"
          variant="outlined"
          value={filters.name}
          onChange={(e) => updateQueryParams({ name: e.target.value, page: 0 })}
          size="small"
        />
        <TextField
          label="Surname"
          variant="outlined"
          value={filters.surname}
          onChange={(e) =>
            updateQueryParams({ surname: e.target.value, page: 0 })
          }
          size="small"
        />
        <TextField
          label="Role"
          select
          value={filters.role}
          onChange={(e) => updateQueryParams({ role: e.target.value, page: 0 })}
          size="small"
          className="w-40"
          variant="outlined"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Banned">Banned</MenuItem>
        </TextField>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.role === 'User' ? 'error' : 'success'}
                    size="small"
                    onClick={() =>
                      handleUpdateRole(
                        user.id,
                        user.role === 'User' ? 'Banned' : 'User'
                      )
                    }
                  >
                    {user.role === 'User' ? 'Ban' : 'Unban'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalItems}
        page={filters.page}
        onPageChange={handlePageChange}
        rowsPerPage={filters.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
}
