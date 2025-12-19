import { api } from '../../../lib/axios';
import { CodeUploadRequest, AnalysisResult }from '../features/code/types/index.ts';
export const codeApi = {
  analyze: async (data: CodeUploadRequest): Promise<AnalysisResult> => {
    // We send the code to /code/upload
    const response = await api.post('/code/upload', data);
    return response.data;
  }
};