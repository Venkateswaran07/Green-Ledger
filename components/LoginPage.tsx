
import React, { useState } from 'react';
import { Category, FieldDefinition } from '../types';
import { 
  ArrowLeft, Flame, Beaker, Biohazard, 
  ChevronRight, ShieldAlert, Leaf, Lock,
  FlaskConical, Boxes
} from 'lucide-react';

const COMMON_FIELDS: FieldDefinition[] = [
  { id: 'envScore', label: 'Efficiency Index', type: 'number', unit: '%', placeholder: '0-100' }
];

export const CATEGORIES: Category[] = [
  {
    id: 'thermal',
    name: 'ROASTING & THERMAL PROCESSING',
    code: 100,
    icon: 'Flame',
    description: 'Advanced heat-based transformation.',
    roles: ['Raw Material Sourcer', 'Quality Grader', 'Roast Master', 'Cooling Operator', 'Degassing Supervisor', 'Packaging Specialist', 'Storage Manager'],
    roleFields: {
      'Raw Material Sourcer': [
        { id: 'weight_kg', label: 'Inbound Weight', type: 'number', unit: 'kg' },
        { id: 'transport_dist', label: 'Logistics Distance', type: 'number', unit: 'km' },
        ...COMMON_FIELDS
      ],
      'Quality Grader': [
        { id: 'moisture_content', label: 'Moisture Content', type: 'number', unit: '%' },
        { id: 'defect_count', label: 'Primary Defects', type: 'number' },
        ...COMMON_FIELDS
      ],
      'Roast Master': [
        { id: 'targetTemp', label: 'Roast Peak Temp', type: 'number', unit: '°C' },
        { id: 'energyKwh', label: 'Burner Gas Usage', type: 'number', unit: 'm³' },
        { id: 'roast_duration', label: 'Roast Time', type: 'number', unit: 'min' },
        ...COMMON_FIELDS
      ],
      'Cooling Operator': [
        { id: 'air_volume', label: 'Cooling Airflow', type: 'number', unit: 'm³/h' },
        { id: 'cooling_time', label: 'Cooling Duration', type: 'number', unit: 'sec' },
        ...COMMON_FIELDS
      ],
      'Degassing Supervisor': [
        { id: 'co2_level', label: 'CO2 Emission Level', type: 'number', unit: 'ppm' },
        { id: 'storage_days', label: 'Venting Period', type: 'number', unit: 'days' },
        ...COMMON_FIELDS
      ],
      'Packaging Specialist': [
        { id: 'material_weight', label: 'Packaging Mass', type: 'number', unit: 'g' },
        { id: 'machine_energy', label: 'Sealer Power', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Storage Manager': [
        { id: 'humidity', label: 'Silo Humidity', type: 'number', unit: '%' },
        { id: 'hvac_usage', label: 'Climate Control Energy', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ]
    },
    products: [{ id: 'coffee', name: 'Coffee', code: 101 }, { id: 'chemicals', name: 'Chemicals', code: 102 }]
  },
  {
    id: 'mixing',
    name: 'MIXING & BLENDING',
    code: 200,
    icon: 'Beaker',
    description: 'Precision ingredient batching.',
    roles: ['Ingredient Procurement Manager', 'Formulation Scientist', 'Weighing & Batching Technician', 'Mix Operator', 'Dough Technician', 'QC Analyst', 'Process Engineer'],
    roleFields: {
      'Ingredient Procurement Manager': [
        { id: 'supply_distance', label: 'Supply Origin Distance', type: 'number', unit: 'km' },
        { id: 'mass_inbound', label: 'Component Mass', type: 'number', unit: 'kg' },
        ...COMMON_FIELDS
      ],
      'Formulation Scientist': [
        { id: 'chemical_reactivity', label: 'Compound Complexity', type: 'select', options: ['Low', 'Medium', 'High'] },
        ...COMMON_FIELDS
      ],
      'Weighing & Batching Technician': [
        { id: 'energyKwh', label: 'Precision Scale Power', type: 'number', unit: 'kWh' },
        { id: 'accuracy_offset', label: 'Calibration Drift', type: 'number', unit: 'mg' },
        ...COMMON_FIELDS
      ],
      'Mix Operator': [
        { id: 'rpm', label: 'Mixer Rotation', type: 'number', unit: 'RPM' },
        { id: 'energyKwh', label: 'Mixing Power Draw', type: 'number', unit: 'kWh' },
        { id: 'duration', label: 'Mixing Cycle', type: 'number', unit: 'min' },
        ...COMMON_FIELDS
      ],
      'Dough Technician': [
        { id: 'targetTemp', label: 'Hydration Temp', type: 'number', unit: '°C' },
        { id: 'viscosity', label: 'Final Viscosity', type: 'number', unit: 'cP' },
        ...COMMON_FIELDS
      ],
      'QC Analyst': [
        { id: 'lab_waste', label: 'Testing Waste Mass', type: 'number', unit: 'g' },
        ...COMMON_FIELDS
      ],
      'Process Engineer': [
        { id: 'optimization_gain', label: 'Efficiency Improvement', type: 'number', unit: '%' },
        ...COMMON_FIELDS
      ]
    },
    products: [{ id: 'pharma', name: 'Pharma', code: 201 }, { id: 'food', name: 'Food Dough', code: 202 }]
  },
  {
    id: 'fermentation',
    name: 'FERMENTATION & CULTURING',
    code: 300,
    icon: 'Biohazard',
    description: 'Biological microbial processing.',
    roles: ['Substrate Preparer', 'Culture Master', 'Fermentation Tech', 'Maturation Supervisor', 'Microbial Controller', 'Stabilization Specialist', 'Blending Master'],
    roleFields: {
      'Substrate Preparer': [
        { id: 'volume', label: 'Medium Volume', type: 'number', unit: 'L' },
        { id: 'sterilization_temp', label: 'Sterilization Temp', type: 'number', unit: '°C' },
        ...COMMON_FIELDS
      ],
      'Culture Master': [
        { id: 'strain_purity', label: 'Strain Purity', type: 'number', unit: '%' },
        ...COMMON_FIELDS
      ],
      'Fermentation Tech': [
        { id: 'targetTemp', label: 'Incubation Temp', type: 'number', unit: '°C' },
        { id: 'oxygen_flow', label: 'Aeration Rate', type: 'number', unit: 'L/min' },
        { id: 'energyKwh', label: 'Bioreactor Agitation', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Maturation Supervisor': [
        { id: 'aging_days', label: 'Aging Duration', type: 'number', unit: 'days' },
        { id: 'energyKwh', label: 'Cooling/Heat Exchange', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Microbial Controller': [
        { id: 'cell_density', label: 'Biomass Density', type: 'number', unit: 'g/L' },
        ...COMMON_FIELDS
      ],
      'Stabilization Specialist': [
        { id: 'filtration_load', label: 'Filter Flux', type: 'number', unit: 'LMH' },
        ...COMMON_FIELDS
      ],
      'Blending Master': [
        { id: 'yield_recovery', label: 'Final Yield', type: 'number', unit: '%' },
        ...COMMON_FIELDS
      ]
    },
    products: [{ id: 'brewing', name: 'Brewing', code: 301 }, { id: 'bioplastics', name: 'Bio-plastics', code: 302 }]
  },
  {
    id: 'extraction',
    name: 'EXTRACTION & REFINING',
    code: 400,
    icon: 'FlaskConical',
    description: 'Purity-focused substance isolation.',
    roles: ['Raw Ore Handler', 'Solvent Specialist', 'Extraction Operator', 'Filtration Tech', 'Refining Manager', 'Purity Lab Analyst', 'Waste Compliance Officer'],
    roleFields: {
      'Raw Ore Handler': [
        { id: 'total_mass', label: 'Raw Intake', type: 'number', unit: 'kg' },
        ...COMMON_FIELDS
      ],
      'Solvent Specialist': [
        { id: 'solvent_volume', label: 'Solvent Charge', type: 'number', unit: 'L' },
        { id: 'recovery_rate', label: 'Recovery Efficiency', type: 'number', unit: '%' },
        ...COMMON_FIELDS
      ],
      'Extraction Operator': [
        { id: 'targetTemp', label: 'Extraction Temp', type: 'number', unit: '°C' },
        { id: 'pressure', label: 'Vessel Pressure', type: 'number', unit: 'bar' },
        { id: 'energyKwh', label: 'Pump Energy', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Filtration Tech': [
        { id: 'mesh_size', label: 'Micron Rating', type: 'number', unit: 'μm' },
        ...COMMON_FIELDS
      ],
      'Refining Manager': [
        { id: 'purity_percent', label: 'Target Purity', type: 'number', unit: '%' },
        { id: 'energyKwh', label: 'Refining Power', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Purity Lab Analyst': [
        { id: 'trace_elements', label: 'Impurities Detected', type: 'number', unit: 'ppm' },
        ...COMMON_FIELDS
      ],
      'Waste Compliance Officer': [
        { id: 'waste_treated', label: 'Hazardous Waste Neutralized', type: 'number', unit: 'L' },
        { id: 'energyKwh', label: 'Treatment Plant Energy', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ]
    },
    products: [{ id: 'oils', name: 'Essential Oils', code: 401 }, { id: 'lithium', name: 'Lithium', code: 402 }]
  },
  {
    id: 'assembly',
    name: 'ASSEMBLY & PACKAGING',
    code: 500,
    icon: 'Boxes',
    description: 'Component integration & finishing.',
    roles: ['Component Inbound', 'Micro-Assembly Tech', 'Integration Specialist', 'Quality Assurance', 'Precision Packager', 'Buffer Manager', 'Dispatch Coordinator'],
    roleFields: {
      'Component Inbound': [
        { id: 'part_count', label: 'Unit Quantities', type: 'number' },
        ...COMMON_FIELDS
      ],
      'Micro-Assembly Tech': [
        { id: 'energyKwh', label: 'Assembly Robot Power', type: 'number', unit: 'kWh' },
        { id: 'scrap_rate', label: 'Component Scrappage', type: 'number', unit: '%' },
        ...COMMON_FIELDS
      ],
      'Integration Specialist': [
        { id: 'energyKwh', label: 'Burn-in Testing Power', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Quality Assurance': [
        { id: 'failure_count', label: 'Defectives Blocked', type: 'number' },
        ...COMMON_FIELDS
      ],
      'Precision Packager': [
        { id: 'plastic_mass', label: 'Polymer Usage', type: 'number', unit: 'g' },
        ...COMMON_FIELDS
      ],
      'Buffer Manager': [
        { id: 'idle_energy', label: 'Staging Power Consumption', type: 'number', unit: 'kWh' },
        ...COMMON_FIELDS
      ],
      'Dispatch Coordinator': [
        { id: 'outbound_weight', label: 'Total Shipment Mass', type: 'number', unit: 'kg' },
        ...COMMON_FIELDS
      ]
    },
    products: [{ id: 'electronics', name: 'Electronics', code: 501 }, { id: 'packaging', name: 'Packaging', code: 502 }]
  }
];

interface LoginPageProps {
  onLogin: (category: Category, role: string, isAdmin?: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminPortal) {
      if (email === 'admin@ecochain.com' && password === 'admin123') {
        onLogin(CATEGORIES[0], 'System Administrator', true);
      }
      return;
    }
    onLogin(selectedCategory!, selectedRole!, false);
  };

  const renderIcon = (iconName: string) => {
    const props = { size: 32, className: "text-[#059669]" };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Beaker': return <Beaker {...props} />;
      case 'Biohazard': return <Biohazard {...props} />;
      case 'FlaskConical': return <FlaskConical {...props} />;
      case 'Boxes': return <Boxes {...props} />;
      default: return <Leaf {...props} />;
    }
  };

  if (isAdminPortal) {
    return (
      <div className="min-h-screen bg-[#f4fff9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#e8f5ed]">
          <button onClick={() => setIsAdminPortal(false)} className="text-slate-400 hover:text-[#059669] mb-8 flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={18} /> Back to Public Portal
          </button>
          <div className="bg-[#059669] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#05966922] mx-auto">
            <Lock size={30} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 text-center mb-2">Admin Gateway</h2>
          <p className="text-slate-400 text-sm text-center mb-8 uppercase tracking-widest font-bold">System oversight & management</p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input 
              type="email" 
              placeholder="Administrator Email" 
              className="w-full bg-[#f9fbf9] border border-[#e8f5ed] p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#05966911] focus:border-[#059669] transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Access Key" 
              className="w-full bg-[#f9fbf9] border border-[#e8f5ed] p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#05966911] focus:border-[#059669] transition-all" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit" className="w-full bg-[#059669] text-white font-black py-5 rounded-2xl hover:bg-[#047857] transition-all shadow-lg shadow-[#05966922] mt-4 uppercase tracking-widest">
              Authorize Entry
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-[#f4fff9] flex flex-col items-center pt-20 px-6">
        <div className="bg-[#059669] p-3 rounded-2xl text-white mb-6 shadow-xl shadow-[#05966933]">
          <Leaf size={40} />
        </div>
        <h1 className="text-5xl font-black text-[#1e3a2b] mb-4">Green Ledger</h1>
        <p className="text-[#059669] font-bold tracking-tight mb-20 text-lg opacity-80">Select Industrial Hierarchy Category</p>

        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.id} 
              className="bg-white rounded-[2rem] p-8 shadow-[0_15px_30px_-5px_rgba(5,150,105,0.08)] border border-transparent hover:border-[#05966922] transition-all group flex flex-col justify-between items-start min-h-[240px]"
            >
              <div className="bg-[#f0fdf4] p-5 rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                {renderIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-[#1e3a2b] mb-1">Code {cat.code}</h3>
                <p className="text-[#64748b] font-bold text-xs uppercase tracking-[0.15em] mb-6">{cat.name}</p>
                <button 
                  onClick={() => setSelectedCategory(cat)}
                  className="text-[#059669] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                >
                  Enter Domain <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
          <div className="lg:col-span-1 flex items-center justify-center">
             <button onClick={() => setIsAdminPortal(true)} className="text-slate-300 hover:text-[#059669] transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                <ShieldAlert size={14} /> System Node Gateway
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fff9] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#e8f5ed]">
        <button 
          onClick={() => { setSelectedCategory(null); setSelectedRole(null); }} 
          className="text-slate-400 hover:text-[#059669] mb-8 flex items-center gap-2 text-sm font-bold transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>
        
        <h2 className="text-3xl font-black text-[#1e3a2b] mb-2">Authority Entry</h2>
        <p className="text-slate-400 text-sm mb-10 font-medium">Identify your operational role in {selectedCategory.name}</p>

        {!selectedRole ? (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
            {selectedCategory.roles.map(role => (
              <button 
                key={role} 
                onClick={() => setSelectedRole(role)} 
                className="w-full text-left p-5 bg-[#f9fbf9] border border-[#e8f5ed] rounded-2xl text-slate-700 font-bold hover:border-[#059669] hover:bg-[#f0fdf4] hover:text-[#059669] transition-all flex justify-between items-center"
              >
                {role} <ChevronRight size={18} />
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="p-5 bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl mb-6">
              <p className="text-[10px] font-black text-[#059669] uppercase tracking-[0.2em] mb-1">Active Ledger Node</p>
              <p className="font-black text-[#1e3a2b]">{selectedRole}</p>
            </div>
            <input 
              type="email" 
              placeholder="Operator Identity Email" 
              className="w-full bg-[#f9fbf9] border border-[#e8f5ed] p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#05966911] focus:border-[#059669] transition-all" 
              required 
            />
            <input 
              type="password" 
              placeholder="Cryptographic Passphrase" 
              className="w-full bg-[#f9fbf9] border border-[#e8f5ed] p-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#05966911] focus:border-[#059669] transition-all" 
              required 
            />
            <button 
              type="submit" 
              className="w-full bg-[#059669] text-white font-black py-5 rounded-2xl hover:bg-[#047857] transition-all shadow-lg shadow-[#05966922] mt-4 uppercase tracking-widest"
            >
              Verify Authority
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
