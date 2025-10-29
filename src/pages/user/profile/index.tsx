import { useEffect, useState } from 'react';
import { fetchRequest } from '../../../helpers/fetchRequest';
import type { ProfileType } from '../../../types/user.ts';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';

export const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRequest<ProfileType>('/api/user/profile')
      .then((data) => setProfile(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <CircularProgress />;
  }
  if (error)
    return (
      <Alert severity="error" variant="outlined">
        Error fetching user profile. Please try again later.
      </Alert>
    );
  if (!profile)
    return (
      <Alert severity="warning" variant="outlined">
        No profile data available.
      </Alert>
    );

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          User Profile
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ minWidth: 80 }}
            >
              ID:
            </Typography>
            <Chip label={profile.id} size="small" variant="outlined" />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ minWidth: 80 }}
            >
              Username:
            </Typography>
            <Typography variant="body1">{profile.username}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ minWidth: 80 }}
            >
              Role:
            </Typography>
            <Chip
              label={profile.role}
              color={profile.role === 'admin' ? 'secondary' : 'primary'}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ minWidth: 80 }}
            >
              Created at:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(profile.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
