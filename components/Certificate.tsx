
import React from 'react';
import { Block } from '../types';
import { ShieldCheck, Leaf, Download, ExternalLink } from 'lucide-react';

interface CertificateProps {
  chain: Block[];
}

const Certificate: React.FC<CertificateProps> = ({ chain }) => {
  const totalEmissions = chain.reduce((acc, b) => acc + b.emissions, 0);
  const avgTrust = Math.round(chain.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / (chain.length || 1));
  const batchId = chain.length > 0 ? chain[0].batchId : "N/A";

  // Robust target URL construction for localhost and production
  const baseUrl = window.location.origin + window.location.pathname;
  const verifyUrl = `${baseUrl}?calc=${encodeURIComponent(batchId)}`;
  
  // High-fidelity QR Code URL using the emerald color (059669)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}&bgcolor=ffffff&color=059669&margin=1`;

  const handleDownload = () => {
    // Triggers the system print dialog. 
    // The CSS below ensures only the certificate is visible and formatted for PDF.
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-12 animate-in fade-in duration-700 pb-20">
        
        {/* Certificate Printable Area */}
        <div id="certificate-content" className="w-full max-w-4xl bg-white p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-[1px] border-emerald-100 rounded-lg relative overflow-hidden print:shadow-none print:border-0 print:p-10 print:m-0">
          
          {/* Subtle Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none scale-150">
              <Leaf size={600} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-start mb-20 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-1.5 bg-emerald-600 rounded-full" />
                 <span className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.4em]">EcoChain Verified</span>
              </div>
              <h1 className="text-6xl font-serif text-slate-900 mb-4 leading-tight">Carbon Integrity <br/>Certificate</h1>
              <p className="text-slate-400 uppercase tracking-[0.2em] text-[11px] font-black flex items-center gap-2">
                Digital Ledger Authenticated <span className="w-1 h-1 bg-slate-300 rounded-full" /> Batch: {batchId}
              </p>
            </div>
            <div className="text-emerald-600">
                <ShieldCheck size={100} strokeWidth={1} />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-12 mb-20 relative z-10">
            <div className="p-10 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                <h3 className="text-emerald-800 text-[11px] font-black uppercase tracking-[0.3em] mb-6">Audited Carbon Footprint</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-emerald-900">{totalEmissions.toFixed(2)}</span>
                    <span className="text-2xl font-medium text-emerald-600">kg CO₂e</span>
                </div>
            </div>
            <div className="p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-6">Blockchain Trust Score</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900">{avgTrust}%</span>
                    <span className="text-2xl font-medium text-slate-400">Verified</span>
                </div>
            </div>
          </div>

          {/* Footer with QR and Legal */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-t border-slate-100 pt-16 relative z-10 gap-10">
            <div className="text-center md:text-left">
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2">EcoChain Certification Authority</h4>
                <p className="text-slate-400 text-xs font-medium max-w-md leading-relaxed">
                    This document serves as immutable proof of environmental compliance. Scanning the companion QR code provides direct access to the underlying mathematical calculations and cryptographic ledger nodes.
                </p>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-6">
                    Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
            
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-emerald-900/5">
                <div className="bg-white p-2 rounded-2xl border border-emerald-50">
                   <img 
                    src={qrUrl} 
                    alt="SCAN TO OPEN CARBON CALCULATOR" 
                    className="w-32 h-32" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=QR+Error'; }}
                   />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-black text-[#059669] uppercase tracking-[0.2em] block leading-relaxed">
                    SCAN TO OPEN <br/>CARBON CALCULATOR
                  </span>
                </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Hidden in Print */}
        <div className="flex flex-col sm:flex-row gap-6 print:hidden items-center">
            <button 
                onClick={handleDownload}
                className="flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-full hover:bg-slate-800 shadow-2xl transition-all font-black uppercase tracking-[0.2em] text-sm active:scale-95 group"
            >
                <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
                DOWNLOAD INTEGRITY PDF
            </button>
            <a 
              href={verifyUrl}
              target="_blank"
              className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-10 py-5 rounded-full hover:bg-emerald-100 transition-all font-black uppercase tracking-[0.2em] text-xs"
            >
              <ExternalLink size={18} />
              OPEN AUDITOR PAGE
            </a>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body { background: white !important; padding: 0 !important; margin: 0 !important; -webkit-print-color-adjust: exact; }
            header, nav, .fixed, .print\\:hidden, button, footer, .Chatbot { display: none !important; }
            #root { padding: 0 !important; }
            main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: none !important; }
            #certificate-content { 
              box-shadow: none !important; 
              border: 0 !important; 
              width: 100% !important; 
              max-width: none !important; 
              height: auto !important;
              page-break-after: avoid;
              margin: 0 !important;
              padding: 40px !important;
            }
          }
          @page { size: A4; margin: 0; }
        `}} />
    </div>
  );
};

export default Certificate;
