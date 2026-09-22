import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LadiesPage from './pages/LadiesPage.jsx';
import AddLadyPage from './pages/AddLadyPage.jsx';
import LadyProfilePage from './pages/LadyProfilePage.jsx';
import StockPage from './pages/StockPage.jsx';
import AddStockPage from './pages/AddStockPage.jsx';
import GivePadsPage from './pages/GivePadsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ladies" element={<LadiesPage />} />
            <Route path="/ladies/add" element={<AddLadyPage />} />
            <Route path="/ladies/:id" element={<LadyProfilePage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/stock/add" element={<AddStockPage />} />
            <Route path="/distributions" element={<HistoryPage />} />
            <Route path="/distributions/give" element={<GivePadsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
