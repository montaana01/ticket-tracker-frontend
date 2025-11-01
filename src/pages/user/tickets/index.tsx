import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import type { TicketType } from '../../../types/tickets.ts';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { MacWindow } from '../../../components/MacWindow';
import { CreateTicketForm } from '../../../components/ui/TicketForm';
import { TicketDetails } from '../../../components/TicketModal';

export const TicketsPage = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRequest<{ data: TicketType[] }>('/api/tickets');
      setTickets(data.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load tickets';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCloseModal = () => {
    setIsCreateOpen(false);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    load();
  };

  const handleCloseDetailsModal = () => {
    setSelectedTicket(null);
  };

  const handleRowClick = (params) => {
    setSelectedTicket(params.row);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200,
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      flex: 2,
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'status_name',
      headerName: 'Status',
      width: 130,
    },
    {
      field: 'created_at',
      headerName: 'Created',
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
      width: 120,
    },
  ];

  if (error) return <Alert severity="warning">{error}</Alert>;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">My tickets</Typography>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          Create ticket
        </Button>
      </Box>

      <DataGrid
        rows={tickets}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        onRowClick={handleRowClick}
        sx={{
          cursor: 'pointer',
        }}
      />

      <MacWindow isOpen={isCreateOpen} onClose={handleCloseModal}>
        <CreateTicketForm
          onCancel={handleCloseModal}
          onSuccess={handleCreateSuccess}
        />
      </MacWindow>

      <MacWindow isOpen={!!selectedTicket} onClose={handleCloseDetailsModal}>
        <TicketDetails
          ticket={selectedTicket}
          isAdmin={false}
          onClose={handleCloseDetailsModal}
        />
      </MacWindow>
    </Container>
  );
};
