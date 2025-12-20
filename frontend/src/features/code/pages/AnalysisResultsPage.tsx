import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import type { AnalysisResult } from '../types';
import { ShieldAlert, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export const AnalysisResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Retrieve the data passed from the Upload Page
  const result = location.state as AnalysisResult;

  // Safety check: If someone goes to this URL directly without analyzing code first
  if (!result) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20">
          <h2 className="text-xl font-bold text-gray-700">No results found</h2>
          <Button className="mt-4" onClick={() => navigate('/upload')}>
            Go to Upload
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const { aiResponse } = result;

  // Helper to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/upload')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Report</h1>
        </div>

        {/* Score Card */}
        <div className={`p-8 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${getScoreColor(aiResponse.qualityScore)}`}>
          <span className="text-lg font-semibold uppercase tracking-wider opacity-80">Quality Score</span>
          <span className="text-6xl font-black mt-2">{aiResponse.qualityScore}/100</span>
          <p className="mt-2 opacity-90 font-medium">
            {aiResponse.qualityScore < 50 ? "Critical Issues Detected" : "Good Code Quality"}
          </p>
        </div>

        {/* Two Columns: Issues & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NEW: Learning Section */}
        {result.aiResponse.correctedCode && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">💡 How to Fix It</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Explanation Column */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Why was the old code wrong?</h4>
                <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                  {result.aiResponse.explanation}
                </p>
              </div>

              {/* Code Comparison Column */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✅ Corrected Version</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <code>{result.aiResponse.correctedCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
          {/* Column 1: Security Issues */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-lg">Security Issues ({aiResponse.securityIssues})</h3>
            </div>
            
            {aiResponse.issues.length === 0 ? (
              <p className="text-gray-500 italic">No issues found. Great job!</p>
            ) : (
              <ul className="space-y-3">
                {aiResponse.issues.map((issue, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 2: AI Recommendations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-bold text-lg">Recommendations</h3>
            </div>

            <ul className="space-y-3">
              {aiResponse.recommendations.map((rec, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};