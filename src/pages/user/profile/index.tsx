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
import styles from '../../../styles/base/mui.module.scss';

export const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchRequest<{ data: ProfileType }>('/api/user/profile')
      .then((profile) => setProfile(profile.data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <CircularProgress />;
  }
  if (error)
    return (
      <Alert severity="error" variant="outlined">
        {error}
      </Alert>
    );
  if (!profile)
    return (
      <Alert severity="warning" variant="outlined">
        No profile data available.
      </Alert>
    );

  return (
    <Card>
      <CardContent className={styles.card}>
        <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
          User Profile
        </Typography>
        <Box className={styles.cardBox}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              fontWeight="medium"
              className={styles.cardItem}
            >
              ID:
            </Typography>
            <Chip
              label={profile.id}
              size="small"
              variant="outlined"
              sx={{ color: 'var(--text-color)' }}
            />
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
            <Typography variant="body1" fontWeight="medium">
              Created at:
            </Typography>
            <Typography variant="body2">
              {new Date(profile.created_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
