import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { codeApi, type DashboardStats } from '../../code/api/code';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Activity, BarChart2, Bug, CheckCircle, Clock, Zap } from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await codeApi.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <DashboardLayout>Loading stats...</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Developer! 👋</h1>
            <p className="text-gray-500 mt-1">Here is what's happening with your code reviews.</p>
          </div>
          <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
            <Zap className="w-4 h-4" /> New Review
          </Button>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Total Reviews */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <BarChart2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.totalScans || 0}</h3>
            <p className="text-sm text-gray-500 mt-1">Total Reviews</p>
          </div>

          {/* Card 2: Average Score */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.averageScore || 0}</h3>
            <p className="text-sm text-gray-500 mt-1">Average Score</p>
          </div>

          {/* Card 3: Issues Found */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <Bug className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.totalIssues || 0}</h3>
            <p className="text-sm text-gray-500 mt-1">Issues Identified</p>
          </div>

          {/* Card 4: Suggestions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats?.recentActivity.length}</h3>
            <p className="text-sm text-gray-500 mt-1">Recent Scans</p>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
            <Button variant="outline" onClick={() => navigate('/history')}>View All</Button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {stats?.recentActivity.map((item) => (
              <div key={item._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.aiResponse.qualityScore >= 80 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.aiResponse.qualityScore >= 80 ? <CheckCircle className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{item.language} Analysis</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${item.aiResponse.qualityScore >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.aiResponse.qualityScore}/100
                  </span>
                  <p className="text-xs text-gray-400">Score</p>
                </div>
              </div>
            ))}
            
            {stats?.recentActivity.length === 0 && (
              <div className="p-8 text-center text-gray-500">No activity yet. Upload your first code!</div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};