import React, { useState, useEffect, useMemo } from 'react';
import InfoCard from './InfoCard';
import { WeatherData } from '../types';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherData | null;
}

const syntaxHighlight = (json: string): { __html: string } => {
  if (!json) return { __html: '' };

  let highlightedJson = json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
  highlightedJson = highlightedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });

  highlightedJson = highlightedJson
    .replace(/([\{\}])/g, '<span class="json-brace">$1</span>')
    .replace(/([\[\]])/g, '<span class="json-brace">$1</span>');

  return { __html: highlightedJson };
};


const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose, data }) => {
  const [copyText, setCopyText] = useState('Copy');

  const jsonString = useMemo(() => {
    return data ? JSON.stringify(data, null, 2) : '';
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setCopyText('Copy');
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (navigator.clipboard && jsonString) {
      navigator.clipboard.writeText(jsonString).then(() => {
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy'), 2000);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <InfoCard className="max-w-2xl w-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Raw API Response</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="px-3 py-1.5 bg-black/10 dark:bg-white/10 text-gray-800 dark:text-slate-300 rounded-md text-sm hover:bg-black/20 dark:hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span>{copyText}</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-slate-900/70 rounded-lg p-4 overflow-auto max-h-[70vh]">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            <code dangerouslySetInnerHTML={syntaxHighlight(jsonString)} />
          </pre>
        </div>
      </InfoCard>
      <style>{`
        .json-key { color: #9cdcfe; } /* Light Blue */
        .dark .json-key { color: #9cdcfe; }
        
        .json-string { color: #ce9178; } /* Orange */
        .dark .json-string { color: #ce9178; }
        
        .json-number { color: #b5cea8; } /* Light Green */
        .dark .json-number { color: #b5cea8; }
        
        .json-boolean { color: #569cd6; } /* Blue */
        .dark .json-boolean { color: #569cd6; }
        
        .json-null { color: #c586c0; } /* Purple */
        .dark .json-null { color: #c586c0; }

        .json-brace { color: #d4d4d4; }
        .dark .json-brace { color: #d4d4d4; }
      `}</style>
    </div>
  );
};

export default ApiModal;