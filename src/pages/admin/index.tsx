import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TicketsAdmin } from '../../components/admin/TicketsAdmin';
import { TagsAdmin } from '../../components/admin/TagsAdmin';
import { StatusesAdmin } from '../../components/admin/StatusesAdmin';
import { Container } from '../../components/ui/Container';

const two = 2;

export const AdminPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Tickets" sx={{ color: 'var(--text-color)' }} />
        <Tab label="Tags" sx={{ color: 'var(--text-color)' }} />
        <Tab label="Statuses" sx={{ color: 'var(--text-color)' }} />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <TicketsAdmin />}
        {tab === 1 && <TagsAdmin />}
        {tab === two && <StatusesAdmin />}
      </Box>
    </Container>
  );
};
