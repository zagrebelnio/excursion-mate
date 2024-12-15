'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useExcursions } from '@/hooks/useExcursions';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from '@mui/material';

export default function AdminExcursrionsPage() {
  const {
    excursions,
    filters,
    loading,
    error,
    fetchExcursions,
    updateQueryParams,
  } = useExcursions();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchExcursions({ page: page + 1, pageSize });
  }, [page, pageSize]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id: number) => {
    console.log('Deleting excursion with ID:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Editing excursion with ID:', id);
  };

  return (
    <div className="py-6 px-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold mb-4">Excursion Management</h2>
        <Link
          href="/admin"
          className="block mt-4 text-center text-blue-600 hover:underline"
        >
          Back to Admin Panel
        </Link>
      </div>

      {loading ? (
        <p>Loading excursions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {excursions.map((excursion: any) => (
                  <TableRow key={excursion.id}>
                    <TableCell>{excursion.title}</TableCell>
                    <TableCell>{excursion.city}</TableCell>
                    <TableCell>₴{excursion.price}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => handleEdit(excursion.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(excursion.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            // count={filters.totalPages * pageSize} // Replace with actual total items if available
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </>
      )}
    </div>
  );
}
