import React, { useEffect, useState, useRef } from 'react';
import { Pencil, FileText, Sparkles, Database, Calculator, DollarSign, BookOpen, Info } from 'lucide-react';
import { countGeminiTokens } from '../services/geminiService';
import { PRICING } from '../constants';

interface InputPanelProps {
  baseText: string;
  setBaseText: (text: string) => void;
  simplePrompt: string;
  setSimplePrompt: (text: string) => void;
  contextPrompt: string;
  setContextPrompt: (text: string) => void;
  isLoading: boolean;
  onRun: () => void;
  onOpenLibrary: () => void;
  apiKey: string;
}

const CostTooltip = () => (
  <div className="group relative inline-flex items-center ml-1">
    <Info size={12} className="text-slate-400 hover:text-blue-500 cursor-pointer transition-colors" />
    <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
       <div className="font-bold mb-2 border-b border-slate-600 pb-1 text-blue-300">Gemini 2.5 Flash Pricing</div>
       <div className="space-y-1 font-mono text-slate-300">
         <div className="flex justify-between"><span>Input:</span> <span>${PRICING.INPUT_PER_1M} / 1M tokens</span></div>
         <div className="flex justify-between"><span>Output:</span> <span>${PRICING.OUTPUT_PER_1M} / 1M tokens</span></div>
       </div>
       <div className="absolute -bottom-1 right-1 w-2 h-2 bg-slate-800 rotate-45"></div>
    </div>
  </div>
);

const InputPanel: React.FC<InputPanelProps> = ({
  baseText,
  setBaseText,
  simplePrompt,
  setSimplePrompt,
  contextPrompt,
  setContextPrompt,
  isLoading,
  onRun,
  onOpenLibrary,
  apiKey,
}) => {
  // Token States
  const [baseTokens, setBaseTokens] = useState(0);
  const [simplePromptTokens, setSimplePromptTokens] = useState(0);
  const [contextPromptTokens, setContextPromptTokens] = useState(0);
  const [calculating, setCalculating] = useState(false);

  // Debounce refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Combined Effect to debounce token counting
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCalculating(true);

    timerRef.current = setTimeout(async () => {
      try {
        const [baseCount, simpleCount, contextCount] = await Promise.all([
          countGeminiTokens(baseText, apiKey),
          countGeminiTokens(simplePrompt, apiKey),
          countGeminiTokens(contextPrompt, apiKey),
        ]);
        setBaseTokens(baseCount);
        setSimplePromptTokens(simpleCount);
        setContextPromptTokens(contextCount);
      } catch (e) {
        console.error("Error counting tokens", e);
      } finally {
        setCalculating(false);
      }
    }, 600); // 600ms debounce

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [baseText, simplePrompt, contextPrompt, apiKey]);

  const calculateCost = (tokens: number) => {
    return ((tokens / 1_000_000) * PRICING.INPUT_PER_1M).toFixed(6);
  };

  const SimpleTotal = baseTokens + simplePromptTokens;
  const ContextTotal = baseTokens + contextPromptTokens;

  return (
    <div className="flex flex-col gap-8 p-8 bg-white rounded-2xl shadow-lg border border-slate-100 relative">
      
      {/* Base Data Header */}
      <div className="flex justify-between items-end mb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
            <Database className="w-4 h-4 text-blue-500" />
            Base Input Data
          </label>
          
          <div className="flex gap-3">
             <button 
                onClick={onOpenLibrary}
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
             >
                <BookOpen size={14} /> Prompt Library
             </button>
          </div>
      </div>

      {/* Base Text Section */}
      <div className="space-y-2 mt-0">
        <textarea
          className="w-full h-40 p-4 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono leading-relaxed resize-none"
          placeholder="Paste your article, code, or data here..."
          value={baseText}
          onChange={(e) => setBaseText(e.target.value)}
        />
        {/* Updated Style for Base Tokens to match Prompts */}
        <div className="flex justify-end pt-1">
            <div className={`flex items-center gap-1.5 text-xs text-slate-500 transition-opacity ${calculating ? "opacity-50" : ""}`} title="Base Tokens">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {baseTokens} tokens
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        
        {/* Divider for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-slate-100 -translate-x-1/2" />

        {/* Simple Prompt Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-end border-b border-orange-100 pb-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
              <Pencil className="w-4 h-4 text-orange-500" />
              Simple Prompt
            </label>
            {/* Removed Cost from Header */}
          </div>
          
          <textarea
            className="w-full h-32 p-4 text-sm bg-white border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
            placeholder="e.g., Summarize this text."
            value={simplePrompt}
            onChange={(e) => setSimplePrompt(e.target.value)}
          />
          
          <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
            <span className="text-xs text-slate-400">Zero-shot instruction</span>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Prompt Tokens">
                    <span className="w-2 h-2 rounded-full bg-orange-300"></span>
                    {simplePromptTokens} tokens
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700" title="Total Input (Base + Prompt)">
                    <Calculator size={12} />
                    {SimpleTotal} total
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-xs text-orange-600 font-medium" title="Estimated Cost">
                    <DollarSign size={10} /> Est. Cost ${calculateCost(SimpleTotal)} <CostTooltip />
                </div>
            </div>
          </div>
        </div>

        {/* Context-Rich Prompt Section */}
        <div className="space-y-3">
        <div className="flex justify-between items-end border-b border-purple-100 pb-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Context Engineered Prompt
            </label>
            {/* Removed Cost from Header */}
          </div>

          <textarea
            className="w-full h-32 p-4 text-sm bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
            placeholder="e.g., You are a technical editor..."
            value={contextPrompt}
            onChange={(e) => setContextPrompt(e.target.value)}
          />

          <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
            <span className="text-xs text-slate-400">Contextual instruction</span>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500" title="Prompt Tokens">
                    <span className="w-2 h-2 rounded-full bg-purple-300"></span>
                    {contextPromptTokens} tokens
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700" title="Total Input (Base + Prompt)">
                    <Calculator size={12} />
                    {ContextTotal} total
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-xs text-purple-600 font-medium" title="Estimated Cost">
                    <DollarSign size={10} /> Est. Cost ${calculateCost(ContextTotal)} <CostTooltip />
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end border-t border-slate-100">
        <button
          onClick={onRun}
          disabled={isLoading || !baseText || !simplePrompt || !contextPrompt}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all transform active:scale-95
            ${isLoading || !baseText 
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-600/30 hover:to-indigo-500'
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Running Simulation...
            </>
          ) : (
            <>
              Generate Comparison <FileText className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;