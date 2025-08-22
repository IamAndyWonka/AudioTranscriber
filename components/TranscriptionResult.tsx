
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, ClipboardCheckIcon, DocumentTextIcon } from './IconComponents';

interface TranscriptionResultProps {
  text: string;
}

export const TranscriptionResult: React.FC<TranscriptionResultProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-sky-400 flex items-center gap-2">
            <DocumentTextIcon />
            <span>Transcripción Completa</span>
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
        >
          {copied ? (
            <>
                <ClipboardCheckIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
             <>
                <ClipboardIcon className="w-4 h-4" />
                <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="w-full bg-slate-900/70 p-4 rounded-lg max-h-[400px] overflow-y-auto border border-slate-700">
        <pre className="whitespace-pre-wrap text-slate-300 text-base leading-relaxed">{text}</pre>
      </div>
    </div>
  );
};
