
import React, { useState } from 'react';
import { Category, StageData, Block, Product, FieldDefinition } from '../types';
import { calculateEmissions } from '../services/carbonService';
import { analyzeStageWithGemini } from '../services/geminiService';
import { 
  Loader2, CheckCircle, Clock, ArrowRight,
  PlusCircle, Database
} from 'lucide-react';

interface ActorFormProps {
  onBlockSubmit: (actor: string, data: StageData, analysis: any, emissions: number) => void;
  categoryChains: Record<string, Block[]>;
  currentUser: string;
  currentCategory: Category;
}

const ActorForm: React.FC<ActorFormProps> = ({ onBlockSubmit, categoryChains, currentUser, currentCategory }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const roles = currentCategory.roles;
  const userIndex = roles.indexOf(currentUser);
  const isFirstActor = userIndex === 0;

  // Get specific fields for current role
  const roleFields: FieldDefinition[] = currentCategory.roleFields[currentUser] || [];

  const availableBatches = (Object.entries(categoryChains) as [string, Block[]][]).filter(([id, blocks]) => {
      return blocks.length === userIndex;
  });

  const handleStartChain = (e: React.FormEvent) => {
      e.preventDefault();
      setSelectedBatchId(formData.batchId);
      setIsCreatingNew(true);
  };

  const handleDemoFill = () => {
    const demo: Record<string, any> = {};
    roleFields.forEach(field => {
      if (field.type === 'number') {
        demo[field.id] = Math.floor(Math.random() * 100) + 10;
      } else if (field.type === 'select' && field.options) {
        demo[field.id] = field.options[0];
      } else {
        demo[field.id] = "Verified entry";
      }
    });
    demo.notes = "System auto-validated telemetry data. Compliance checks cleared.";
    setFormData(demo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const productCode = selectedProduct?.code || (availableBatches.length > 0 ? (availableBatches[0][1][0].productCode) : 0);
    const chainId = `${currentCategory.code}-${productCode}`;

    const fullData: StageData = {
      actorType: currentUser,
      timestamp: Date.now(),
      category: currentCategory.id,
      productCode,
      chainId,
      ...formData,
      batchId: selectedBatchId || formData.batchId
    };

    const emissions = calculateEmissions(fullData);
    const analysis = await analyzeStageWithGemini(currentUser, fullData);
    onBlockSubmit(currentUser, fullData, analysis, emissions);
    setLoading(false);
  };

  if (!selectedBatchId && !isCreatingNew) {
      return (
          <div className="space-y-8 animate-in fade-in duration-500 text-slate-900">
              <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Supply Node Operations</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Node Authority: {currentUser}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isFirstActor && (
                      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                             <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><PlusCircle size={20} /></div>
                             Initialize New Batch
                          </h3>
                          <form onSubmit={handleStartChain} className="space-y-4">
                              <select 
                                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-bold outline-none focus:border-emerald-500"
                                  onChange={e => setSelectedProduct(currentCategory.products.find(p => p.id === e.target.value) || null)}
                                  required
                              >
                                  <option value="">Select Product Line</option>
                                  {currentCategory.products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                              </select>
                              <input 
                                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-bold outline-none focus:border-emerald-500"
                                  placeholder="New Batch Identity"
                                  value={formData.batchId || ''}
                                  onChange={e => setFormData({...formData, batchId: e.target.value})}
                                  required
                              />
                              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                Genesis Node Entry
                              </button>
                          </form>
                      </div>
                  )}

                  <div className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 ${!isFirstActor ? 'md:col-span-2' : ''}`}>
                      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                         <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Database size={20} /></div>
                         Awaiting My Validation
                      </h3>
                      {availableBatches.length > 0 ? (
                          <div className="space-y-3">
                              {availableBatches.map(([id, blocks]) => (
                                  <button key={id} onClick={() => setSelectedBatchId(id)} className="w-full flex justify-between items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-500 transition-all group">
                                      <div className="text-left">
                                          <p className="font-bold text-slate-900">{id}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stage {blocks.length + 1} Pending</p>
                                      </div>
                                      <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-600" />
                                  </button>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-12 text-slate-300">
                              <Clock size={40} className="mx-auto mb-3 opacity-20" />
                              <p className="text-xs font-bold uppercase tracking-widest">No batches pending validation</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl animate-in slide-in-from-bottom-5 duration-500 text-slate-900">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{currentUser} Node Entry</h2>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">{selectedBatchId}</span>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">Stage {userIndex + 1}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDemoFill} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-lg transition-colors">Demo Data</button>
          <button onClick={() => { setSelectedBatchId(null); setFormData({}); setIsCreatingNew(false); }} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-lg transition-colors">Cancel</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {field.label} {field.unit && `(${field.unit})`}
              </label>
              
              {field.type === 'select' ? (
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={formData[field.id] || ''}
                  onChange={e => setFormData({...formData, [field.id]: e.target.value})}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input 
                  required 
                  type={field.type === 'number' ? 'number' : 'text'} 
                  step="any" 
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" 
                  onChange={e => setFormData({...formData, [field.id]: e.target.value})} 
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Observations</label>
            <textarea 
              name="notes" 
              value={formData.notes || ''}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[120px] transition-all" 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
            />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-black py-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 uppercase tracking-widest">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Commit to Ledger</>}
        </button>
      </form>
    </div>
  );
};

export default ActorForm;
