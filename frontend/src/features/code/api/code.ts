import { api } from '../../../lib/axios';
// ✅ FIX: Added the word 'type' after import
import type { CodeUploadRequest, AnalysisResult } from '../types/index';

export const codeApi = {
  analyze: async (data: CodeUploadRequest): Promise<AnalysisResult> => {
    // We send the code to /code/upload
    const response = await api.post('/code/upload', data);
    return response.data;
  }
};