import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { SessionProvider } from './lib/session';
import { ConfirmProvider, ToastProvider } from './components/ui/overlays';
import { THEME_KEY, applyTheme, storedTheme } from './lib/hooks';
import { ApiError } from './lib/api';
import { BASE } from './lib/base';
import './styles/app.css';

// The theme of this computer (src/client/lib/hooks.ts): its system theme until a choice is made here.
applyTheme(storedTheme(), false);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(storedTheme(), false));
// A choice made in another tab, or on the website, applies here too.
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY || e.key === null) applyTheme(storedTheme(), false);
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, err) => !(err instanceof ApiError && [401, 403, 404].includes(err.status)) && count < 2,
      refetchOnWindowFocus: true,
      staleTime: 10_000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={BASE || undefined}>
        <SessionProvider>
          <ToastProvider>
            <ConfirmProvider>
              <App />
            </ConfirmProvider>
          </ToastProvider>
        </SessionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
