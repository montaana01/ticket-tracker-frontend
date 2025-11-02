import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { AuthFormProps } from '../../../types/auth.ts';

export const AuthForm = ({
  title,
  error,
  loading = false,
  onSubmit,
}: AuthFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  const fieldStyles = {
    '& .MuiInputLabel-root': {
      color: 'var(--text-color)',
      '&.Mui-focused': {
        color: 'var(--text-color)',
      },
    },
    '& .MuiOutlinedInput-root': {
      color: 'var(--text-color)',
      '&.Mui-focused fieldset': {
        borderColor: 'var(--text-color)',
        color: 'var(--text-color)',
      },
      '& .MuiInputBase-input': {
        color: 'var(--text-color)',
      },
    },
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 6,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gap: 2, width: '100%' }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          disabled={loading}
          sx={fieldStyles}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={loading}
          sx={fieldStyles}
        />
        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? 'Loading...' : title}
        </Button>
      </Box>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
    </Container>
  );
};
