import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor = ({ 
  value, 
  onChange, 
  language = "javascript", 
  readOnly = false,
  height = "400px" 
}: CodeEditorProps) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <Editor
        height={height}
        language={language.toLowerCase()}
        value={value}
        onChange={onChange}
        theme="light"
        options={{
          readOnly: readOnly,
          minimap: { enabled: false }, // Hides the small map on the right
          fontSize: 14,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};