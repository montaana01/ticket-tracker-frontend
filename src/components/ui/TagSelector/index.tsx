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

type Tag = {
  id: number;
  name: string;
};

type TagSelectorProps = {
  value?: number;
  onChange: (id: number) => void;
};

export const TagSelector = ({ value, onChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const data = await fetchRequest<{ data: Tag[] }>('/api/tags');
        setTags(data.data);
        if (data.data.length > 0 && value === undefined) {
          const first = [...data.data].sort((a, b) => a.id - b.id)[0];
          onChange(first.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load tags';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, [onChange, value]);

  if (error) return <Alert severity="error">{error}</Alert>;

  if (loading) return <CircularProgress size={24} />;

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="tag-select-label">Tag</InputLabel>
        <Select
          labelId="tag-select-label"
          value={value ?? ''}
          label="Tag"
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>
              {tag.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
