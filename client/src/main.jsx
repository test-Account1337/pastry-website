import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';
import { initializeApi } from './utils/api';
import { LanguageProvider } from './context/LanguageContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Initialize API with fallback logic
initializeApi().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LanguageProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FDF6E3',
                  color: '#3E2723',
                  border: '1px solid #8D6E63',
                },
                success: {
                  iconTheme: {
                    primary: '#8D6E63',
                    secondary: '#FDF6E3',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#E91E63',
                    secondary: '#FDF6E3',
                  },
                },
              }}
            />
          </LanguageProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
  );
}); 