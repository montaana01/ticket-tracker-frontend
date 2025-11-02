import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import type { StatusType } from '../../../types/tickets.ts';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import type { ApiResponseType } from '../../../types/api.ts';
import { MacWindow } from '../../MacWindow';
import { fieldStyles } from '../../../styles/components/form.ts';

export const StatusesAdmin = () => {
  const [statuses, setStatuses] = useState<StatusType[] | undefined>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusType | null>(null);
  const [statusName, setStatusName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await fetchRequest<ApiResponseType<StatusType[]>>(
        '/api/statuses',
        {
          method: 'GET',
        }
      );
      setStatuses(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load statuses';
      setError(message);
    }
  };

  const handleSubmit = async () => {
    if (!statusName.trim()) {
      setError('Status name should not be empty');
      return;
    }

    setIsLoading(true);
    try {
      const url = editingStatus
        ? `/api/admin/statuses/${editingStatus.id}`
        : '/api/admin/statuses';
      const method = editingStatus ? 'PUT' : 'POST';

      await fetchRequest(url, {
        method,
        body: JSON.stringify({ name: statusName }),
      });

      setModalOpen(false);
      setStatusName('');
      setEditingStatus(null);
      fetchStatuses();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error while creating status';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await fetchRequest(`/api/admin/statuses/${id}`, {
        method: 'DELETE',
      });
      fetchStatuses();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !==
          "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
      ) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete ticket';
        setError(message);
      }
    } finally {
      fetchStatuses();
      setIsLoading(false);
    }
  };

  const handleAddingStatus = () => {
    setEditingStatus(null);
    setStatusName('');
    setModalOpen(true);
  };

  const handleEditModal = (status: StatusType) => {
    setEditingStatus(status);
    setStatusName(status.name);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingStatus(null);
    setStatusName('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" typography="h5">
          Statuses editor
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddingStatus}
          disabled={isLoading}
        >
          Add status
        </Button>
      </Box>

      {error && <Alert sx={{ mb: 2 }}>{error}</Alert>}

      {statuses && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statuses.map((status: StatusType) => (
                <TableRow key={status.id}>
                  <TableCell>{status.id}</TableCell>
                  <TableCell>{status.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditModal(status)}
                      disabled={isLoading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(status.id)}
                      disabled={isLoading}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MacWindow isOpen={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 4,
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editingStatus ? 'Edit status' : 'Create status'}
          </Typography>

          <TextField
            autoFocus
            label="Status name"
            fullWidth
            variant="outlined"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            required
            disabled={isLoading}
            sx={fieldStyles}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
            <Button onClick={handleModalClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isLoading || !statusName.trim()}
            >
              {editingStatus ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </MacWindow>
    </Box>
  );
};
