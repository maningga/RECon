// App.jsx
import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import DashboardOverview from './components/DashboardOverview';
import DepositLogs from './components/DepositLogs';
import logo from './assets/RECon-Logo.png';

function LoginPage({ onLoginSuccess, logoSrc }) {
  const navigate = useNavigate();

  function handleLoginSuccess(result, remember) {
    onLoginSuccess(result, remember);
    navigate('/dashboard', { replace: true });
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} logoSrc={logoSrc} />;
}

function DashboardPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'logs') navigate('/deposit-logs');
    // add more nav-id → route mappings here as you build those pages out
  }

  return (
    <DashboardOverview
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function DepositLogsPage({ adminName, adminRole, logoSrc, avatarSrc, onSignOut }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onSignOut();
    navigate('/login', { replace: true });
  }

  function handleNavigate(id) {
    if (id === 'dashboard') navigate('/dashboard');
    // add more nav-id → route mappings here as you build those pages out
  }

  return (
    <DepositLogs
      adminName={adminName}
      adminRole={adminRole}
      logoSrc={logoSrc}
      avatarSrc={avatarSrc}
      onSignOut={handleSignOut}
      onNavigate={handleNavigate}
    />
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      localStorage.getItem('isAdmin') === 'true' ||
      sessionStorage.getItem('isAdmin') === 'true'
  );
  const [adminName, setAdminName] = useState('Admin User');

  function handleLoginSuccess(result, remember) {
    setIsAuthenticated(true);
    setAdminName(result.username);
    (remember ? localStorage : sessionStorage).setItem('isAdmin', 'true');
  }

  function handleSignOut() {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdmin');
    sessionStorage.removeItem('isAdmin');
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} logoSrc={logo} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage adminName={adminName} logoSrc={logo} onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit-logs"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DepositLogsPage adminName={adminName} logoSrc={logo} onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  );
}