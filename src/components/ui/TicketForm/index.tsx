import { useCallback, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import type { CreateTicketFormType } from '../../../types/tickets.ts';
import { TagSelector } from '../TagSelector';

export const CreateTicketForm = ({
  onCancel,
  onSuccess,
}: CreateTicketFormType) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagId, setTagId] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitting(true);
    setError(null);
    try {
      await fetchRequest('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          description: description,
          tag_id: tagId,
        }),
      });
      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create ticket';
      setError(message);
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleTagChange = useCallback((id: number) => setTagId(id), []);

  const fieldStyles = {
    mb: 2,
    width: '85%',
    '& .MuiInputLabel-root': {
      color: 'var(--text-color)',
    },
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-color)',
      backgroundColor: 'var(--card-color)',
      '&.Mui-focused fieldset': {
        borderColor: 'var(--bg-color)',
      },
      '& .MuiInputBase-input': {
        color: 'var(--text-color)',
      },
    },
  };

  if (isLoading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Typography variant="h2" typography="h5" gutterBottom>
        Create ticket
      </Typography>
      {error && (
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      )}
      <TextField
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        sx={fieldStyles}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        multiline
        rows={6}
        required
        sx={fieldStyles}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '85%',
          margin: '0 auto',
          mt: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit" disabled={submitting}>
            Create
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
        <TagSelector value={tagId} onChange={handleTagChange} />
      </Box>
    </Box>
  );
};
