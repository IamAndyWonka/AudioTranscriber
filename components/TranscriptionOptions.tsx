
import React from 'react';
import type { LanguageOption } from '../types';
import { LANGUAGES } from '../constants';

interface TranscriptionOptionsProps {
  selectedLanguage: LanguageOption;
  onLanguageChange: (language: LanguageOption) => void;
  identifySpeakers: boolean;
  onIdentifySpeakersChange: (value: boolean) => void;
}

export const TranscriptionOptions: React.FC<TranscriptionOptionsProps> = ({
  selectedLanguage,
  onLanguageChange,
  identifySpeakers,
  onIdentifySpeakersChange,
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = LANGUAGES.find(l => l.code === e.target.value);
    if (lang) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="language" className="block text-md font-medium text-slate-300 mb-2 sm:mb-0">
          Idioma del Audio
        </label>
        <select
          id="language"
          value={selectedLanguage.code}
          onChange={handleLanguageChange}
          className="w-full sm:w-64 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 transition"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="speakers" className="block text-md font-medium text-slate-300">
          Identificar Oradores
          <p className="text-sm text-slate-400 font-normal">Separa el texto por "Orador 1", "Orador 2", etc.</p>
        </label>
        <label htmlFor="speakers" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="speakers"
            className="sr-only peer"
            checked={identifySpeakers}
            onChange={(e) => onIdentifySpeakersChange(e.target.checked)}
          />
          <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-emerald-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
    </div>
  );
};
