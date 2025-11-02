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
import type { TagSelectorType, TagType } from '../../../types/tickets.ts';

export const TagSelector = ({ value, onChange }: TagSelectorType) => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchRequest<{ data: TagType[] }>('/api/tags');
        setTags(response.data);
        if (response.data.length > 0 && value === undefined) {
          const first = [...response.data].sort((a, b) => a.id - b.id)[0];
          onChange(first.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load tags';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  if (isLoading) return <CircularProgress size={24} />;

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel
          id="tag-select-label"
          sx={{
            color: 'var(--text-color)',
            '&.Mui-focused': {
              color: 'var(--text--color)',
            },
          }}
        >
          Tag
        </InputLabel>
        <Select
          labelId="tag-select-label"
          value={value ?? ''}
          label="Tag"
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
          {tags.map((tag) => (
            <MenuItem
              key={tag.id}
              value={tag.id}
              sx={{
                color: 'var(--text-color)',
                backgroundColor: 'var(--bg-color)',
              }}
            >
              {tag.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
