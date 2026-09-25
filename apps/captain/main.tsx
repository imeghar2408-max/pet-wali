import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProviderApp } from '../../src/provider/ProviderApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProviderApp />
  </StrictMode>,
);

