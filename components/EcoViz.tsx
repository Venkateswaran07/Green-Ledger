
import React from 'react';
import { Block, MultiChainState } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface EcoVizProps {
  chain?: Block[];
  globalChains?: MultiChainState;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

const EcoViz: React.FC<EcoVizProps> = ({ chain, globalChains }) => {
  
  // Prepare data based on mode (Global vs Single Chain)
  const isGlobal = !!globalChains;
  
  const getGlobalData = () => {
    if (!globalChains) return [];
    const categoryAggregates: Record<string, { name: string, emissions: number, count: number, trust: number }> = {};
    
    Object.entries(globalChains).forEach(([catId, batches]) => {
      Object.entries(batches).forEach(([batchId, blocks]) => {
        const lastBlock = blocks[blocks.length - 1];
        if (!categoryAggregates[catId]) {
          categoryAggregates[catId] = { name: lastBlock.category, emissions: 0, count: 0, trust: 0 };
        }
        categoryAggregates[catId].emissions += lastBlock.cumulativeEmissions;
        categoryAggregates[catId].count += 1;
        categoryAggregates[catId].trust += blocks.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / blocks.length;
      });
    });

    return Object.values(categoryAggregates).map(v => ({
      ...v,
      avgTrust: Math.round(v.trust / v.count)
    }));
  };

  const getSingleChainData = () => {
    if (!chain) return [];
    return chain.map(b => ({
      name: b.actor,
      emissions: b.emissions,
      cumulative: b.cumulativeEmissions,
      trust: b.trustAnalysis?.trustScore || 0,
    }));
  };

  const data = isGlobal ? getGlobalData() : getSingleChainData();
  const totalEmissions = isGlobal 
    ? data.reduce((acc: number, curr: any) => acc + curr.emissions, 0)
    : (chain?.reduce((acc, curr) => acc + curr.emissions, 0) || 0);

  const avgTrust = Math.round(
    isGlobal 
      ? (data.reduce((acc: number, curr: any) => acc + curr.avgTrust, 0) / (data.length || 1))
      : (chain?.reduce((acc, b) => acc + (b.trustAnalysis?.trustScore || 0), 0) / (chain?.length || 1)) || 0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Organization Impact</p>
          <p className="text-4xl font-black text-emerald-900 leading-none">{totalEmissions.toFixed(2)} <span className="text-sm font-medium text-emerald-600">kg CO₂e</span></p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Ecosystem Integrity</p>
          <p className="text-4xl font-black text-blue-900 leading-none">{avgTrust}% <span className="text-sm font-medium text-blue-600">Verified</span></p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{isGlobal ? 'Industry Domains' : 'Process Nodes'}</p>
          <p className="text-4xl font-black text-emerald-900 leading-none">{data.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Emissions Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            {isGlobal ? 'Carbon Intensity by Sector' : 'Stage Impact Breakdown'}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="emissions" fill="#059669" name="CO₂e (kg)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Breakdown (Global Only) or Cumulative (Single) */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            {isGlobal ? 'Industry Contribution %' : 'Carbon Accretion Trend'}
          </h3>
          <div className="h-72">
            {isGlobal ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="emissions"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cumulative" stroke="#059669" strokeWidth={4} fillOpacity={1} fill="url(#colorCum)" name="Total CO₂e" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Integrity Matrix */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              Sustainability vs. Trust Integrity Matrix
            </h3>
             <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="name" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar yAxisId="left" dataKey="emissions" barSize={40} fill="#059669" name="CO₂ Emissions" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="stepAfter" dataKey={isGlobal ? "avgTrust" : "trust"} stroke="#d97706" strokeWidth={4} name="AI Trust Index" dot={{ r: 6, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoViz;
