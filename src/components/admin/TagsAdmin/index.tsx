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
import type { TagType } from '../../../types/tickets.ts';
import { fetchRequest } from '../../../helpers/fetchRequest.ts';
import type { ApiResponseType } from '../../../types/api.ts';
import { MacWindow } from '../../MacWindow';
import { fieldStyles } from '../../../styles/components/form.ts';

export const TagsAdmin = () => {
  const [tags, setTags] = useState<TagType[] | undefined>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [tagName, setTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetchRequest<ApiResponseType<TagType[]>>(
        '/api/tags',
        {
          method: 'GET',
        }
      );
      setTags(response.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load tags';
      setError(message);
    }
  };

  const handleSubmit = async () => {
    if (!tagName.trim()) {
      setError('Tag name should not be empty');
      return;
    }

    setIsLoading(true);
    try {
      const url = editingTag
        ? `/api/admin/tags/${editingTag.id}`
        : '/api/admin/tags';
      const method = editingTag ? 'PUT' : 'POST';

      await fetchRequest(url, {
        method,
        body: JSON.stringify({ name: tagName }),
      });

      setModalOpen(false);
      setTagName('');
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error while creating tag';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      await fetchRequest(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });
      fetchTags();
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
      fetchTags();
      setIsLoading(false);
    }
  };

  const handleAddingTag = () => {
    setEditingTag(null);
    setTagName('');
    setModalOpen(true);
  };

  const handleEditModal = (tag: TagType) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTag(null);
    setTagName('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h2" typography="h5">
          Tags editor
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddingTag}
          disabled={isLoading}
        >
          Add tag
        </Button>
      </Box>

      {error && <Alert sx={{ mb: 2 }}>{error}</Alert>}

      {tags && (
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
              {tags.map((tag: TagType) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditModal(tag)}
                      disabled={isLoading}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(tag.id)}
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
            {editingTag ? 'Edit tag' : 'Create tag'}
          </Typography>

          <TextField
            autoFocus
            label="Tag name"
            fullWidth
            variant="outlined"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
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
              disabled={isLoading || !tagName.trim()}
            >
              {editingTag ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </MacWindow>
    </Box>
  );
};
