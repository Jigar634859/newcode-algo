import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default function CodeEditor({ language, code, onChange }) {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    theme: 'vs-dark'
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '500px', 
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <MonacoEditor
        width="100%"
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
      />
    </div>
  );
}