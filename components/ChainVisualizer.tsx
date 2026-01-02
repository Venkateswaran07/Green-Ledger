
import React from 'react';
import { Block } from '../types';
import { Box, CheckCircle2, Star, Lock } from 'lucide-react';

interface ChainVisualizerProps {
  chain: Block[];
  validity: boolean[];
  isAdmin?: boolean;
}

const ChainVisualizer: React.FC<ChainVisualizerProps> = ({ chain, validity }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Immutable Ledger History</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Secured Cryptographic Sequence</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Integrity Score</p>
                <div className="flex gap-1 text-emerald-600">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
             </div>
             <div className="w-px h-10 bg-slate-100" />
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chain Status</p>
                <p className="text-sm font-black text-emerald-600">VERIFIED</p>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chain.map((block, idx) => {
          const isValid = validity[idx] !== false;
          const trust = block.trustAnalysis?.trustScore || 0;
          
          return (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border ${isValid ? 'border-emerald-100' : 'border-red-100'}`}>
                  {idx === 0 ? <Lock size={24} /> : <Box size={24} />}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node #00{block.index}</p>
                  <p className="text-xs font-bold text-slate-500">{new Date(block.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-1">{block.actor}</h3>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Chain ID: {block.chainId}</p>
                
                <div className="space-y-3">
                   <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Trust Analysis</span>
                      <span>{trust}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${trust > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${trust}%` }} />
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Cost</p>
                   <p className="text-2xl font-black text-slate-900">{block.emissions} <span className="text-sm font-medium text-emerald-600">kg</span></p>
                </div>
                <div className="p-2 bg-slate-50 text-emerald-600 rounded-lg">
                   <CheckCircle2 size={18} />
                </div>
              </div>
            </div>
          );
        })}

        {chain.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Awaiting genesis block initiation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChainVisualizer;
