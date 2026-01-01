
import React, { useState, useEffect } from 'react';
import { Category, StageData, Block } from '../types';
import { calculateEmissions } from '../services/carbonService';
import { analyzeStageWithGemini } from '../services/geminiService';
import { 
  Loader2, CheckCircle, Lock, Clock, ShieldCheck, Sparkles, Zap, Gauge, 
  Thermometer, FlaskConical, Settings, Search, Droplets, Scale, 
  Box, Truck, Microscope, ClipboardCheck, Timer, Percent, ArrowRight,
  PlusCircle, Wand2
} from 'lucide-react';

interface ActorFormProps {
  onBlockSubmit: (actor: string, data: StageData, analysis: any, emissions: number) => void;
  categoryChains: Record<string, Block[]>;
  currentUser: string;
  currentCategory: Category;
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  placeholder: string;
  unit?: string;
  options?: string[];
  icon?: any;
}

const ROLE_FIELDS: Record<string, FieldConfig[]> = {
  'Raw Material Sourcer': [
    { name: 'moistureContent', label: 'Moisture Content', type: 'number', placeholder: 'e.g. 11.5', unit: '%', icon: Droplets },
    { name: 'qualityGrade', label: 'Raw Quality Grade', type: 'text', placeholder: 'e.g. AA / Grade 1', icon: Search },
  ],
  'Quality Grader': [
    { name: 'cuppingScore', label: 'Sensory Cupping Score', type: 'number', placeholder: '0-100', icon: ClipboardCheck },
    { name: 'defectCount', label: 'Primary Defects', type: 'number', placeholder: '0', icon: Search },
  ],
  'Roast Master': [
    { name: 'targetTemp', label: 'Target Temperature', type: 'number', placeholder: '210', unit: '°C', icon: Thermometer },
    { name: 'roastDuration', label: 'Roast Duration', type: 'number', placeholder: '12', unit: 'min', icon: Clock },
  ],
  'Ingredient Procurement Manager': [
    { name: 'purityPercentage', label: 'Ingredient Purity', type: 'number', placeholder: '99.9', unit: '%', icon: Percent },
  ],
  'Formulation Scientist': [
    { name: 'phTarget', label: 'Target pH Level', type: 'number', placeholder: '5.5', icon: FlaskConical },
  ]
};

const SAMPLE_DATA: Record<string, any> = {
  'Raw Material Sourcer': { moistureContent: 11.2, qualityGrade: 'Grade A Export', energyKwh: 1.5, verifyMethod: 'sensor', envScore: 92, notes: 'Initial harvest moisture levels are optimal for processing.' },
  'Quality Grader': { cuppingScore: 87.5, defectCount: 0, energyKwh: 0.8, verifyMethod: 'lab', envScore: 95, notes: 'Exceptional clarity and brightness in sensory profile. Zero primary defects found.' },
  'Roast Master': { targetTemp: 215, roastDuration: 11.5, energyKwh: 12.4, verifyMethod: 'sensor', envScore: 88, notes: 'Medium-dark profile achieved with standard convective heat curve.' },
  'Ingredient Procurement Manager': { purityPercentage: 99.8, energyKwh: 2.1, verifyMethod: 'lab', envScore: 91, notes: 'Sourced from certified organic suppliers with full traceability.' },
  'Formulation Scientist': { phTarget: 5.4, energyKwh: 3.2, verifyMethod: 'sensor', envScore: 89, notes: 'Batch pH stabilized within +/- 0.1 variance of target.' },
  'default': { batchVolume: 100, operationalTime: 8, energyKwh: 5.5, verifyMethod: 'manual', envScore: 85, notes: 'Standard operational run completed without anomalies.' }
};

