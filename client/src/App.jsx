import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ShowManagerDashboard from './pages/ShowManagerDashboard';
import CounterStaffDashboard from './pages/CounterStaffDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import GateStaffDashboard from './pages/GateStaffDashboard';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'SHOWMANAGER') return <Navigate to="/showmanager" />;
    if (user.role === 'COUNTER_STAFF') return <Navigate to="/counter" />;
    if (user.role === 'GATESTAFF') return <Navigate to="/gatestaff" />;
    return <Navigate to="/customer" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/showmanager" element={<ProtectedRoute role="SHOWMANAGER"><ShowManagerDashboard /></ProtectedRoute>} />
          <Route path="/counter" element={<ProtectedRoute role="COUNTER_STAFF"><CounterStaffDashboard /></ProtectedRoute>} />
          <Route path="/gatestaff" element={<ProtectedRoute role="GATESTAFF"><GateStaffDashboard /></ProtectedRoute>} />
          <Route path="/customer" element={<ProtectedRoute role="CUSTOMER"><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
