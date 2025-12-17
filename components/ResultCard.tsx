import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SimulationResult } from '../types';
import { PRICING } from '../constants';
import { Zap, Clock, Coins } from 'lucide-react';

interface ResultCardProps {
  title: string;
  result: SimulationResult | null;
  type: 'simple' | 'context';
  isLoading: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, result, type, isLoading }) => {
  const isSimple = type === 'simple';
  const accentColor = isSimple ? 'orange' : 'purple';
  
  // Tailwind classes based on type
  const borderClass = isSimple ? 'border-orange-200' : 'border-purple-200';
  const headerText = isSimple ? 'text-orange-900' : 'text-purple-900';
  const headerBg = isSimple ? 'bg-orange-50' : 'bg-purple-50';
  const iconColor = isSimple ? 'text-orange-500' : 'text-purple-500';

  const calculateTotalCost = (usage: { promptTokens: number; outputTokens: number }) => {
    const inputCost = (usage.promptTokens / 1_000_000) * PRICING.INPUT_PER_1M;
    const outputCost = (usage.outputTokens / 1_000_000) * PRICING.OUTPUT_PER_1M;
    return (inputCost + outputCost).toFixed(6);
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl shadow-md border ${borderClass} overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${borderClass} ${headerBg} flex justify-between items-center`}>
        <div className="flex items-center gap-3">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm border ${borderClass}`}>
              <Zap className={`w-4 h-4 ${iconColor}`} />
           </div>
           <h3 className={`font-bold ${headerText} text-lg`}>{title}</h3>
        </div>
        {result && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white/60 px-2 py-1 rounded-md border border-slate-200">
             <Clock className="w-3 h-3" /> 
             {result.latencyMs}ms
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 bg-white min-h-[350px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-white/90 z-10 backdrop-blur-[2px]">
            <div className={`w-12 h-12 rounded-full border-4 border-${accentColor}-100 border-t-${accentColor}-500 animate-spin`} />
            <p className="text-sm font-medium text-slate-400 animate-pulse">Generating...</p>
          </div>
        ) : result ? (
          <div className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-h1:text-xl prose-a:text-blue-600">
            <ReactMarkdown>{result.output}</ReactMarkdown>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <Zap className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-sm font-medium">Awaiting Execution</p>
          </div>
        )}
      </div>

      {/* Metrics Footer */}
      {result && (
        <div className="bg-slate-50 border-t border-slate-100 p-4">
          <div className="grid grid-cols-2 gap-6">
             
             {/* LEFT COLUMN: INPUT */}
             <div className="flex flex-col gap-2">
                <div className="space-y-1 pb-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Base Input Tokens</span>
                        <span className="font-mono">{result.usage.baseTokens}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className={`w-1.5 h-1.5 rounded-full ${isSimple ? 'bg-orange-400' : 'bg-purple-400'}`}></span>Prompt Tokens</span>
                        <span className="font-mono">{result.usage.promptPartTokens}</span>
                    </div>
                </div>
                
                {/* Visual Grouping for Input Cost */}
                <div className="border-t border-slate-200 pt-2">
                     <div className="flex justify-between items-center bg-white/50 p-2 rounded border border-slate-100">
                        <span className="text-xs font-semibold text-slate-600">Est. Input Cost</span>
                        <span className="text-xs font-mono text-slate-600">$ {((result.usage.promptTokens / 1_000_000) * PRICING.INPUT_PER_1M).toFixed(6)}</span>
                     </div>
                </div>
             </div>

             {/* RIGHT COLUMN: OUTPUT */}
             <div className="flex flex-col gap-2 justify-between">
                <div className="space-y-1 pb-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Output Tokens</span>
                        <span className="font-mono">{result.usage.outputTokens}</span>
                    </div>
                    {/* Spacer to align with input prompt line */}
                    <div className="h-4"></div> 
                </div>

                <div className="border-t border-slate-200 pt-2">
                     <div className="flex justify-between items-center bg-white/50 p-2 rounded border border-slate-100">
                        <span className="text-xs font-semibold text-slate-600">Est. Output Cost</span>
                        <span className="text-xs font-mono text-slate-600">$ {((result.usage.outputTokens / 1_000_000) * PRICING.OUTPUT_PER_1M).toFixed(6)}</span>
                     </div>
                </div>
             </div>
          </div>

          {/* TOTALS FOOTER */}
          <div className="mt-4 pt-3 border-t border-slate-200">
             <div className="flex items-center justify-between">
                 <div className="flex gap-4">
                     <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Total Tokens</span>
                     <span className="text-xs font-mono font-bold text-slate-800">{result.usage.totalTokens}</span>
                 </div>
                 <div className={`flex gap-2 items-center ${isSimple ? 'text-orange-600' : 'text-purple-600'}`}>
                     <Coins size={14} />
                     <span className="text-xs font-bold uppercase tracking-wide">Total Cost</span>
                     <span className="text-sm font-mono font-bold">$ {calculateTotalCost(result.usage)}</span>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;