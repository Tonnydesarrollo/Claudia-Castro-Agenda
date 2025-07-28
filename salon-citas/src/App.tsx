import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './components/LoginPage';
import CalendarPage from './components/CalendarPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Si estás en / y no estás logueado, pasa a /login; si sí, a /calendar */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/calendar" replace />
              </PrivateRoute>
            }
          />

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Calendario protegido */}
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarPage />
              </PrivateRoute>
            }
          />

          {/* Cualquier otra ruta te manda a / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
