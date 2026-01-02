
import React, { useState, useEffect } from 'react';
import { Block, Category, StageData, MultiChainState } from './types';
import { createBlock } from './services/blockchainService';
import ActorForm from './components/ActorForm';
import ChainVisualizer from './components/ChainVisualizer';
import EcoViz from './components/EcoViz';
import Certificate from './components/Certificate';
import LoginPage, { CATEGORIES } from './components/LoginPage';
import Chatbot from './components/Chatbot';
import AdminDashboard from './components/AdminDashboard';
import FullScreenLLM from './components/FullScreenLLM';
import CertificatesTable from './components/CertificatesTable';
import PublicVerifier from './components/PublicVerifier';
import { 
  Leaf, LogOut, PlusCircle, Link as LinkIcon, 
  BarChart3, Database, ShieldAlert, BrainCircuit, FileBadge 
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'chain' | 'viz' | 'admin' | 'ai' | 'certs'>('input');
  
  // Public Verification State
  const [verifyingBatchId, setVerifyingBatchId] = useState<string | null>(null);
  const [isPublicView, setIsPublicView] = useState(false);

  const [chains, setChains] = useState<MultiChainState>(() => {
    const saved = localStorage.getItem('green_ledger_v3');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('green_ledger_v3', JSON.stringify(chains));
  }, [chains]);

  // Handle QR code or public verification URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calc = params.get('calc');
    const verify = params.get('verify');
    if (calc || verify) {
      setVerifyingBatchId(calc || verify);
      setIsPublicView(true);
    }
  }, []);

  const handleLogin = (category: Category, role: string, adminStatus: boolean = false) => {
      setCurrentCategory(category);
      setCurrentUser(role);
      setIsAdmin(adminStatus);
      setActiveTab(adminStatus ? 'admin' : 'input');
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentCategory(null);
      setIsAdmin(false);
      setActiveBatchId(null);
  };

  const handleBlockSubmit = async (actor: string, data: StageData, analysis: any, emissions: number) => {
    if (!currentCategory) return;
    const batchId = data.batchId;
    const catChains = chains[currentCategory.id] || {};
    const existingChain = catChains[batchId] || [];
    const newBlock = await createBlock(existingChain, actor, data, emissions, currentCategory.id, batchId, analysis);
    
    setChains({ 
      ...chains, 
      [currentCategory.id]: { 
        ...catChains, 
        [batchId]: [...existingChain, newBlock] 
      } 
    });
    setActiveBatchId(batchId);
    setActiveTab('chain');
  };

  const handleDeleteBatch = (catId: string, batchId: string) => {
    if (!isAdmin) return;
    const updatedChains = { ...chains };
    if (updatedChains[catId]) {
      delete updatedChains[catId][batchId];
    }
    setChains(updatedChains);
    if (activeBatchId === batchId) setActiveBatchId(null);
  };

  // Render Public View if triggered by URL or state
  if (isPublicView) {
    return (
      <PublicVerifier 
        initialBatchId={verifyingBatchId || undefined} 
        chains={chains} 
        onClose={() => {
          setIsPublicView(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }} 
      />
    );
  }

  if (!currentUser || !currentCategory) {
      return <LoginPage onLogin={handleLogin} />;
  }

  const activeCategoryChains = chains[currentCategory.id] || {};
  const activeChain = activeBatchId ? (activeCategoryChains[activeBatchId] || []) : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-200">
              <Leaf size={22} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Green Ledger</span>
            <div className="hidden sm:flex items-center gap-2 ml-4">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                  {currentCategory.name}
                </span>
                <span className={`text-[10px] font-bold px-2 uppercase tracking-widest ${isAdmin ? 'text-red-500' : 'text-slate-400'}`}>
                  / {currentUser}
                </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <nav className="flex gap-1">
                {isAdmin && (
                  <button onClick={() => setActiveTab('admin')} className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}>
                    <ShieldAlert size={18} /> <span className="hidden lg:inline">Admin</span>
                  </button>
                )}
                {!isAdmin && (
                  <button onClick={() => setActiveTab('input')} className={`nav-btn ${activeTab === 'input' ? 'active' : ''}`}>
                    <PlusCircle size={18} /> <span className="hidden lg:inline">Entry</span>
                  </button>
                )}
                <button onClick={() => setActiveTab('chain')} className={`nav-btn ${activeTab === 'chain' ? 'active' : ''}`}>
                  <LinkIcon size={18} /> <span className="hidden lg:inline">Ledger</span>
                </button>
                <button onClick={() => setActiveTab('viz')} className={`nav-btn ${activeTab === 'viz' ? 'active' : ''}`}>
                  <BarChart3 size={18} /> <span className="hidden lg:inline">Analytics</span>
                </button>
                <button onClick={() => setActiveTab('ai')} className={`nav-btn ${activeTab === 'ai' ? 'active' : ''}`}>
                  <BrainCircuit size={18} /> <span className="hidden lg:inline">AI Auditor</span>
                </button>
                <button onClick={() => setActiveTab('certs')} className={`nav-btn ${activeTab === 'certs' ? 'active' : ''}`}>
                  <FileBadge size={18} /> <span className="hidden lg:inline">Certs</span>
                </button>
            </nav>
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-all p-2 bg-slate-50 rounded-xl hover:bg-red-50">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        {activeTab === 'admin' && isAdmin && (
          <AdminDashboard 
            chains={chains} 
            onViewBatch={(catId, bId) => { 
              setActiveBatchId(bId); 
              setActiveTab('chain'); 
            }} 
            onDeleteBatch={handleDeleteBatch} 
          />
        )}

        {activeTab === 'input' && !isAdmin && (
          <div className="max-w-3xl mx-auto">
             <ActorForm 
               onBlockSubmit={handleBlockSubmit} 
               categoryChains={activeCategoryChains}
               currentUser={currentUser} 
               currentCategory={currentCategory} 
             />
          </div>
        )}
        
        {activeTab === 'chain' && (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><Database size={24}/></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Operational Batch</p>
                            <p className="text-xl font-black text-slate-900">{activeBatchId || 'Select a batch journey'}</p>
                        </div>
                    </div>
                    <select 
                        className="w-full md:w-64 bg-slate-50 border border-slate-200 text-sm font-bold rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                        value={activeBatchId || ''}
                        onChange={(e) => setActiveBatchId(e.target.value)}
                    >
                        <option value="">Switch Journey...</option>
                        {Object.keys(activeCategoryChains).map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>
                <ChainVisualizer chain={activeChain} validity={activeChain.map(() => true)} />
            </div>
        )}
        
        {activeTab === 'viz' && (
            <div className="animate-in fade-in duration-500">
              {activeBatchId ? <EcoViz chain={activeChain} /> : <EcoViz globalChains={chains} />}
            </div>
        )}

        {activeTab === 'ai' && (
          <FullScreenLLM chains={chains} currentUser={currentUser} />
        )}

        {activeTab === 'certs' && (
          activeBatchId && activeChain.length > 0 ? (
            <Certificate chain={activeChain} />
          ) : (
            <CertificatesTable 
              chains={chains} 
              onView={(catId, bId) => { setActiveBatchId(bId); setActiveTab('certs'); }} 
            />
          )
        )}
      </main>

      <Chatbot currentUser={currentUser} currentCategory={currentCategory.name} />

      <style>{`
        .nav-btn { 
          display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; 
          border-radius: 1rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.05em; color: #64748b; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .nav-btn:hover { background-color: #f1f5f9; color: #0f172a; }
        .nav-btn.active { background-color: #ecfdf5; color: #059669; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1); }
      `}</style>
    </div>
  );
};

export default App;
