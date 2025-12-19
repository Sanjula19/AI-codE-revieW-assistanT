import React, { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { Play, Upload } from 'lucide-react';
import { codeApi } from '../api/code';
import { useNavigate } from 'react-router-dom';

export const UploadPage = () => {
  const navigate = useNavigate(); // Hook to change pages
  const [code, setCode] = useState('// Paste your code here...');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert("Please enter some code first!");
      return;
    }
    
    setIsAnalyzing(true);

    try {
      // 2. Call the API
      const result = await codeApi.analyze({
        codeText: code,
        language: language
      });

      console.log("Analysis Result:", result);

      // 3. Success! 
      // Ideally, we navigate to a "Results Page" with the reviewId.
      // For now, let's just alert success so we know it worked.
      
      navigate('/results', { state: result });
      // navigate(`/results/${result.reviewId}`); // We will build this next

    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze code. Check console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };
    

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Code Review</h1>
            <p className="text-gray-500">Paste your code below to detect bugs and security issues.</p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Language:</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <div className="flex gap-3">
             {/* Future Feature: Upload File Button */}
            <Button variant="outline" onClick={() => alert("File upload coming soon!")}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            
            <Button onClick={handleAnalyze} isLoading={isAnalyzing}>
              <Play className="w-4 h-4 mr-2" />
              Analyze Code
            </Button>
          </div>
        </div>

        {/* The Editor */}
        <div className="bg-white rounded-lg shadow-sm">
          <CodeEditor 
            value={code} 
            onChange={(val) => setCode(val || "")} 
            language={language} 
            height="600px"
          />
        </div>

      </div>
    </DashboardLayout>
  );
};