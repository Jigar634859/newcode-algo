import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CodeEditor from './CodeEditor';
export default function QuestionEditor({
  question,
  lang,
  code,
  onCodeChange,
  onLangChange,
  languages,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [results, setResults] = useState([]);
  const [showDescription, setShowDescription] = useState(true);
  const [activeTab, setActiveTab] = useState('testcases');

  // New state for panel sizes
  const [descriptionWidth, setDescriptionWidth] = useState(400); // Initial width for description
  // Using ratio for vertical resizing
  const [codeEditorFlexRatio, setCodeEditorFlexRatio] = useState(0.7); // Initial ratio for code editor

  // Refs for tracking drag state
  const isResizingDescription = useRef(false);
  const isResizingCode = useRef(false);
  const codeSectionRef = useRef(null);

  useEffect(() => {
    if (question) {
      setTestCases(question.testCases);
      onCodeChange(question.starterCode[lang.name.toLowerCase()] || '');
      setResults([]);
      setError('');
      setActiveTab('testcases');
    }
  }, [question, lang, onCodeChange]);

  const runCode = async () => {
    if (testCases.length === 0) {
      setError('Please add at least one test case');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setActiveTab('results');

    const newResults = [];

    for (let i = 0; i < testCases.length; i++) {
      const { input, expectedOutput } = testCases[i];

      if (!input.trim() || !expectedOutput.trim()) {
        setError('Please fill in all test cases');
        setLoading(false);
        return;
      }

      try {
        console.log('Sending code execution request:', {
          code,
          language: lang.name.toLowerCase() === 'c++' ? 'cpp' : lang.name.toLowerCase(),
          input
        });

        const response = await axios.post(
          '/api/code/execute',
          {
            code,
            language: lang.name.toLowerCase() === 'c++' ? 'cpp' : lang.name.toLowerCase(),
            input
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Code execution response:', response.data);

        const { output, error: hasError } = response.data.data;
        
        newResults.push({
          input,
          expectedOutput,
          actualOutput: output,
          passed: !hasError && output.trim() === expectedOutput.trim(),
        });

        if (hasError) {
          setError(output);
        }
      } catch (err) {
        console.error('Code execution error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });

        setError(`Error: ${err.response?.data?.message || err.message}`);
        newResults.push({
          input,
          expectedOutput,
          actualOutput: `Error: ${err.response?.data?.message || err.message}`,
          passed: false,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  // --- Resizing Handlers ---
  const handleMouseDownDescription = (e) => {
    isResizingDescription.current = true;
    document.addEventListener('mousemove', handleMouseMoveDescription);
    document.addEventListener('mouseup', handleMouseUpDescription);
  };

  const handleMouseMoveDescription = (e) => {
    if (!isResizingDescription.current) return;
    const newWidth = e.clientX;
    setDescriptionWidth(Math.max(200, Math.min(newWidth, 800)));
  };

  const handleMouseUpDescription = () => {
    isResizingDescription.current = false;
    document.removeEventListener('mousemove', handleMouseMoveDescription);
    document.removeEventListener('mouseup', handleMouseUpDescription);
  };

  const handleMouseDownCode = (e) => {
    isResizingCode.current = true;
    document.addEventListener('mousemove', handleMouseMoveCode);
    document.addEventListener('mouseup', handleMouseUpCode);
  };

  const handleMouseMoveCode = (e) => {
    if (!isResizingCode.current) return;
    if (!codeSectionRef.current) return;

    const codeSectionRect = codeSectionRef.current.getBoundingClientRect();
    const totalHeight = codeSectionRect.height;
    const mouseRelativeY = e.clientY - codeSectionRect.top;

    // Calculate new ratio based on mouse position
    let newRatio = mouseRelativeY / totalHeight;

    // Clamp ratio between reasonable bounds (e.g., 0.2 to 0.8 for both panels)
    newRatio = Math.max(0.2, Math.min(0.8, newRatio));

    setCodeEditorFlexRatio(newRatio);
  };

  const handleMouseUpCode = () => {
    isResizingCode.current = false;
    document.removeEventListener('mousemove', handleMouseMoveCode);
    document.removeEventListener('mouseup', handleMouseUpCode);
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Questions
        </button>
        <div className="editor-controls">
          <select value={lang.id} onChange={onLangChange}>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <button onClick={runCode} disabled={loading}>
            {loading ? 'Running…' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <div 
          className={`problem-description ${showDescription ? 'show' : 'hide'}`}
          style={{ width: showDescription ? `${descriptionWidth}px` : '0px' }}
        >
          <div className="description-header">
            <h2>{question.title}</h2>
            <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
          </div>
          <div className="description-content">
            {question.description.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <button 
            className="toggle-description"
            onClick={() => setShowDescription(!showDescription)}
          >
            {showDescription ? 'Hide Description' : 'Show Description'}
          </button>
        </div>

        {showDescription && (
          <div 
            className="resizer-vertical"
            onMouseDown={handleMouseDownDescription}
          ></div>
        )}

        <div className="code-section" ref={codeSectionRef}>
          <div style={{ flex: codeEditorFlexRatio }}> {/* Apply flex ratio here */}
            <CodeEditor
              language={lang.name.toLowerCase()}
              code={code}
              onChange={onCodeChange}
            />
          </div>

          <div 
            className="resizer-horizontal"
            onMouseDown={handleMouseDownCode}
          ></div>

          <div className="output-panel" style={{ flex: 1 - codeEditorFlexRatio }}> {/* Apply inverse flex ratio here */}
            <div className="output-tabs">
              <button 
                className={`tab-button ${activeTab === 'testcases' ? 'active' : ''}`}
                onClick={() => setActiveTab('testcases')}
              >
                Testcase
              </button>
              <button 
                className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Test Result
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'testcases' && (
                <div className="test-cases-content">
                  <h3>Test Cases</h3>
                  <div className="test-cases-list">
                    {testCases.map((testCase, index) => (
                      <div key={index} className="test-case-input">
                        <div className="test-case-header">
                          <h4>Test Case {index + 1}</h4>
                        </div>
                        <div className="test-case-fields">
                          <div>
                            <label>Input:</label>
                            <pre>{testCase.input}</pre>
                          </div>
                          <div>
                            <label>Expected Output:</label>
                            <pre>{testCase.expectedOutput}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="result-box">
                  {error ? (
                    <div className="error-message">
                      <h3>Error:</h3>
                      <pre>{error}</pre>
                    </div>
                  ) : (
                    <div className="test-results">
                      <h3>Test Case Results:</h3>
                      {results.map((res, i) => (
                        <div key={i} className={`test-case ${res.passed ? 'passed' : 'failed'}`}>
                          <div className="test-header">
                            <strong>Test Case {i + 1}</strong>
                            <span className="status">{res.passed ? '✅ Passed' : '❌ Failed'}</span>
                          </div>
                          <div className="test-details">
                            <div>
                              <strong>Input:</strong>
                              <pre>{res.input}</pre>
                            </div>
                            <div>
                              <strong>Expected:</strong>
                              <pre>{res.expectedOutput}</pre>
                            </div>
                            <div>
                              <strong>Actual:</strong>
                              <pre>{res.actualOutput}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}