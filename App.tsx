
import React, { useState, useCallback } from 'react';
import { AudioUploader } from './components/AudioUploader';
import { TranscriptionOptions } from './components/TranscriptionOptions';
import { TranscriptionResult } from './components/TranscriptionResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Header } from './components/Header';
import { transcribeAudio } from './services/geminiService';
import type { LanguageOption } from './types';
import { LANGUAGES } from './constants';
import { ErrorIcon, SparklesIcon } from './components/IconComponents';

export default function App(): React.ReactNode {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [identifySpeakers, setIdentifySpeakers] = useState<boolean>(true);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    setAudioFile(file);
    setTranscription('');
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data url prefix: "data:*/*;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleTranscribe = useCallback(async () => {
    if (!audioFile) {
      setError('Por favor, selecciona un archivo de audio primero.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscription('');

    try {
      setStatusMessage('Convirtiendo audio a formato digital...');
      const audioBase64 = await fileToBase64(audioFile);
      
      setStatusMessage('Enviando a la IA para transcripción...');
      const result = await transcribeAudio(
        audioBase64,
        audioFile.type,
        language.name,
        identifySpeakers
      );
      
      setTranscription(result);
    } catch (err) {
      console.error('Transcription error:', err);
      setError(
        err instanceof Error ? err.message : 'Ocurrió un error desconocido durante la transcripción.'
      );
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [audioFile, language, identifySpeakers]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main className="mt-8 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">1. Sube tu archivo de audio</h2>
            <AudioUploader onFileSelect={handleFileSelect} file={audioFile} />
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">2. Configura las opciones</h2>
            <TranscriptionOptions
              selectedLanguage={language}
              onLanguageChange={setLanguage}
              identifySpeakers={identifySpeakers}
              onIdentifySpeakersChange={setIdentifySpeakers}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleTranscribe}
              disabled={!audioFile || isLoading}
              className="flex items-center justify-center gap-2 w-full max-w-xs bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <SparklesIcon />
                  <span>Transcribir Audio</span>
                </>
              )}
            </button>
          </div>

          {isLoading && (
            <div className="text-center text-sky-400 animate-pulse">{statusMessage}</div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
              <ErrorIcon />
              <p><span className="font-semibold">Error:</span> {error}</p>
            </div>
          )}
          
          {transcription && !isLoading && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-lg transition-all">
                <TranscriptionResult text={transcription} />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
