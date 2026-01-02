
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Maximize2, Minimize2, Send, Loader2, ShieldCheck, Terminal, X, Sparkles, AlertTriangle } from 'lucide-react';
import { askChatbot } from '../services/geminiService';
import { MultiChainState } from '../types';

interface FullScreenLLMProps {
  chains: MultiChainState;
  currentUser: string;
}

const FullScreenLLM: React.FC<FullScreenLLMProps> = ({ chains, currentUser }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // FIXED: Properly passing the industrial data context to the chatbot call
    const dataContext = `SYSTEM CONTEXT: You are an industrial supply chain auditor for the Green Ledger platform. Current data state: ${JSON.stringify(chains)}. Analyze requested batch or provide cross-chain compliance reports.`;
    const response = await askChatbot(`${dataContext}\n\nQuery: ${userMsg}`, messages, { role: currentUser, category: 'Global Auditor' });
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 ${isFullscreen ? 'h-screen w-screen rounded-none' : 'h-[600px] shadow-2xl'}`}
    >
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 ring-1 ring-emerald-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tight flex items-center gap-2">
              Green Ledger AI Auditor 
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase">Neural Engine v3</span>
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Autonomous Compliance & Integrity Verification</p>
          </div>
        </div>
        <button 
          onClick={toggleFullscreen}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Main Area */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Context */}
        <div className="hidden md:block w-72 border-r border-slate-800 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Datasets</p>
            {Object.keys(chains).length > 0 ? Object.entries(chains).map(([cat, batches]) => (
              <div key={cat} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-emerald-400 mb-1">{cat}</p>
                <p className="text-[10px] text-slate-500 font-mono">{Object.keys(batches).length} Batch(es) Detected</p>
              </div>
            )) : (
              <p className="text-xs text-slate-600 italic">No ledger data available for auditing.</p>
            )}
          </div>
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
             <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase">Capabilities</span>
             </div>
             <ul className="text-[10px] text-slate-400 space-y-2">
                <li>• Anomaly Detection</li>
                <li>• CO₂e Optimization</li>
                <li>• Fraud Verification</li>
                <li>• Process Hardening</li>
             </ul>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-grow flex flex-col bg-slate-950">
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-slate-800">
                  <Terminal size={32} />
                </div>
                <h4 className="text-slate-300 font-black text-xl mb-2">Ready for Neural Audit</h4>
                <p className="text-slate-500 text-sm">Query the Green Ledger for anomalies, efficiency metrics, or verification reports. I have direct access to all hierarchical chain data.</p>
                <div className="mt-8 flex flex-wrap gap-2 justify-center">
                  {['Audit Coffee batches', 'Check for carbon anomalies', 'Verify Stage 100 hierarchy'].map(suggestion => (
                    <button key={suggestion} onClick={() => { setInput(suggestion); }} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-all">
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-emerald-600 text-white font-bold rounded-tr-none' : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none shadow-xl'}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-400">
                  <Loader2 size={18} className="animate-spin text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Analyzing Cryptographic Ledger...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800">
            <form onSubmit={handleAudit} className="max-w-4xl mx-auto flex gap-4">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: 'Run a cross-chain carbon report' or 'Find anomalies in Batch-123'..."
                className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-emerald-600 text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLLM;
