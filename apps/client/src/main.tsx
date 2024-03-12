import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App2 from './app/App2';
import { AppConfigProvider } from './app/providers/AppConfigProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new QueryClient();
/*
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
} */

//enableMocking().then(() => {
root.render(
  <StrictMode>
    <AppConfigProvider
      apiUrl={
        import.meta.env.DEV
          ? 'http://localhost:3333'
          : 'http://192.168.1.106:3333'
      }
    >
      <QueryClientProvider client={client}>
        <App2 />
      </QueryClientProvider>
    </AppConfigProvider>
  </StrictMode>
);
//});
