import { Router } from './Router.tsx';
import { AuthProvider } from './providers/AuthProvider.tsx';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
