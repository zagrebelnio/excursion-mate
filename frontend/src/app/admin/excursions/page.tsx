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
  TextField,
  Box,
  Slider,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { deleteExcursion } from '@/services/excursionService';
import { useSession } from 'next-auth/react';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function AdminExcursionsPage() {
  const {
    excursions,
    filters,
    loading,
    error,
    totalItems,
    fetchExcursions,
    updateQueryParams,
  } = useExcursions();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExcursionId, setSelectedExcursionId] = useState<number | null>(null);

  useEffect(() => {
    if (!searchParams.get('pageSize')) {
      updateQueryParams({ pageSize: 5 });
      fetchExcursions({ pageSize: 5 });
    } else {
      fetchExcursions();
    }
  }, []);

  const handleSearchClick = () => {
    updateQueryParams({ page: 1 });
    fetchExcursions();
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    updateQueryParams({ page: newPage + 1 });
    fetchExcursions({ page: newPage + 1 });
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryParams({ pageSize: parseInt(event.target.value, 10), page: 1 });
    fetchExcursions({ pageSize: parseInt(event.target.value, 10), page: 1 });
  };

  const handleDelete = async () => {
    if (!selectedExcursionId) return;

    try {
      await deleteExcursion(
        session?.accessToken as string,
        Number(selectedExcursionId)
      );
      setIsModalOpen(false);
      fetchExcursions();
    } catch (error) {
      console.error('Error deleting excursion:', error);
    }
  };

  const openModal = (id: number) => {
    setSelectedExcursionId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExcursionId(null);
  };

  return (
    <div className="py-6 px-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Excursion Management</h2>
        <Link href="/admin" className="block text-blue-600 hover:underline">
          Back to Admin Panel
        </Link>
      </div>

      <div className="bg-white p-4 rounded-md shadow mb-6 flex flex-wrap gap-4">
        <TextField
          label="Title"
          variant="outlined"
          value={filters.title || ''}
          onChange={(e) =>
            updateQueryParams({ title: e.target.value, page: 1 })
          }
          size="small"
          className="w-1/4"
        />
        <TextField
          label="City"
          variant="outlined"
          value={filters.city || ''}
          onChange={(e) => updateQueryParams({ city: e.target.value, page: 1 })}
          size="small"
          className="w-1/4"
        />
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={filters.date || ''}
          onChange={(e) => updateQueryParams({ date: e.target.value, page: 1 })}
          size="small"
          className="w-1/4"
        />
        <Box className="flex flex-col w-1/4">
          <Typography className="font-bold text-gray-700 mb-2">
            Price Range: ₴{filters.minPrice || 0} - ₴{filters.maxPrice || 1000}
          </Typography>
          <Slider
            value={[filters.minPrice || 0, filters.maxPrice || 1000]}
            onChange={(_, value) =>
              updateQueryParams({
                minPrice: (value as number[])[0],
                maxPrice: (value as number[])[1],
                page: 1,
              })
            }
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchClick}
          className="h-10 mt-auto"
        >
          Search
        </Button>
      </div>

      {loading ? (
        <p>Loading excursions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {excursions.map((excursion: any) => (
                  <TableRow key={excursion.id}>
                    <TableCell>{excursion.title}</TableCell>
                    <TableCell>{excursion.city}</TableCell>
                    <TableCell>
                      {new Date(excursion.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>₴{excursion.price}</TableCell>
                    <TableCell>
                      <Link href={`/admin/excursions/edit/${excursion.id}`}>
                        <Button color="primary">Edit</Button>
                      </Link>
                      <Button
                        color="error"
                        onClick={() => openModal(excursion.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!excursions.length && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No excursions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalItems}
            page={filters.page - 1 || 0}
            onPageChange={handlePageChange}
            rowsPerPage={filters.pageSize || 5}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this excursion? This action cannot be undone."
      />
    </div>
  );
}
