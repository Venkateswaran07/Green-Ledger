
import React, { useState, useEffect } from 'react';
import { Block, Category, StageData, ActorType, MultiChainState } from '../types';
import { createBlock, validateChain } from '../services/blockchainService';
import ActorForm from '../components/ActorForm';
import ChainVisualizer from '../components/ChainVisualizer';
import EcoViz from '../components/EcoViz';
import Certificate from '../components/Certificate';
import LoginPage, { CATEGORIES } from '../components/LoginPage';
import Chatbot from '../components/Chatbot';
import AdminDashboard from '../components/AdminDashboard';
import { Leaf, PlusCircle, Link as LinkIcon, BarChart3, FileBadge, LogOut, ShieldAlert, Settings, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // CategoryID -> BatchID -> Blocks[]
  const [chains, setChains] = useState<MultiChainState>({});
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'chain' | 'viz' | 'cert' | 'admin'>('input');
  
  // Load initial state if needed
  useEffect(() => {
    const saved = localStorage.getItem('ecochain_ledger_v3');
    if (saved) {
        setChains(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecochain_ledger_v3', JSON.stringify(chains));
  }, [chains]);

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

    // Fix: Updated call to createBlock with required categoryId and batchId
    const newBlock = await createBlock(existingChain, actor, data, emissions, currentCategory.id, batchId, analysis);
    
    const updatedChains = {
        ...chains,
        [currentCategory.id]: {
            ...catChains,
            [batchId]: [...existingChain, newBlock]
        }
    };

    setChains(updatedChains);
    setActiveBatchId(batchId);
    setActiveTab('chain');
  };

  const handleDeleteBatch = (catId: string, batchId: string) => {
    if (!isAdmin) return;
    const updatedChains = { ...chains };
    delete updatedChains[catId][batchId];
    setChains(updatedChains);
    if (activeBatchId === batchId) setActiveBatchId(null);
  };

  if (!currentUser || !currentCategory) {
      return <LoginPage onLogin={handleLogin} />;
  }

  const activeCategoryChains = chains[currentCategory.id] || {};
  const activeChain = activeBatchId ? (activeCategoryChains[activeBatchId] || []) : [];

  return (
    <div className="min-h-screen bg-emerald-50/50 flex flex-col">
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-200"><Leaf size={20} /></div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EcoChain</span>
            <div className="ml-4 flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{currentCategory.name}</span>
                {isAdmin ? (
                    <span className="text-[10px] font-bold text-white bg-red-600 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldAlert size={10} /> SYSTEM ADMIN
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 font-bold tracking-tight px-2">/ {currentUser}</span>
                )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
                {isAdmin && (
                  <button onClick={() => setActiveTab('admin')} className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}>
                    <LayoutDashboard size={18} /> <span className="hidden md:inline">Dashboard</span>
                  </button>
                )}
                {!isAdmin && (
                  <button onClick={() => setActiveTab('input')} className={`nav-btn ${activeTab === 'input' ? 'active' : ''}`}>
                    <PlusCircle size={18} /> <span className="hidden md:inline">Data Entry</span>
                  </button>
                )}
                <button onClick={() => setActiveTab('chain')} className={`nav-btn ${activeTab === 'chain' ? 'active' : ''}`}>
                <LinkIcon size={18} /> <span className="hidden md:inline">Ledger</span>
                </button>
                <button onClick={() => setActiveTab('viz')} className={`nav-btn ${activeTab === 'viz' ? 'active' : ''}`}>
                <BarChart3 size={18} /> <span className="hidden md:inline">Analytics</span>
                </button>
                <button onClick={() => setActiveTab('cert')} className={`nav-btn ${activeTab === 'cert' ? 'active' : ''}`}>
                <FileBadge size={18} /> <span className="hidden md:inline">Certify</span>
                </button>
            </nav>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-all p-2 bg-gray-50 rounded-full hover:bg-red-50"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 relative">
        {activeTab === 'admin' && isAdmin && (
            <AdminDashboard 
                chains={chains} 
                onViewBatch={(catId, batchId) => {
                    const cat = CATEGORIES.find(c => c.id === catId);
                    if (cat) {
                        setCurrentCategory(cat);
                        setActiveBatchId(batchId);
                        setActiveTab('chain');
                    }
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
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><PlusCircle size={20}/></div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Journey</p>
                            <p className="font-black text-emerald-900">{activeBatchId || 'No Batch Selected'}</p>
                        </div>
                    </div>
                    <select 
                        className="bg-gray-50 border border-gray-100 text-xs font-bold text-slate-950 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        value={activeBatchId || ''}
                        onChange={(e) => setActiveBatchId(e.target.value)}
                    >
                        <option value="" className="text-gray-400">Switch Batch...</option>
                        {Object.keys(activeCategoryChains).map(id => (
                            <option key={id} value={id} className="text-slate-950 font-bold">{id}</option>
                        ))}
                    </select>
                </div>
                {activeBatchId ? (
                    <ChainVisualizer 
                        chain={activeChain} 
                        validity={activeChain.map(() => true)} 
                        isAdmin={isAdmin}
                    />
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold">Select a Batch ID from the list above to view its immutable ledger.</p>
                    </div>
                )}
            </div>
        )}
        
        {activeTab === 'viz' && (
            activeBatchId ? <EcoViz chain={activeChain} /> : 
            <div className="text-center py-20 text-gray-400 font-bold">Please select an active Batch in the Ledger tab first.</div>
        )}
        
        {activeTab === 'cert' && (
            activeBatchId ? <Certificate chain={activeChain} /> : 
            <div className="text-center py-20 text-gray-400 font-bold">A specific Batch must be selected to generate a Carbon Integrity Certificate.</div>
        )}
      </main>

      <Chatbot currentUser={isAdmin ? "System Admin" : currentUser} currentCategory={currentCategory.name} />

      <style>{`
        .nav-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 600; color: #64748b; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-btn:hover { background-color: #f1f5f9; color: #0f172a; }
        .nav-btn.active { background-color: #ecfdf5; color: #059669; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        select { color: #020617 !important; }
      `}</style>
    </div>
  );
};

export default App;
