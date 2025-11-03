import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
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
  MessageType,
  StatusType,
  TagType,
  TicketDetailsType,
} from '../../types/tickets.ts';
import { fetchRequest } from '../../helpers/fetchRequest.ts';
import type { ProfileType } from '../../types/user.ts';
import { fieldStyles } from '../../styles/components/form.ts';
import { StatusSelector } from '../ui/StatusSelector';
import { TagSelector } from '../ui/TagSelector';

export const TicketDetails = ({
  ticket,
  isAdmin = false,
  onClose,
  onUpdate,
}: TicketDetailsType) => {
  const [isLoading, setLoading] = useState(false);
  const [isAdminDataLoading, setAdminDataLoading] = useState(false);
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [ticketAuthorName, setTicketAuthorName] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | undefined>(
    undefined
  );
  const [selectedTag, setSelectedTag] = useState<number | undefined>(undefined);
  const [messageText, setMessageText] = useState('');
  const [responseMessage, setResponseMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    setTicketMessage(null);
    setMessageText('');
    setResponseMessage(null);

    if (isAdmin && ticket) {
      setAdminDataLoading(true);
      (async () => {
        try {
          const [statusesData, tagsData, authorData, message] =
            await Promise.all([
              fetchRequest<{ data: StatusType[] }>('/api/statuses'),
              fetchRequest<{ data: TagType[] }>('/api/tags'),
              fetchRequest<{ data: ProfileType }>(
                `/api/admin/user/${ticket.author_id}`
              ),
              fetchRequest<{ data: MessageType }>(
                `/api/ticket/${ticket.id}/message`
              ),
            ]);
          setStatuses(statusesData.data);
          setTags(tagsData.data);
          setTicketAuthorName(authorData.data.username);
          setTicketMessage(message.data.message);
          setSelectedStatus(ticket.status_id);
          setSelectedTag(ticket.tag_id);
        } catch (error) {
          setResponseMessage({
            type: 'error',
            text: 'Failed to load admin data: ' + error,
          });
        } finally {
          setAdminDataLoading(false);
        }
      })();
    }
  }, [isAdmin, ticket]);

  const handleApiCall = async (
    apiCall: () => Promise<void>,
    successMessage: string
  ) => {
    if (!ticket) return;

    setLoading(true);
    setResponseMessage(null);

    try {
      await apiCall();
      setResponseMessage({ type: 'success', text: successMessage });
      onUpdate?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Operation failed';
      setResponseMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (newStatus: number) => {
    if (!ticket) return;

    await handleApiCall(
      () =>
        fetchRequest(`/api/admin/ticket/${ticket.id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status_id: newStatus }),
        }),
      'Status updated successfully'
    );
    setSelectedStatus(newStatus);
  };

  const changeTag = async (newTag: number) => {
    if (!ticket) return;

    await handleApiCall(
      () =>
        fetchRequest(`/api/admin/ticket/${ticket.id}/tag`, {
          method: 'PUT',
          body: JSON.stringify({ tag_id: newTag }),
        }),
      'Tag updated successfully'
    );
    setSelectedTag(newTag);
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    if (!ticket) return;

    const messageToSend = messageText.trim();

    await handleApiCall(
      () =>
        fetchRequest(`/api/admin/ticket/${ticket.id}/message`, {
          method: 'POST',
          body: JSON.stringify({
            message: messageToSend,
          }),
        }),
      'Message sent successfully'
    );
    if (!responseMessage || responseMessage.type === 'success') {
      setTicketMessage(messageToSend);
    }
    setMessageText('');
  };

  const deleteTicket = async () => {
    if (!ticket) return;

    setLoading(true);
    setResponseMessage(null);

    try {
      await fetchRequest(`/api/ticket/${ticket.id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message !==
          "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
      ) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete ticket';
        setResponseMessage({ type: 'error', text: message });
      }
    } finally {
      onUpdate?.();
      onClose();
      setLoading(false);
    }
  };

  const getStatusName = () => {
    if (!ticket) return;
    if (ticket.status_name) return ticket.status_name;
    if (isAdminDataLoading) return '';
    const status = statuses.find((s) => s.id === ticket.status_id);
    return status?.name || '';
  };

  const getTagName = () => {
    if (!ticket) return;
    if (ticket.tag_name) return ticket.tag_name;
    if (isAdminDataLoading) return '';
    const tag = tags.find((t) => t.id === ticket.tag_id);
    return tag?.name || '';
  };

  const getAuthorName = () => {
    if (!ticket) return;
    if (ticket.author_name) return ticket.author_name;
    if (isAdminDataLoading) return '';
    return ticketAuthorName;
  };

  const getMessage = () => {
    if (!ticket) return;
    if (ticket.message_text) return ticket.message_text;
    if (isAdminDataLoading) return '';
    return ticketMessage;
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

      {responseMessage && (
        <Alert
          severity={responseMessage.type}
          onClose={() => setResponseMessage(null)}
          sx={{ mb: 2 }}
        >
          {responseMessage.text}
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{ p: 2, mb: 3, background: 'var(--card-color)' }}
      >
        <Typography variant="h6" gutterBottom textAlign={'start'}>
          Description
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {ticket.description}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          icon={<Assignment />}
          label={getStatusName()}
          color={'default'}
          sx={{ color: 'var(--text-color)' }}
          variant="outlined"
        />
        <Chip
          icon={<Label />}
          label={getTagName()}
          color="secondary"
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            <Typography variant="body2">Author: {getAuthorName()}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime />
            <Typography variant="body2">
              Created: {ticket.created_at}
            </Typography>
          </Box>

          {ticket.updated_at !== ticket.created_at && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime />
              <Typography variant="body2">
                Updated: {ticket.updated_at}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {ticket.message_id && (
        <Paper
          variant="outlined"
          sx={{ p: 1, mb: 3, background: 'var(--button-bg)' }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Message />
            Admin Response
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {getMessage()}
          </Typography>
        </Paper>
      )}

      {isAdmin && !isAdminDataLoading && (
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
          <Typography variant="subtitle2" gutterBottom>
            Send message to User
          </Typography>
          <TextField
            label="Type your message..."
            multiline
            rows={2}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            fullWidth
            sx={fieldStyles}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={!messageText.trim() || isLoading}
            sx={{ mt: 3 }}
          >
            Send Reply
          </Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" textAlign="center" gutterBottom>
            Change status or tag
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              gap: 4,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Typography variant="body2">Status: {getStatusName()}</Typography>
              <StatusSelector value={selectedStatus} onChange={changeStatus} />
              <Button
                variant="contained"
                size="small"
                onClick={() => selectedStatus && changeStatus(selectedStatus)}
                disabled={!selectedStatus || isLoading}
              >
                Change
              </Button>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Typography variant="body2">Tag: {getTagName()}</Typography>
              <TagSelector value={selectedTag} onChange={setSelectedTag} />
              <Button
                variant="contained"
                size="small"
                onClick={() => selectedTag && changeTag(selectedTag)}
                disabled={!selectedTag || isLoading}
              >
                Change
              </Button>
            </Box>
          </Box>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={isLoading}>
          Close
        </Button>
        {!isAdmin && (
          <Button
            variant="contained"
            onClick={deleteTicket}
            disabled={isLoading}
            sx={{ background: 'var(--close)' }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};
