
import React from 'react';
import { MultiChainState, Block } from '../types';
import { CATEGORIES } from './LoginPage';
import { Search, ShieldCheck, AlertTriangle, Trash2, ChevronRight, Activity, Zap, Box } from 'lucide-react';

interface AdminDashboardProps {
  chains: MultiChainState;
  onViewBatch: (catId: string, batchId: string) => void;
  onDeleteBatch: (catId: string, batchId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ chains, onViewBatch, onDeleteBatch }) => {
  
  const flattenChains = () => {
    const list: { catId: string; batchId: string; blocks: Block[] }[] = [];
    Object.entries(chains).forEach(([catId, catChains]) => {
      Object.entries(catChains).forEach(([batchId, blocks]) => {
        list.push({ catId, batchId, blocks });
      });
    });
    return list;
  };

  const dashboardChains = flattenChains();
  const totalEmissions = dashboardChains.reduce((acc, c) => acc + c.blocks[c.blocks.length - 1].cumulativeEmissions, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Oversight</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Real-time Global Supply Chain Intelligence</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><Zap size={20}/></div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Global CO₂ Impact</p>
                    <p className="font-black text-emerald-900">{totalEmissions.toFixed(2)} kg</p>
                </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Activity size={20}/></div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Active Journeys</p>
                    <p className="font-black text-blue-900">{dashboardChains.length}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry Domain</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch Identity</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Integrity</th>
                    <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {dashboardChains.length > 0 ? dashboardChains.map(({ catId, batchId, blocks }) => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    const lastBlock = blocks[blocks.length - 1];
                    const progress = (blocks.length / (cat?.roles.length || 1)) * 100;
                    const avgTrust = Math.round(blocks.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / blocks.length);
                    
                    return (
                        <tr key={batchId} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                                        {cat?.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-gray-900">{cat?.name}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center gap-2">
                                    <Box size={14} className="text-gray-400" />
                                    <span className="font-black text-gray-800">{batchId}</span>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-emerald-600 uppercase">{lastBlock.actor}</span>
                                        <span className="text-gray-400">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className={`flex items-center gap-2 font-black text-xs px-3 py-1.5 rounded-full border inline-flex
                                    ${avgTrust > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {avgTrust > 80 ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                                    {avgTrust}% Secure
                                </div>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onViewBatch(catId, batchId)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Ledger"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDeleteBatch(catId, batchId)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Archive Journey"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                            No Active Journeys Detected In Ecosystem
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
