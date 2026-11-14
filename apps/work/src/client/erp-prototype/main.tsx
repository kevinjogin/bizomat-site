// Entry of the BIZOMAT ERP design prototype (apps/work/erp-design-preview/index.html). Demonstration data only: no
// server calls, no sign-in. Built by vite.erp-preview.config.ts, never by the app's own build.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '../components/ui/overlays';
import { THEME_KEY, applyTheme, storedTheme } from '../lib/hooks';
import { ErpProvider } from './state';
import { router } from './App';
import '../styles/app.css';
import './erp.css';

// The computer's system theme until a choice is made, the same rule and the same key as every BIZOMAT app.
applyTheme(storedTheme(), false);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(storedTheme(), false));
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY || e.key === null) applyTheme(storedTheme(), false);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ErpProvider>
        <RouterProvider router={router} />
      </ErpProvider>
    </ToastProvider>
  </StrictMode>,
);
