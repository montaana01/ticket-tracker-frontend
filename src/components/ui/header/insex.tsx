import { Container } from '../container';
import { Logo } from '../logo';
import { AuthButtons } from '../../AuthButtons';

export const Header = () => {
  return (
    <header>
      <Container>
        <Logo />
        <AuthButtons />
      </Container>
    </header>
  );
};