const ActorForm: React.FC<ActorFormProps> = ({ onBlockSubmit, categoryChains, currentUser, currentCategory }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<any>({ batchId: '', energyKwh: '', notes: '', verifyMethod: '', envScore: '' });
  const [loading, setLoading] = useState(false);

  const roles = currentCategory.roles;
  const userIndex = roles.indexOf(currentUser);
  const isFirstActor = userIndex === 0;

  const availableBatches = Object.entries(categoryChains).filter(([id, blocks]) => {
      return (blocks as Block[]).length === userIndex;
  });

  const fields = ROLE_FIELDS[currentUser] || [
    { name: 'batchVolume', label: 'Batch Volume', type: 'number', placeholder: '100', unit: 'kg', icon: Gauge },
    { name: 'operationalTime', label: 'Work Time', type: 'number', placeholder: '8', unit: 'hrs', icon: Clock },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const fillSampleData = () => {
    const data = SAMPLE_DATA[currentUser] || SAMPLE_DATA['default'];
    setFormData((prev: any) => ({
      ...prev,
      ...data
    }));
  };

  const handleStartChain = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.batchId) {
          if (categoryChains[formData.batchId]) {
              alert("A Batch with this ID already exists. Please choose a unique name.");
              return;
          }
          setSelectedBatchId(formData.batchId);
          setIsCreatingNew(true);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullData: StageData = {
      actorType: currentUser,
      timestamp: Date.now(),
      category: currentCategory.id,
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
          <div className="space-y-6 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Supply Node Activity</h2>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Industrial Role: {currentUser}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isFirstActor && (
                      <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 transition-all group flex flex-col justify-between">
                          <div>
                            <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                                <PlusCircle size={24} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Initiate New Journey</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">As the first node, you can create a new Batch ID to track a product from its origin.</p>
                          </div>
                          <form onSubmit={handleStartChain} className="mt-8 space-y-4">
                              <input 
                                  className="w-full bg-white border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-950 placeholder:text-gray-400"
                                  placeholder="Enter Unique Batch Name..."
                                  value={formData.batchId}
                                  onChange={e => setFormData({...formData, batchId: e.target.value})}
                                  required
                              />
                              <button type="submit" className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all">
                                  Start Tracking <ArrowRight size={18} />
                              </button>
                          </form>
                      </div>
                  )}

                  <div className={`bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col ${!isFirstActor ? 'md:col-span-2' : ''}`}>
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600">
                                <Search size={20} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900">Active Batches</h3>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Queue: {availableBatches.length}</span>
                      </div>
                      
                      {availableBatches.length > 0 ? (
                          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                              {availableBatches.map(([id, blocks]) => (
                                  <button 
                                      key={id}
                                      onClick={() => setSelectedBatchId(id)}
                                      className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-500 hover:bg-white hover:shadow-lg transition-all group"
                                  >
                                      <div className="text-left">
                                          <p className="font-black text-gray-900 group-hover:text-blue-600">{id}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase">Started {new Date(blocks[0].timestamp).toLocaleDateString()}</p>
                                      </div>
                                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-600">
                                          <span className="text-[10px] font-black uppercase">Take Control</span>
                                          <ArrowRight size={16} />
                                      </div>
                                  </button>
                              ))}
                          </div>
                      ) : (
                          <div className="flex-grow flex flex-col items-center justify-center text-center py-10 opacity-50">
                              <Clock size={48} className="text-gray-300 mb-4" />
                              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                  Awaiting upstream data.<br/>
                                  No batches ready for {currentUser}.
                              </p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="bg-white p-10 rounded-3xl shadow-2xl border border-emerald-50 animate-in slide-in-from-bottom-5 duration-500 relative">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h2 className="text-3xl font-black text-gray-900 tracking-tight">{currentUser}</h2>
             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100">{selectedBatchId}</span>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">{currentCategory.name} Workflow</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            type="button"
            onClick={fillSampleData}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100 shadow-sm"
          >
            <Wand2 size={14} /> Auto-Fill Sample Data
          </button>
          <button onClick={() => setSelectedBatchId(null)} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2 transition-colors mr-1">
            Change Batch
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Zap size={10}/> Power Consumption (kWh)</label>
            <input name="energyKwh" value={formData.energyKwh || ''} required type="number" step="any" placeholder="Station energy use" className="input-field" onChange={handleChange} />
          </div>

          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                {field.icon && <field.icon size={10} />}
                {field.label} {field.unit && <span className="text-emerald-500">[{field.unit}]</span>}
              </label>
              <input 
                name={field.name} 
                type={field.type} 
                value={formData[field.name] || ''} 
                placeholder={field.placeholder} 
                required 
                step="any"
                className="input-field" 
                onChange={handleChange} 
              />
            </div>
          ))}

          <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><ShieldCheck size={10}/> Verification Method</label>
             <select name="verifyMethod" value={formData.verifyMethod || ''} required className="input-field appearance-none cursor-pointer" onChange={handleChange}>
                <option value="">Select Method</option>
                <option value="sensor">Automated IoT Sensors</option>
                <option value="manual">Manual Batch Inspection</option>
                <option value="lab">External Lab Analysis</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Sparkles size={10}/> Env Efficiency (0-100)</label>
             <input name="envScore" value={formData.envScore || ''} type="number" placeholder="Efficiency Rating" className="input-field" onChange={handleChange} />
           </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stage Narrative & Technical Observations</label>
            <textarea name="notes" value={formData.notes || ''} required rows={3} placeholder="Document unique findings or process deviations..." className="input-field resize-none" onChange={handleChange} />
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-200 active:translate-y-0.5">
          {loading ? <><Loader2 className="animate-spin" size={24} /> Anchoring to Chain...</> : <><CheckCircle size={24} /> Commit Verified Stage</>}
        </button>
      </form>

      <style>{`
        .input-field { 
          width: 100%; 
          padding: 1.25rem 1rem; 
          background: #ffffff !important; 
          border: 1.5px solid #f1f5f9; 
          border-radius: 1.25rem; 
          outline: none; 
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
          font-size: 0.95rem; 
          color: #020617 !important; 
          font-weight: 600; 
        }
        .input-field:hover { border-color: #cbd5e1; background: #ffffff; }
        .input-field:focus { background: white; border-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08); }
        .input-field::placeholder { color: #94a3b8; font-weight: 400; }
        input, select, textarea { color: #020617 !important; }
      `}</style>
    </div>
  );
};

export default ActorForm;
