import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import ComputersPage from './pages/Computers';
import ReportsPage from './pages/Reports';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import NotFoundPage from './pages/404';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="computers" element={<ComputersPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
