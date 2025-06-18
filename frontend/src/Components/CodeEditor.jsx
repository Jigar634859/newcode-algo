import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, code, onChange }) {
  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: true,
    readOnly: false,
    theme: 'vs-dark',
    tabSize: 4,
    insertSpaces: true,
    autoIndent: 'full',
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: 'on',
    folding: true,
    matchBrackets: 'always',
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: true,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      arrowSize: 11
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      minHeight: '500px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        onMount={(editor, monaco) => {
          // Enable auto-formatting
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            editor.getAction('editor.action.formatDocument').run();
          });

          // Enable smooth scrolling
          editor.updateOptions({
            smoothScrolling: true,
            mouseWheelScrollSensitivity: 1
          });

          // Add snippets
          monaco.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: () => {
              const suggestions = [];
              
              if (language === 'cpp') {
                suggestions.push({
                  label: 'main',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: '#include <iostream>\nusing namespace std;\n\nint main() {\n\t${1}\n\treturn 0;\n}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
                suggestions.push({
                  label: 'for',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
              } else if (language === 'python') {
                suggestions.push({
                  label: 'main',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'def main():\n\t${1}\n\nif __name__ == "__main__":\n\tmain()',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
                suggestions.push({
                  label: 'for',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'for i in range(${1:n}):\n\t${2}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
              } else if (language === 'java') {
                suggestions.push({
                  label: 'main',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'public class Main {\n\tpublic static void main(String[] args) {\n\t\t${1}\n\t}\n}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
                suggestions.push({
                  label: 'for',
                  kind: monaco.languages.CompletionItemKind.Snippet,
                  insertText: 'for (int i = 0; i < ${1:n}; i++) {\n\t${2}\n}',
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                });
              }
              
              return { suggestions };
            }
          });
        }}
      />
    </div>
  );
}
