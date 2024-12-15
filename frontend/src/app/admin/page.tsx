'use client';

import { useEffect, useState } from 'react';
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

export default function AdminPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    name: '',
    surname: '',
    role: '',
    page: 0,
    pageSize: 5,
  });

  // const [totalUsers, setTotalUsers] = useState(0);

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
      setUsers(data || []);
      // setTotalUsers(data.total || 0);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters]);

  // Handle Role Update
  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(session?.accessToken as string, userId, newRole);
      loadUsers(); // Refresh the list after role update
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  // Handle Pagination
  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  return (
    <div className="py-6 px-20">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <TextField
          label="First Name"
          variant="outlined"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          size="small"
        />
        <TextField
          label="Surname"
          variant="outlined"
          value={filters.surname}
          onChange={(e) => setFilters({ ...filters, surname: e.target.value })}
          size="small"
        />
        <TextField
          label="Role"
          select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
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
        // count={totalUsers}
        page={filters.page}
        onPageChange={handlePageChange}
        rowsPerPage={filters.pageSize}
        onRowsPerPageChange={handlePageSizeChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
}
