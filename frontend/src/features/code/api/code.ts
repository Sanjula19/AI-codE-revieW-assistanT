import { api } from '../../../lib/axios';
import type { CodeUploadRequest, AnalysisResult } from '../types/index';

// ✅ CRITICAL: This interface must be exported so HistoryPage can use it
export interface HistoryItem extends AnalysisResult {
  _id: string;
  createdAt: string;
  language: string;
}

export const codeApi = {
  analyze: async (data: CodeUploadRequest): Promise<AnalysisResult> => {
    const response = await api.post('/code/upload', data);
    return response.data;
  },

  getHistory: async (): Promise<HistoryItem[]> => {
    const response = await api.get('/code/history');
    return response.data;
  }
};