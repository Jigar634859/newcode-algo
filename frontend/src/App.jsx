import React, { useState } from 'react';
import QuestionList from './Components/QuestionList.jsx';
import QuestionEditor from './Components/QuestionEditor.jsx';
import { questions } from './data/questionsData.js'; // Import questions from the new data file
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './App.css';

const languages = [
  { id: 63, name: 'JavaScript' },
  { id: 71, name: 'Python' },
  { id: 53, name: 'C++' },
  { id: 62, name: 'Java' },
];

// Sample questions bank - you can expand this or load from an API
// const questions = [
//   // ... existing questions ...
// ]; // This will be removed as questions are now imported

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [lang, setLang] = useState(languages[0]);
  const [code, setCode] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuestionSelect = (question) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedQuestion(question);
    setLang(languages[0]); 
    setCode(question.starterCode[languages[0].name.toLowerCase()] || ''); // Initialize code for the default language
  };

  const handleLanguageChange = (e) => {
    const selectedLang = languages.find((l) => l.id === +e.target.value);
    setLang(selectedLang);
    if (selectedQuestion) {
      setCode(selectedQuestion.starterCode[selectedLang.name.toLowerCase()] || '');
    }
  };

  if (!selectedQuestion) {
    return (
      <QuestionList questions={questions} onSelect={handleQuestionSelect} />
    );
  }

  return (
    <QuestionEditor
      question={selectedQuestion}
      lang={lang}
      code={code}
      onCodeChange={setCode}
      onLangChange={handleLanguageChange}
      languages={languages}
      onBack={() => setSelectedQuestion(null)}
    />
  );
}

export default App;
