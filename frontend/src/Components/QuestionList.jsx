import React from 'react';
export default function QuestionList({ questions, onSelect }) {
  return (
    <div className="container">
      <h1>Programming Questions</h1>
      <div className="questions-list">
        {questions.map((question) => (
          <div
            key={question.id}
            className="question-card"
            onClick={() => onSelect(question)}
          >
            <h3>{question.title}</h3>
            <p>{question.description.split('\n')[0]}</p>
            <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 