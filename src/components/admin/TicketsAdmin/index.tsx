import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowId,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import { MacWindow } from '../../MacWindow';
import type { TicketType } from '../../../types/tickets.ts';
import { TicketDetails } from '../../TicketModal';

export const TicketsAdmin = () => {
  const [data, setData] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTicketId, setOpenTicketId] = useState<number | null>(null);
  const [ticketDetails, setTicketDetails] = useState<TicketType | null>(null);

  const safeSetOpenTicketId = (id: GridRowId): void => {
    if (typeof id === 'number') {
      setOpenTicketId(id);
    } else if (!isNaN(Number(id))) {
      setOpenTicketId(Number(id));
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchRequest<{ data: TicketType[] }>(
        '/api/tickets'
      );
      setData(response.data);
    } catch (e) {
      console.error('Failed to load tickets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openTicketId) {
      (async () => {
        try {
          const response = await fetchRequest<{ data: TicketType }>(
            `/api/ticket/${openTicketId}`
          );
          setTicketDetails(response.data);
        } catch (error) {
          console.error('Failed to load ticket details:', error);
        }
      })();
    }
  }, [openTicketId]);

  useEffect(() => {
    load();
  }, []);

  const handleCloseModal = () => {
    setOpenTicketId(null);
    setTicketDetails(null);
  };

  const handleUpdate = () => {
    load();
    if (openTicketId) {
      fetchRequest<{ data: TicketType }>(`/api/ticket/${openTicketId}`)
        .then((response) => setTicketDetails(response.data))
        .catch((error) =>
          console.error('Failed to update ticket details:', error)
        );
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', width: 200, flex: 1 },
    {
      field: 'status_name',
      headerName: 'Status',
      width: 150,
    },
    { field: 'created_at', headerName: 'Created', width: 150 },
    { field: 'updated_at', headerName: 'Updated', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key={`edit-${params.id}`}
          icon={<EditIcon />}
          label="Edit"
          onClick={() => safeSetOpenTicketId(params.id)}
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 640, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        getRowId={(r) => r.id}
      />
      <MacWindow isOpen={!!openTicketId} onClose={handleCloseModal}>
        <TicketDetails
          ticket={ticketDetails}
          isAdmin={true}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      </MacWindow>
    </div>
  );
};
