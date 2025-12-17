import React, { useState, useEffect } from 'react';
import { X, Key, Save, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKey, onSaveKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey);
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                <Key size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">API Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
             <div className="flex items-start gap-3">
               <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <p className="text-sm text-blue-800 leading-relaxed">
                 Your API key is stored locally in your browser's storage. It is sent directly to Google's servers and is never stored on any intermediate backend.
               </p>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Gemini API Key</label>
            <input 
              type="password" 
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-sm"
            />
            <a 
              href="https://aistudiocdn.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Get a free API key from Google AI Studio <ExternalLink size={10} />
            </a>
          </div>

          <div className="flex gap-3 pt-2">
             <button
                onClick={handleClear}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
             >
                <Trash2 size={18} /> Clear
             </button>
             <button
                onClick={handleSave}
                disabled={!inputKey}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Save size={18} /> Save Key
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;