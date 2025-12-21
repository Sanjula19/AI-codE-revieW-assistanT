import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Button } from './components/ui/Button';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { UploadPage } from './features/code/pages/UploadPage';
import { AnalysisResultsPage } from './features/code/pages/AnalysisResultsPage';
import { HistoryPage } from './features/code/pages/HistoryPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
// Dummy Dashboard Home Component
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500">Ready to analyze your code today?</p>
      </div>
      <Button>+ New Review</Button>
    </div>
    
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
      Stats and Charts will go here
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
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