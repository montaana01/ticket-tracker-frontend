import { useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import { TicketsAdmin } from '../../components/admin/TicketsAdmin';
import { TagsAdmin } from '../../components/admin/TagsAdmin';
import { StatusesAdmin } from '../../components/admin/StatusesAdmin';

const two = 2;

export const AdminPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container sx={{ mt: 4 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Tickets" />
        <Tab label="Tags" />
        <Tab label="Statuses" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <TicketsAdmin />}
        {tab === 1 && <TagsAdmin />}
        {tab === two && <StatusesAdmin />}
      </Box>
    </Container>
  );
};
