import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { UploadPage } from './features/code/pages/UploadPage';
import { AnalysisResultsPage } from './features/code/pages/AnalysisResultsPage';
import { HistoryPage } from './features/code/pages/HistoryPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { ProfilePage } from './features/user/pages/ProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>

         {/* User Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Dashboard Home */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardPage />
          } 
        />

        {/* ✅ REAL ROUTES (Duplicates removed) */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<AnalysisResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />

        {/* Placeholders for future pages only */}
        <Route path="/profile" element={<DashboardLayout><h1>Profile Page</h1></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><h1>Settings Page</h1></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;