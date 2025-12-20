import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
// ✅ FIX: Correctly imports the type we just exported in Step 1
import { codeApi, type HistoryItem } from '../api/code';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await codeApi.getHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>

        {loading ? (
          <div className="text-center py-10">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No history found. Run your first scan!</div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => {
              // ✅ SAFETY CHECK: If a scan failed and has no AI data, don't crash the app. Skip it.
              if (!item.aiResponse) return null;

              return (
                <div 
                  key={item._id} 
                  onClick={() => navigate('/results', { state: item })}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${item.aiResponse.qualityScore >= 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.aiResponse.qualityScore >= 80 ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">{item.language} Analysis</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xl font-bold ${item.aiResponse.qualityScore >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.aiResponse.qualityScore}/100
                    </span>
                    <p className="text-xs text-gray-400">Score</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};