import React from 'react';
import { PROMPT_LIBRARY, PromptSet } from '../data/promptLibrary';
import { X, Check, BookOpen } from 'lucide-react';

interface PromptLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (set: PromptSet) => void;
}

const PromptLibraryModal: React.FC<PromptLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <BookOpen size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Prompt Library</h2>
                <p className="text-xs text-slate-500">Select a pre-configured scenario to test</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
          <div className="grid gap-6">
            {PROMPT_LIBRARY.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  
                  {/* Info Column */}
                  <div className="p-5 md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between shrink-0">
                    <div>
                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 mb-3">
                        {item.category}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{item.title}</h3>
                    </div>
                    <button
                        onClick={() => {
                            onSelect(item);
                            onClose();
                        }}
                        className="mt-4 md:mt-0 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Check size={16} /> Load Scenario
                    </button>
                  </div>

                  {/* Content Columns */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    
                    {/* Base Input */}
                    <div className="p-4 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            Base Input
                        </div>
                        <p className="text-xs text-slate-600 font-mono line-clamp-6 leading-relaxed">
                            {item.baseText}
                        </p>
                    </div>

                    {/* Simple Prompt */}
                    <div className="p-4 space-y-2 bg-orange-50/10">
                        <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                            Regular Prompt
                        </div>
                        <p className="text-xs text-slate-700 font-medium line-clamp-6 leading-relaxed">
                            {item.simplePrompt}
                        </p>
                    </div>

                    {/* Context Prompt */}
                    <div className="p-4 space-y-2 bg-purple-50/10">
                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                            Context Prompt
                        </div>
                        <p className="text-xs text-slate-700 font-medium line-clamp-6 leading-relaxed">
                            {item.contextPrompt}
                        </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptLibraryModal;