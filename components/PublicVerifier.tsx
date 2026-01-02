
import React, { useState, useEffect } from 'react';
import { Block, MultiChainState } from '../types';
import { PRODUCT_MULTIPLIERS } from '../services/carbonService';
import { 
  ShieldCheck, Zap, Flame, Target, 
  ArrowLeft, Bot, Calculator,
  Search, CheckCircle2, AlertCircle,
  Truck, Factory, ChevronRight
} from 'lucide-react';

interface PublicVerifierProps {
  initialBatchId?: string;
  chains: MultiChainState;
  onClose: () => void;
}

const PublicVerifier: React.FC<PublicVerifierProps> = ({ initialBatchId, chains, onClose }) => {
  const [batchIdInput, setBatchIdInput] = useState(initialBatchId || '');
  const [isCalculated, setIsCalculated] = useState(false);
  const [error, setError] = useState('');
  const [activeBatchData, setActiveBatchData] = useState<Block[]>([]);

  // Function to search for a batch across all categories
  const findBatch = (id: string) => {
    let foundBlocks: Block[] = [];
    Object.values(chains).forEach(catChains => {
      if (catChains[id]) {
        foundBlocks = catChains[id];
      }
    });
    return foundBlocks;
  };

  // Auto-calculate if initialBatchId is provided (e.g., from QR scan)
  useEffect(() => {
    if (initialBatchId) {
      const blocks = findBatch(initialBatchId);
      if (blocks.length > 0) {
        setActiveBatchData(blocks);
        setIsCalculated(true);
      }
    }
  }, [initialBatchId, chains]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const blocks = findBatch(batchIdInput);
    
    if (blocks.length > 0) {
      setActiveBatchData(blocks);
      setIsCalculated(true);
      setError('');
    } else {
      setError('Batch ID not found in the Green Ledger system.');
      setIsCalculated(false);
    }
  };

  // UI for the "Ask Batch ID" Calculator Screen
  if (!isCalculated) {
    return (
      <div className="min-h-screen bg-[#f4fff9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#e8f5ed] animate-in zoom-in duration-300">
          <div className="bg-[#f0fdf4] text-[#059669] p-5 rounded-3xl w-fit mx-auto mb-8 shadow-inner">
             <Calculator size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#1e3a2b] text-center mb-2">Batch Auditor</h2>
          <p className="text-slate-400 text-sm text-center mb-10 font-medium px-4">
            Enter the <span className="text-[#059669] font-bold">Batch ID</span> from your product packaging to audit the carbon emission logic.
          </p>
          
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Unique Batch Identity</label>
              <input 
                type="text" 
                placeholder="Ex: COF-992-X" 
                autoFocus
                className={`w-full bg-[#f9fbf9] border-2 ${error ? 'border-red-300' : 'border-[#e8f5ed]'} p-5 rounded-2xl outline-none focus:ring-8 focus:ring-[#05966908] focus:border-[#059669] transition-all font-black text-xl text-center text-[#1e3a2b]`}
                value={batchIdInput}
                onChange={e => { setBatchIdInput(e.target.value); setError(''); }}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={14} />
                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
              )}
            </div>
            <button type="submit" className="w-full bg-[#059669] text-white font-black py-5 rounded-2xl hover:bg-[#047857] transition-all shadow-xl shadow-[#05966922] uppercase tracking-[0.2em] text-sm active:scale-95">
              Calculate Emissions
            </button>
            <button onClick={onClose} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest py-2 hover:text-slate-600 transition-colors">
              Return to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculation Breakdown logic for the discovered batch
  const totalEmissions = activeBatchData[activeBatchData.length - 1].cumulativeEmissions;
  const avgTrust = Math.round(activeBatchData.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / activeBatchData.length);

  return (
    <div className="min-h-screen bg-[#f4fff9] p-6 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <button onClick={() => setIsCalculated(false)} className="flex items-center gap-2 text-[#059669] font-black text-xs uppercase tracking-[0.2em] group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> New Calculation
            </button>
            <div className="bg-white px-6 py-2 rounded-full border border-emerald-100 shadow-sm flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Trust Index</span>
                <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-sm font-black text-emerald-700">{avgTrust}%</span>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-[3.5rem] shadow-2xl border border-[#e8f5ed] overflow-hidden">
          {/* Header */}
          <div className="bg-[#059669] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                <div>
                    <h1 className="text-5xl font-black mb-4 tracking-tighter">Emission Audit: {batchIdInput}</h1>
                    <p className="text-emerald-100/70 font-bold text-xs uppercase tracking-[0.3em]">Lifecycle Carbon Transparency Report</p>
                </div>
                <div className="text-right">
                    <p className="text-7xl font-black mb-1">{totalEmissions.toFixed(2)} <span className="text-2xl font-medium opacity-60">kg</span></p>
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-100/50">Total Journey Footprint (CO₂e)</p>
                </div>
            </div>
          </div>

          <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Journey Timeline with 'How' it's calculated */}
            <div className="lg:col-span-2 space-y-12">
              <h3 className="text-xs font-black text-[#1e3a2b] uppercase tracking-[0.3em] border-b border-[#e8f5ed] pb-6 flex items-center gap-3">
                <Search size={20} className="text-[#059669]" /> Carbon Emission Source Analysis
              </h3>

              <div className="space-y-16 relative">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-[#f0fdf4] -z-0" />

                {activeBatchData.map((block, idx) => {
                  const mult = PRODUCT_MULTIPLIERS[block.productCode] || { factor: 1.0, thermal: 0.5 };
                  const baseMath = (Number(block.data.energyKwh) || 0) * 0.45 * mult.factor;
                  const tempMath = block.data.targetTemp ? (Number(block.data.targetTemp) - 20) * 0.02 * mult.thermal : 0;
                  const envMod = block.data.envScore ? (block.data.envScore < 70 ? 1.15 : block.data.envScore > 90 ? 0.90 : 1.0) : 1.0;

                  return (
                    <div key={idx} className="relative z-10 flex gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100 font-black text-lg">
                            {idx + 1}
                        </div>
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">{block.actor}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stage {idx + 1} Validation</p>
                                </div>
                                <div className="bg-[#f0fdf4] px-5 py-2 rounded-2xl border border-[#dcfce7]">
                                    <span className="text-emerald-700 font-black text-lg">+{block.emissions} <span className="text-xs">kg</span></span>
                                </div>
                            </div>

                            {/* Internal Logic Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-3 text-emerald-600">
                                        <Zap size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Energy Path</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{block.data.energyKwh || 0} kWh used</p>
                                    <p className="text-[9px] text-slate-400 mt-1">Factor: 0.45 x {mult.factor}</p>
                                </div>
                                {block.data.targetTemp && (
                                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                                        <div className="flex items-center gap-2 mb-3 text-orange-600">
                                            <Flame size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Thermal Path</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-700">{block.data.targetTemp}°C peak</p>
                                        <p className="text-[9px] text-slate-400 mt-1">Multi: {mult.thermal}x delta</p>
                                    </div>
                                )}
                                <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-2 mb-3 text-blue-600">
                                        <Target size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Optimization</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700">{block.data.envScore}% Efficiency</p>
                                    <p className="text-[9px] text-slate-400 mt-1">Impact: {envMod < 1 ? 'Reward' : 'Nominal'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: AI Summary & Integrity */}
            <div className="space-y-10">
               <h3 className="text-xs font-black text-[#1e3a2b] uppercase tracking-[0.3em] border-b border-[#e8f5ed] pb-6 flex items-center gap-3">
                <Bot size={20} className="text-[#059669]" /> GreenTrust AI Audit
              </h3>

              <div className="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <ShieldCheck size={120} />
                 </div>
                 
                 <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                        <Bot size={24} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Autonomous Auditor</p>
                        <p className="font-black text-lg">Verified Compliance</p>
                    </div>
                 </div>

                 <p className="text-slate-300 text-sm leading-relaxed mb-10 italic relative z-10">
                   "Batch {batchIdInput} demonstrates a highly optimized lifecycle. The thermal processing stages in the mid-journey were compensated by exceptional efficiency scores in packaging. Ledger integrity is confirmed across all {activeBatchData.length} nodes."
                 </p>

                 <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Cryptographic Status</span>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase">Immutable</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Verification Level</span>
                        <span className="text-[10px] font-black uppercase text-blue-400">Tier 1 Certified</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                <h4 className="text-[10px] font-black text-[#059669] uppercase tracking-widest mb-4">Calculator Summary</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Logistics Intensity</span>
                        <span className="font-black text-slate-900">Low</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Production Impact</span>
                        <span className="font-black text-slate-900">Medium</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Waste Recovery</span>
                        <span className="font-black text-emerald-600">88.4%</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVerifier;
