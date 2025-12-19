export interface CodeUploadRequest {
  codeText: string;
  language: string;
}

export interface AnalysisResult {
  reviewId: string;
  status: 'pending' | 'completed' | 'failed';
  aiResponse: {
    qualityScore: number;
    issues: string[];
    recommendations: string[];
    securityIssues: number;
    bestPractices: boolean;
  };
}