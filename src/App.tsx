import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './components/Calculator';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthPage } from './components/auth/AuthPage';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-gray-100 py-8 transition-colors duration-200
                  dark:bg-dark-bg-primary">
                  <div className="max-w-2xl mx-auto px-4">
                    <Header />
                    <Calculator />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </ThemeProvider>
    </Router>
  );
}