
import React from 'react';
import { MicIcon } from './IconComponents';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <div className="inline-flex items-center justify-center bg-emerald-900/50 border border-emerald-700 rounded-full p-4 mb-4">
                <MicIcon className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
                Transcriptor de Audio
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Sube tu archivo de audio, elige el idioma y deja que Gemini API lo convierta en texto con gran precisión.
            </p>
        </header>
    );
};
