// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductListing } from './pages/ProductListing';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Orders } from './pages/Orders';
import { PrescriptionUpload } from './pages/PrescriptionUpload';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Route Guard for logged in customers
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-sm text-slate-400 font-bold uppercase tracking-wider">Verifying session...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Route Guard for staff admins
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-sm text-slate-400 font-bold uppercase tracking-wider">Verifying session...</div>
      </div>
    );
  }

  const isAdmin = isAuthenticated && user?.role === 'admin';
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-transparent dark:bg-transparent transition-colors duration-200">
        
        {/* Toast Notifier */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        {/* Global Navigation Header */}
        <Header />

        {/* Page Content Wrapper */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            
            {/* Private Customer Routes */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <PrivateRoute>
                  <PrescriptionUpload />
                </PrivateRoute>
              }
            />

            {/* Admin Portal Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Fallback Catch */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Page Footer */}
        <Footer />
        
      </div>
    </Router>
  );
};
