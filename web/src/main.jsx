import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const raiz = document.getElementById('root');

createRoot(raiz).render(
  <StrictMode>
    <App />
  </StrictMode>
);