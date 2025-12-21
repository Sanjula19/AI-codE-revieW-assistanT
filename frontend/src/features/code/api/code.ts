import { api } from '../../../lib/axios';
import type { CodeUploadRequest, AnalysisResult } from '../types/index';

export interface HistoryItem extends AnalysisResult {
  _id: string;
  createdAt: string;
  language: string;
}

// ✅ NEW: Interface for Dashboard Stats
export interface DashboardStats {
  totalScans: number;
  averageScore: number;
  totalIssues: number;
  recentActivity: HistoryItem[];
}

export const codeApi = {
  analyze: async (data: CodeUploadRequest): Promise<AnalysisResult> => {
    const response = await api.post('/code/upload', data);
    return response.data;
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    const response = await api.get('/code/history');
    return response.data;
  },

  // ✅ NEW: Get Stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/code/stats');
    return response.data;
  }
};