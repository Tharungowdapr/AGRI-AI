
import React from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  ArrowUpRight,
  Plane,
  ChevronRight,
  Target
} from 'lucide-react';

const EnhancementPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-left">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">
            Core Uplink <ChevronRight size={10} /> Intelligence Insights <ChevronRight size={10} /> Architecture Analysis
          </div>
          <h1 className="text-7xl font-heading font-black text-stone-900 tracking-tighter leading-none">System Enhancement <br /><span className="text-primary italic">Analysis Q3-24</span></h1>
          <p className="text-xl text-stone-500 font-medium max-w-2xl leading-relaxed italic">
            "A technical breakdown of existing neural capabilities versus prioritized architectural expansion targeted for Q3 2024 optimization."
          </p>
        </div>
        <button className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-xl hover:bg-primary transition-all">
          <Download size={20} /> Download Technical Ledger
        </button>
      </div>

      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnalysisMetric label="Current Model Accuracy" value="94.2%" sub="+2.1%" icon={Zap} up accent />
        <AnalysisMetric label="Active Neural Nodes" value="12" sub="+4 Global" icon={Cpu} accent />
        <AnalysisMetric label="Relational Data Hubs" value="5" sub="+1 Local" icon={Database} accent />
        <AnalysisMetric label="Network Uptime Index" value="99.9%" sub="STABLE" icon={Activity} success />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Existing Assets */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary border border-primary/20 shadow-inner">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-3xl font-heading font-black text-stone-800 tracking-tight">Active Neural Assets</h3>
          </div>
          
          <div className="space-y-6">
            <AssetCard 
              title="Real-time Pathogen Detection" 
              desc="Deployment of computer vision diagnostics operating at 98% precision across 5 major regional species."
              tags={['Vision Core', 'Low Latency']}
              status="Live Node"
            />
            <AssetCard 
              title="Multilingual Indic-NLP" 
              desc="Localized semantic interface with voice synthesis for Kannada and regional dialects."
              tags={['NLP Node', 'Voice Out']}
              status="Native Core"
            />
            <AssetCard 
              title="Liquidity Arbitrage Hub" 
              desc="Historical and real-time mandi valuation streams synchronized with 15 APMC regional hubs."
              tags={['Market Sync', 'APMC Portal']}
              status="Synchronized"
            />
          </div>
        </section>

        {/* Priority Expansion */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-600 border border-amber-500/20 shadow-inner">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-3xl font-heading font-black text-stone-800 tracking-tight">Critical Node Expansion</h3>
          </div>
          
          <div className="space-y-6">
            <ProjectCard 
              title="Decentralized Execution & Sync" 
              desc="Implementing localized AI diagnostics for remote nodes with limited network uplink capabilities."
              priority="High Criticality"
              progress={35}
            />
            <ProjectCard 
              title="Micro-Meteorological Sensors" 
              desc="Transition from regional IMD forecasts to hyper-local farm-specific IoT atmospheric monitoring."
              priority="Projected"
              progress={10}
            />
            <ProjectCard 
              title="UAV Integration Protocol" 
              desc="Standardized API for drone telemetry upload and automated biogenic acreage scanning."
              priority="Evaluation"
              progress={55}
              icon={Plane}
            />
          </div>
        </section>
      </div>

      {/* Delta Analysis Section */}
      <section className="bg-white border border-stone-200 rounded-[4rem] p-12 lg:p-20 space-y-16 shadow-xl shadow-stone-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex justify-between items-end border-b border-stone-100 pb-12">
          <div className="space-y-3">
            <h3 className="text-4xl font-heading font-black text-stone-900 tracking-tighter">Performance Delta Analysis</h3>
            <p className="text-[11px] text-stone-400 font-black uppercase tracking-[0.4em]">Current Neural Infrastructure vs Q3-24 Optimization Targets</p>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
            <div className="flex items-center gap-3 text-stone-300"><div className="w-2.5 h-2.5 rounded-full bg-stone-200" /> Baseline</div>
            <div className="flex items-center gap-3 text-primary"><div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/20" /> Target Cycle</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <DeltaBar label="Decentralized Execution" current={20} target={100} unit="Coverage" />
          <DeltaBar label="Pathogen Diagnostic Precision" current={94} target={99.5} unit="%" />
          <DeltaBar label="Neural Processing Latency (Vis)" current={4.5} target={1.8} unit="s" reverse />
          <DeltaBar label="Species Variety Nodes" current={5} target={20} unit="Clusters" />
        </div>
      </section>

      {/* Community Uplink */}
      <section className="bg-stone-900 text-white border border-stone-800 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group shadow-2xl flex flex-col md:flex-row items-center gap-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594750802422-777651030e46?q=80&w=2067')] opacity-10 grayscale-[1] brightness-50 bg-cover bg-center pointer-events-none" />
        <div className="relative z-10 space-y-8 flex-1 text-left">
          <div className="inline-flex items-center gap-3 bg-primary/20 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20">
            Open Node Access
          </div>
          <h2 className="text-6xl font-heading font-black text-white tracking-tighter leading-none">Contribute to the <br /><span className="text-primary italic">Neural Expansion</span></h2>
          <p className="text-xl text-stone-400 font-medium leading-relaxed max-w-2xl italic">
            "We invite regional developers and agronomists to collaborate on prioritized tasks within the Karnataka AI expansion protocol."
          </p>
          <button className="text-primary font-black flex items-center gap-4 hover:translate-x-3 transition-transform text-lg group">
            Access Contributor Ledger <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform" />
          </button>
        </div>
        <div className="relative z-10 w-48 h-48 rounded-[3.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
          <Target size={80} className="text-primary pulse-glow" strokeWidth={1} />
        </div>
      </section>
    </div>
  );
};

