
import React from 'react';
import { Block, MultiChainState } from '../types';
import { FileText, Download, ShieldCheck, Leaf, ExternalLink, QrCode } from 'lucide-react';
import { CATEGORIES } from './LoginPage';

interface CertificatesTableProps {
  chains: MultiChainState;
  onView: (catId: string, batchId: string) => void;
}

const CertificatesTable: React.FC<CertificatesTableProps> = ({ chains, onView }) => {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Certification Ledger</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Immutable proof of environmental stewardship</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardChains.length > 0 ? dashboardChains.map(({ catId, batchId, blocks }) => {
          const cat = CATEGORIES.find(c => c.id === catId);
          const lastBlock = blocks[blocks.length - 1];
          const avgTrust = Math.round(blocks.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / blocks.length);
          const totalEmissions = lastBlock.cumulativeEmissions;

          return (
            <div key={batchId} className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden group hover:border-emerald-500 transition-all flex flex-col">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">
                    <FileText size={20} />
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${avgTrust > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <ShieldCheck size={12} /> {avgTrust}% Trust
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 truncate mb-1">{batchId}</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{cat?.name}</p>
              </div>

              <div className="p-6 flex-grow space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total CO₂e</span>
                  <span className="font-black text-gray-900 text-lg">{totalEmissions.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Nodes</span>
                  <span className="font-black text-gray-900">{blocks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hier. ID</span>
                  <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">{lastBlock.chainId}</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 flex gap-2">
                <button 
                  onClick={() => onView(catId, batchId)}
                  className="flex-grow bg-white border border-emerald-200 text-emerald-700 font-black uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} /> View Details
                </button>
                <button 
                  onClick={() => onView(catId, batchId)}
                  className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                  title="Generate & Download Certificate"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-emerald-100 rounded-3xl text-center">
            <Leaf size={48} className="mx-auto text-emerald-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No batches ready for certification.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesTable;
