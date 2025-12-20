import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Button } from './components/ui/Button';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { UploadPage } from './features/code/pages/UploadPage';
import { AnalysisResultsPage } from './features/code/pages/AnalysisResultsPage';
import { HistoryPage } from './features/code/pages/HistoryPage';
// 1. Create a dummy Dashboard page component for testing
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500">Ready to analyze your code today?</p>
      </div>
      <Button>+ New Review</Button>
    </div>
    
    {/* A placeholder card to make it look real */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
      Stats and Charts will go here
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root "/" to "/dashboard" for now */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
 <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Dashboard Route with Layout */}
        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          } 
        />
        <Route path="/upload" element={<UploadPage />} />
        {/* Add placeholders for other routes so links don't crash */}
        <Route path="/upload" element={<DashboardLayout><h1>Upload Page</h1></DashboardLayout>} />
        <Route path="/history" element={<DashboardLayout><h1>History Page</h1></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><h1>Profile Page</h1></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><h1>Settings Page</h1></DashboardLayout>} />
       <Route path="/results" element={<AnalysisResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;