const AnalysisMetric = ({ label, value, sub, icon: Icon, up, success, accent }: any) => (
  <div className="bg-white border border-stone-200 p-10 rounded-[3.5rem] flex items-center justify-between group hover:border-primary/40 transition-all shadow-xl shadow-stone-200/40 hover:translate-y-[-5px]">
    <div className="space-y-2">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">{label}</p>
      <div className="flex items-center gap-4">
        <h4 className="text-4xl font-black text-stone-900 tracking-tighter tabular-nums">{value}</h4>
        {sub && (
          <span className={`text-xs font-black tabular-nums ${success ? 'text-primary' : up ? 'text-primary bg-primary/10 px-2 py-1 rounded-lg' : 'text-stone-400 bg-stone-50 px-2 py-1 rounded-lg'}`}>
            {up && '↑'} {sub}
          </span>
        )}
      </div>
    </div>
    <div className={`p-5 rounded-[2rem] transition-all ${accent ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-50 text-stone-300 border border-stone-100'}`}>
      <Icon size={30} strokeWidth={2.5} />
    </div>
  </div>
);

const AssetCard = ({ title, desc, tags, status }: any) => (
  <div className="bg-white border border-stone-200 p-10 rounded-[3rem] space-y-8 hover:border-primary/40 transition-all group shadow-xl shadow-stone-200/40 hover:translate-x-2">
    <div className="flex justify-between items-start">
      <h4 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-primary transition-colors">{title}</h4>
      <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-inner">{status}</span>
    </div>
    <p className="text-base text-stone-500 font-medium leading-relaxed italic">"{desc}"</p>
    <div className="flex flex-wrap gap-3">
      {tags.map((tag: string) => (
        <span key={tag} className="bg-stone-50 border border-stone-100 px-4 py-1.5 rounded-2xl text-[9px] font-black text-stone-400 uppercase tracking-widest shadow-inner">{tag}</span>
      ))}
    </div>
  </div>
);

const ProjectCard = ({ title, desc, priority, progress }: any) => (
  <div className="bg-white border border-stone-200 p-10 rounded-[3rem] space-y-8 hover:border-amber-500/40 transition-all group shadow-xl shadow-stone-200/40 hover:translate-x-2">
    <div className="flex justify-between items-start">
      <h4 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-amber-600 transition-colors">{title}</h4>
      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
        priority === 'High Criticality' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      }`}>{priority}</span>
    </div>
    <p className="text-base text-stone-500 font-medium leading-relaxed italic">"{desc}"</p>
    <div className="space-y-4">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em]">
        <span className="text-stone-400">Architectural Implementation Phase</span>
        <span className="text-stone-900 tabular-nums">{progress}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
        <div className={`h-full transition-all duration-1000 ${priority === 'High Criticality' ? 'bg-amber-500' : 'bg-primary shadow-lg shadow-primary/20'}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  </div>
);

const DeltaBar = ({ label, current, target, unit, reverse }: any) => {
  const percent = reverse ? (target / current) * 100 : (current / target) * 100;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h4 className="text-xl font-black text-stone-900 tracking-tight">{label}</h4>
        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Optimized Node: {target}{unit}</span>
      </div>
      <div className="h-14 bg-stone-50 rounded-[1.5rem] overflow-hidden relative border border-stone-200 shadow-inner">
        <div className="h-full bg-primary/10 transition-all duration-[2000ms] ease-out border-r-2 border-primary/30" style={{ width: `${percent}%` }} />
        <div className="absolute inset-y-0 left-0 flex items-center px-6">
          <span className="text-sm font-black text-stone-900 tabular-nums tracking-tighter">Current Uplink: {current}{unit}</span>
        </div>
        <div className="absolute inset-y-0 right-0 border-r-4 border-dashed border-primary opacity-30 pulse-glow" style={{ left: '98%' }} />
      </div>
    </div>
  );
};

export default EnhancementPage;
