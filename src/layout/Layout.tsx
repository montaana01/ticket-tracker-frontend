import { Outlet } from 'react-router';
import { Header } from '../components/ui/Header';
import { Container } from '../components/ui/Container';

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}
