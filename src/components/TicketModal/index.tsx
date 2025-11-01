import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  Person,
  Label,
  Assignment,
  Message,
  Edit,
} from '@mui/icons-material';
import type {
  StatusType,
  TagType,
  TicketDetailsType,
} from '../../types/tickets.ts';
import { fetchRequest } from '../../helpers/fetchRequest.ts';

export const TicketDetails = ({
  ticket,
  isAdmin = false,
  onClose,
  onUpdate,
}: TicketDetailsType) => {
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isAdmin && ticket) {
      (async () => {
        try {
          const statusesData = await fetchRequest<{ data: StatusType[] }>(
            '/api/statuses'
          );
          setStatuses(statusesData.data);
          const tagsData = await fetchRequest<{ data: TagType[] }>('/api/tags');
          setTags(tagsData.data);
        } catch (error) {
          console.error('Failed to load admin data:', error);
        }
      })();
    }
  }, [isAdmin, ticket]);

  const changeStatus = async (newStatus: number) => {
    if (!ticket) return;

    setLoading(true);
    try {
      await fetchRequest(`/api/ticket/${ticket.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      setErrorMessage({ type: 'success', text: 'Status updated successfully' });
      onUpdate?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update status';
      setErrorMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (tagId: number) => {
    if (!ticket) return;

    setLoading(true);
    try {
      await fetchRequest(`/api/ticket/${ticket.id}/tag`, {
        method: 'PUT',
        body: JSON.stringify({ tag_id: tagId }),
      });
      setErrorMessage({ type: 'success', text: 'Tag added successfully' });
      onUpdate?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add tag';
      setErrorMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!ticket) return;

    setLoading(true);
    try {
      await fetchRequest(`/api/message`, {
        method: 'POST',
        body: JSON.stringify({ ticketId: ticket.id, message: message }),
      });
      setMessage('');
      setErrorMessage({ type: 'success', text: 'Reply sent successfully' });
      onUpdate?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reply';
      setErrorMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return (
      <Box sx={{ p: 3, margin: '0 auto' }}>
        <Typography>Loading ticket...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Ticket title: <i>{ticket.title}</i>
        </Typography>
        {isAdmin && <Edit />}
      </Box>

      {errorMessage && (
        <Alert
          severity={errorMessage.type}
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage.text}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 3, background: 'var(--card-color)' }}
      >
        <Typography variant="h6" gutterBottom textAlign={'start'}>
          Description
        </Typography>
        <Divider />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {ticket.description}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<Assignment />}
          label={ticket.status_name}
          color={'default'}
          sx={{ color: 'var(--text-color)' }}
          variant="outlined"
        />
        <Chip
          icon={<Label />}
          label={ticket.tag_name}
          color="secondary"
          variant="outlined"
        />
        {/*TODO: create array of tags!*/}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<Label />} color="secondary" variant="outlined" />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1 }} />
            <Typography variant="body2">Author: {authorName}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Created: {ticket.created_at}
            </Typography>
          </Box>

          {ticket.updated_at !== ticket.created_at && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Updated: {ticket.updated_at}
              </Typography>
            </Box>
          )}
        </Box>

        {ticket.message_id && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Message sx={{ mr: 1 }} />
              Admin Response
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.message_text || 'No message from admin yet.'}
            </Typography>
          </Paper>
        )}
      </Box>

      {isAdmin && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Edit sx={{ mr: 1 }} />
            Admin Controls
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }} disabled={isLoading}>
            <InputLabel>Status</InputLabel>
            <Select
              value={ticket.status_id}
              label="Status"
              onChange={(e) => changeStatus(Number(e.target.value))}
            >
              {statuses.map((status: StatusType) => (
                <MenuItem key={status.id} value={status.name}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Tags</Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 1,
                alignItems: 'center',
              }}
            >
              <Chip label={ticket.tag_name} />
              <Select
                onChange={(e) => addTag(Number(e.target.value))}
                disabled={isLoading}
                size="small"
              >
                {tags.map((tag: TagType) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Reply to User
          </Typography>
          <TextField
            label="Type your response..."
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!message || isLoading}
            sx={{ mb: 3 }}
          >
            Send Reply
          </Button>

          <Divider sx={{ my: 2 }} />
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={isLoading}>
          Close
        </Button>
      </Box>
    </Box>
  );
};
