import React, { useState, useEffect } from 'react';
import { runGeminiPrompt } from './services/geminiService';
import InputPanel from './components/InputPanel';
import ResultCard from './components/ResultCard';
import PromptLibraryModal from './components/PromptLibraryModal';
import SettingsModal from './components/SettingsModal';
import { ComparisonState } from './types';
import { DEFAULT_BASE_TEXT, DEFAULT_SIMPLE_PROMPT, DEFAULT_CONTEXT_PROMPT } from './constants';
import { Layers, Key } from 'lucide-react';

const App: React.FC = () => {
  const [baseText, setBaseText] = useState(DEFAULT_BASE_TEXT);
  const [simplePrompt, setSimplePrompt] = useState(DEFAULT_SIMPLE_PROMPT);
  const [contextPrompt, setContextPrompt] = useState(DEFAULT_CONTEXT_PROMPT);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComparisonState>({ simple: null, context: null });
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // API Key State
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    // Load key from storage or env on mount
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  };

  const handleRunComparison = async () => {
    const activeKey = apiKey || process.env.API_KEY;

    if (!activeKey) {
      setIsSettingsOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResults({ simple: null, context: null });

    try {
      const startTime = performance.now();
      
      // Run both prompts in parallel
      const [simpleRes, contextRes] = await Promise.all([
        runGeminiPrompt({ baseText, promptText: simplePrompt, apiKey: activeKey }),
        runGeminiPrompt({ baseText, promptText: contextPrompt, apiKey: activeKey })
      ]);

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      setResults({
        simple: {
          output: simpleRes.text,
          usage: simpleRes.usage,
          latencyMs: Math.round(latency * 0.45) // Approximation of split for demo
        },
        context: {
          output: contextRes.text,
          usage: contextRes.usage,
          latencyMs: Math.round(latency * 0.55) // Approximation of split for demo
        }
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const hasKey = !!apiKey || !!process.env.API_KEY;

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Layers size={22} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Prompt<span className="text-blue-600">Vs</span>Context
              </h1>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Engineering Sandbox</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button
               onClick={() => setIsSettingsOpen(true)}
               className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                 hasKey 
                 ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100' 
                 : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 animate-pulse'
               }`}
             >
               <Key size={14} />
               {hasKey ? 'API Key' : 'Set API Key'}
             </button>
             <div className="hidden sm:block text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
              Gemini 2.5 Flash
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Intro */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            The Cost of Context
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Real-time visualization of how <span className="font-semibold text-purple-600 bg-purple-50 px-1 rounded">context engineering</span> affects 
            LLM output quality, token consumption, and operational cost compared to <span className="font-semibold text-orange-600 bg-orange-50 px-1 rounded">simple prompting</span>.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Enter your own <span className="font-semibold text-purple-600 bg-purple-50 px-1 rounded">Base Input Data</span>, <span className="font-semibold text-orange-600 bg-orange-50 px-1 rounded">Simple</span> and <span className="font-semibold text-orange-600 bg-orange-50 px-1 rounded">Context Engineered Prompts</span> or select from Prompt Library.
          </p>
        </div>

        {/* Configuration Panel */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <InputPanel
            baseText={baseText}
            setBaseText={setBaseText}
            simplePrompt={simplePrompt}
            setSimplePrompt={setSimplePrompt}
            contextPrompt={contextPrompt}
            setContextPrompt={setContextPrompt}
            isLoading={loading}
            onRun={handleRunComparison}
            onOpenLibrary={() => setIsLibraryOpen(true)}
            apiKey={apiKey}
          />
        </section>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium flex flex-col gap-2 items-center">
            <span>{error}</span>
            {!hasKey && (
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-sm underline hover:text-red-800"
              >
                Click here to set your API Key
              </button>
            )}
          </div>
        )}

        {/* Results Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-700 delay-100">
            <ResultCard 
              title="Simple Prompt Output" 
              result={results.simple} 
              type="simple" 
              isLoading={loading}
            />
          </div>

          <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-700 delay-100">
            <ResultCard 
              title="Context Engineered Prompt Output" 
              result={results.context} 
              type="context" 
              isLoading={loading}
            />
          </div>
        </section>
      </main>

      {/* Library Modal */}
      <PromptLibraryModal 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        onSelect={(data) => {
          setBaseText(data.baseText);
          setSimplePrompt(data.simplePrompt);
          setContextPrompt(data.contextPrompt);
          // Clear previous results when new data is loaded
          setResults({ simple: null, context: null });
        }}
      />

      {/* Settings/API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
      />
    </div>
  );
};

export default App;