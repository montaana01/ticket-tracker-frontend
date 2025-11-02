import { MacWindow } from '../../components/MacWindow';
import { Link, Box, Typography, Button, Chip } from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  LinkedIn,
  SupportAgent,
  Telegram,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { PATHS } from '../../constants/PATHS';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Container } from '../../components/ui/Container';

export const MainPage = () => {
  const [isInfoOpen, setInfoOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  const statusChips = [
    { label: 'ToDo' },
    { label: 'In Progress' },
    { label: 'Ready For Review' },
    { label: 'Done' },
  ];

  return (
    <>
      <Container>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <SupportAgent sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Support Tracker
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Support tracker system with admin panel
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            {statusChips.map((chip) => (
              <Chip
                key={chip.label}
                label={chip.label}
                variant="outlined"
                sx={{ color: 'var(--text-color)' }}
              />
            ))}
          </Box>

          {!role ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(PATHS.SIGN_IN)}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(PATHS.SIGN_UP)}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() =>
                navigate(role === 'admin' ? PATHS.ADMIN : PATHS.TICKETS)
              }
            >
              Go to {role === 'admin' ? 'Admin Dashboard' : 'My Tickets'}
            </Button>
          )}
        </Box>
        <Button variant="text" size="large" onClick={() => setInfoOpen(true)}>
          Open author&#39;s info
        </Button>
      </Container>
      <MacWindow isOpen={isInfoOpen} onClose={() => setInfoOpen(false)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            gap: 3,
            mb: 3,
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOn color="primary" />
            <Typography variant="body1">Minsk, Belarus / Remote</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone color="primary" />
            <Link href="tel:375336687779" color="inherit" underline="hover">
              +375336687779
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email color="primary" />
            <Link
              href="mailto:yakovlev@yakovlevdev.com"
              color="inherit"
              underline="hover"
            >
              yakovlev@yakovlevdev.com
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Telegram color="primary" />
            <Link
              href="https://t.me/yakovlevdeveloper"
              color="inherit"
              underline="hover"
              target="_blank"
            >
              telegram
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkedIn color="primary" />
            <Link
              href="https://linkedin.com/in/yakovlevdeveloper"
              color="inherit"
              underline="hover"
              target="_blank"
            >
              linkedIn
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2">Built by Alexey Yakovlev</Typography>
        </Box>
      </MacWindow>
    </>
  );
};
