// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PincodeProvider } from './context/PincodeContext';
import { ThemeProvider } from './context/ThemeContext';
import { HandednessProvider } from './context/HandednessContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HandednessProvider>
          <AuthProvider>
            <PincodeProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </PincodeProvider>
          </AuthProvider>
        </HandednessProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
