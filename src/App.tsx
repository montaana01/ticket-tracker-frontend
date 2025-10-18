import { BrowserRouter, Route, Routes } from 'react-router';
import { PATHS } from './constants/PATHS.ts';
import { HomePage } from './pages/home';
import { AdminPage } from './pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.ADMIN} element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
