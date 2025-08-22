import React, { useState, useCallback } from 'react';
import { UploadCloudIcon, MusicIcon, XCircleIcon } from './IconComponents';

interface AudioUploaderProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/')) {
        onFileSelect(droppedFile);
      } else {
        alert("Por favor, sube un archivo de audio válido.");
      }
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onFileSelect(null);
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {!file ? (
        <label
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging ? 'border-emerald-400 bg-slate-700/50' : 'border-slate-600 bg-slate-800 hover:bg-slate-700/50'}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloudIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-400">
              <span className="font-semibold text-emerald-400">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-slate-500">MP3, WAV, M4A, FLAC, OGG</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="audio/*"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between w-full p-4 border-2 border-solid border-emerald-700 bg-emerald-900/30 rounded-lg">
            <div className="flex items-center gap-4">
                <MusicIcon className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-slate-100 truncate max-w-xs sm:max-w-md">{file.name}</p>
                    <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                </div>
            </div>
            <button
                onClick={handleRemoveFile}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Remove file"
            >
                <XCircleIcon className="w-6 h-6" />
            </button>
        </div>
      )}
    </div>
  );
};