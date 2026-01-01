
import React from 'react';
import { Block } from '../types';
import { ShieldCheck, Leaf, Download } from 'lucide-react';

interface CertificateProps {
  chain: Block[];
}

const Certificate: React.FC<CertificateProps> = ({ chain }) => {
  const totalEmissions = chain.reduce((acc, b) => acc + b.emissions, 0);
  const avgTrust = Math.round(chain.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / (chain.length || 1));
  const finalHash = chain.length > 0 ? chain[chain.length - 1].hash : "N/A";

  const handleDownload = () => {
    window.print();
  };

  // CORRECT QR Code: Using the final block hash as the unique identity for verification
  // bgcolor=ffffff and color=059669 (emerald-600)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalHash)}&bgcolor=ffffff&color=059669&margin=2`;

  return (
    <div className="flex flex-col items-center gap-8 animate-in fade-in duration-500">
        
        {/* Certificate Container */}
        <div id="certificate-print-area" className="w-full max-w-3xl bg-white p-12 shadow-2xl border-t-8 border-emerald-600 rounded-sm relative overflow-hidden print:shadow-none print:border-t-0 print:p-0">
          
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <Leaf size={500} />
          </div>

          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h1 className="text-4xl font-serif text-gray-900 mb-2">Carbon Integrity Certificate</h1>
              <p className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold">EcoChain Secured Protocol • ID: {finalHash.slice(0, 12).toUpperCase()}</p>
            </div>
            <div className="text-emerald-600 drop-shadow-sm">
                <ShieldCheck size={56} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 print:bg-white print:border-gray-200">
                <h3 className="text-emerald-800 text-[10px] font-black uppercase tracking-widest mb-2 print:text-black">Audit Carbon Footprint</h3>
                <p className="text-4xl font-black text-emerald-900 print:text-black leading-none">{totalEmissions.toFixed(2)} <span className="text-lg font-normal text-emerald-600">kg CO₂e</span></p>
            </div>
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 print:bg-white print:border-gray-200">
                <h3 className="text-blue-800 text-[10px] font-black uppercase tracking-widest mb-2 print:text-black">Verification Trust Avg</h3>
                <p className="text-4xl font-black text-blue-900 print:text-black leading-none">{avgTrust}% <span className="text-lg font-normal text-blue-600">Verified</span></p>
            </div>
          </div>

          <div className="mb-12 relative z-10">
            <h3 className="text-gray-400 font-black uppercase text-[10px] tracking-widest border-b border-gray-100 pb-3 mb-6">Chain of Provenance</h3>
            <div className="space-y-4">
                {chain.map((b) => (
                    <div key={b.index} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-0">
                        <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                                 {b.index + 1}
                             </div>
                             <div>
                                <span className="text-gray-900 font-bold text-lg leading-none">{b.actor}</span>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Node</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-emerald-800 font-black text-lg">{b.emissions} kg</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-gray-100 pt-10 relative z-10">
            <div className="max-w-[60%]">
                <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">Digital Ledger Signature</p>
                <p className="font-mono text-[9px] text-gray-400 break-all leading-tight bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">{finalHash}</p>
                <div className="space-y-1">
                    <p className="text-xs text-gray-900 font-black uppercase tracking-tighter">EcoChain GreenTrust Certification Authority</p>
                    <p className="text-[10px] text-gray-400 font-medium">ISSUED: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-50 shadow-inner flex items-center justify-center">
                  <img src={qrUrl} alt="Verify Supply Chain Integrity" className="w-28 h-28 rounded-lg" />
                </div>
                <div className="text-center">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-tight block">Scan to Verify<br/>Blockchain Hash</span>
                </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 print:hidden">
            <button 
                onClick={handleDownload}
                className="flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all font-black uppercase tracking-widest text-sm active:scale-95"
            >
                <Download size={20} />
                Export Verification PDF
            </button>
        </div>
    </div>
  );
};

export default Certificate;
