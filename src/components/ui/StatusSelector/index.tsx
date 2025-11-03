import { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import type { StatusSelectorType, StatusType } from '../../../types/tickets.ts';

export const StatusSelector = ({ value, onChange }: StatusSelectorType) => {
  const [statuses, setStatuses] = useState<StatusType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const response = await fetchRequest<{ data: StatusType[] }>(
          '/api/statuses'
        );
        setStatuses(response.data);
        if (response.data.length > 0 && value === undefined) {
          const first = [...response.data].sort((a, b) => a.id - b.id)[0];
          onChange(first.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load statuses';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatuses();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  if (isLoading) return <CircularProgress size={24} />;

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="status-select-label"
          sx={{
            color: 'var(--text-color)',
            '&.Mui-focused': {
              color: 'var(--text-color)',
            },
          }}
        >
          Status
        </InputLabel>
        <Select
          labelId="status-select-label"
          value={value ?? ''}
          label="Status"
          onChange={(event) => onChange(Number(event.target.value))}
          sx={{
            color: 'var(--text-color)',
            backgroundColor: 'var(--card-color)',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--bg-color)',
            },
            '& .MuiSvgIcon-root': {
              color: 'var(--text-color)',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                '& .MuiMenuItem-root': {
                  color: 'var(--text-color)',
                },
              },
            },
          }}
        >
          {statuses.map((status) => (
            <MenuItem
              key={status.id}
              value={status.id}
              sx={{
                color: 'var(--text-color)',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              {status.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
