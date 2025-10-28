import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './App.tsx';

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

createRoot(rootElement).render(<App />);
