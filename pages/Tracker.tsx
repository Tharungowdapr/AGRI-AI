import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  History as HistoryIcon, 
  Calendar, 
  Trash2, 
  Loader2,
  ChevronRight,
  Sprout,
  Activity,
  Droplets,
  Zap,
  CheckCircle2,
  BrainCircuit,
  MapPin,
  ArrowRight,
  ChevronLeft,
  ShieldAlert,
  ClipboardList,
  Target,
  Circle,
  Thermometer,
  TrendingUp,
  Volume2,
  FlaskConical,
  Coins,
  LayoutGrid,
  Info
} from 'lucide-react';
import { CropLog, UserCropProfile, CropData, CropStage } from '../types';
import { useLang, useAuth } from '../App';
import { KARNATAKA_CROPS } from '../constants';
import { speakText, decodeBase64Manual, decodeAudioDataManual } from '../geminiService';

const TrackerPage: React.FC = () => {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserCropProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!user) return;
    const dbKey = `kv_acreage_db_${user.id}`;
    const saved = localStorage.getItem(dbKey);
    if (saved) {
      const data = JSON.parse(saved);
      setProfiles(data);
    }
  }, [user]);

  const saveToDb = (updatedProfiles: UserCropProfile[]) => {
    if (!user) return;
    const dbKey = `kv_acreage_db_${user.id}`;
    setProfiles(updatedProfiles);
    localStorage.setItem(dbKey, JSON.stringify(updatedProfiles));
  };

  const createProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.currentTarget);
    const cropId = formData.get('cropId') as string;
    const cropMeta = KARNATAKA_CROPS.find(c => c.id === cropId);
    
    if (!cropMeta) return;

    const planStages = cropMeta.stages.map((s: CropStage) => ({
      name: s.stage,
      timeframe: s.days + " Days",
      tasks: s.keyTasks.split(', '),
      recommendations: {
        watering: s.waterLevel,
        fertilization: s.nutrientNeeds,
        diseaseCheck: s.majorDiseases.join(', ')
      },
      completed: false
    }));

    const newProfile: UserCropProfile = {
      id: Date.now().toString(),
      userId: user.id,
      cropType: cropMeta.name,
      variety: formData.get('variety') as string,
      plantingDate: formData.get('plantingDate') as string,
      acreage: formData.get('acreage') as string,
      soilType: formData.get('soilType') as string,
      location: formData.get('location') as string,
      season: formData.get('season') as string,
      soilHealth: {
        ph: parseFloat(formData.get('soilPh') as string || '7.0'),
        nitrogen: (formData.get('soilN') as any) || 'Medium',
        phosphorus: (formData.get('soilP') as any) || 'Medium',
        potassium: (formData.get('soilK') as any) || 'Medium',
      },
      logs: [],
      growthPlan: {
        stages: planStages
      }
    };

    const updated = [newProfile, ...profiles];
    saveToDb(updated);
    setSelectedProfileId(newProfile.id);
    setIsAddingProfile(false);
  };

  // Fix: Implemented missing addLog function
  const addLog = (e: React.FormEvent<HTMLFormElement>) => {
    if (!selectedProfileId) return;
    
    const formData = new FormData(e.currentTarget);
    const newLog: CropLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      stage: formData.get('stage') as string,
      observations: formData.get('observations') as string,
      healthStatus: (formData.get('healthStatus') as any) || 'Good',
    };

    const updated = profiles.map(p => {
      if (p.id === selectedProfileId) {
        return { ...p, logs: [newLog, ...(p.logs || [])] };
      }
      return p;
    });
    
    saveToDb(updated);
    setIsAddingLog(false);
  };

  const toggleTask = (stageIndex: number) => {
    if (!selectedProfileId) return;
    const updated = profiles.map(p => {
      if (p.id === selectedProfileId && p.growthPlan) {
        const newStages = [...(p.growthPlan.stages || [])];
        if (newStages[stageIndex]) {
          newStages[stageIndex].completed = !newStages[stageIndex].completed;
        }
        return { ...p, growthPlan: { ...p.growthPlan, stages: newStages } };
      }
      return p;
    });
    saveToDb(updated);
  };

  const handleSpeak = async (stage: any) => {
    const text = `Growth stage: ${stage.name}. Period: ${stage.timeframe}. Key tasks: ${stage.tasks.join(', ')}. Nutrient advice: ${stage.recommendations.fertilization}.`;
    
    if (isSpeaking === stage.name) {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      }
      setIsSpeaking(null);
      return;
    }

    setIsSpeaking(stage.name);
    try {
      const base64 = await speakText(text);
      if (!base64) throw new Error();
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioCtxRef.current;
      const bytes = decodeBase64Manual(base64);
      const buffer = await decodeAudioDataManual(bytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(null);
      currentSourceRef.current = source;
      source.start();
    } catch (err) {
      console.error(err);
      setIsSpeaking(null);
    }
  };

  const decommissionProfile = (id: string) => {
    if (confirm(t.tracker.decommissionMsg)) {
      const updated = profiles.filter(p => p.id !== id);
      saveToDb(updated);
      if (selectedProfileId === id) setSelectedProfileId(null);
    }
  };

  const currentProfile = useMemo(() => 
    profiles.find(p => p.id === selectedProfileId), 
    [profiles, selectedProfileId]
  );

  const cropMeta = useMemo(() => 
    KARNATAKA_CROPS.find(c => c.name === currentProfile?.cropType), 
    [currentProfile]
  );

  const revenueForecast = useMemo(() => {
    if (!currentProfile || !cropMeta) return { yield: 0, revenue: 0 };
    const acreage = parseFloat(currentProfile.acreage || '0');
    const yieldPerAcre = parseFloat(cropMeta.optimalYield.potential.split('-')[0] || '0');
    const pricePerQuintal = parseFloat(cropMeta.market.currentPrice.replace(/,/g, '') || '0');
    
    return {
      yield: Math.round(acreage * yieldPerAcre),
      revenue: Math.round(acreage * yieldPerAcre * pricePerQuintal)
    };
  }, [currentProfile, cropMeta]);

  // View: Dashboard (Grid of Cards)
  if (!selectedProfileId && !isAddingProfile) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-10 text-left">
          <div className="space-y-4">
            <h1 className="text-5xl font-heading font-black text-stone-900 tracking-tighter">My Farm <span className="text-primary italic">Dashboard</span></h1>
            <p className="text-stone-500 font-medium max-w-xl">Monitor your active biological acreage nodes and lifecycle progress.</p>
          </div>
          <button 
            onClick={() => setIsAddingProfile(true)}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-stone-900 shadow-xl transition-all uppercase text-[10px] tracking-widest"
          >
            <Plus size={18} /> Add New Crop Node
          </button>
        </header>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-[4rem] border border-stone-100 p-24 text-center space-y-8 shadow-2xl">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
              <Sprout size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-stone-900 tracking-tight">{t.tracker.placeholder}</h2>
              <p className="text-stone-400 font-medium">Initialize your first digital twin to begin tracking.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profiles.map(p => {
              const completed = p.growthPlan?.stages.filter(s => s.completed).length || 0;
              const total = p.growthPlan?.stages.length || 0;
              const progress = total > 0 ? (completed / total) * 100 : 0;
              
              return (
                <div key={p.id} className="bg-white border border-stone-200 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-2xl transition-all group relative overflow-hidden text-left shadow-lg">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{p.cropType}</span>
                        <h3 className="text-3xl font-heading font-black text-stone-900">{p.variety}</h3>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-xl text-primary">
                        <Activity size={20} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                        <span>Lifecycle Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={10} /> Location
                        </p>
                        <p className="text-xs font-black text-stone-700 truncate">{p.location}</p>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={10} /> Sown
                        </p>
                        <p className="text-xs font-black text-stone-700">{p.plantingDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button 
                      onClick={() => setSelectedProfileId(p.id)}
                      className="flex-1 bg-stone-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                    >
                      Manage Node
                    </button>
                    <button 
                      onClick={() => decommissionProfile(p.id)}
                      className="p-4 border border-stone-200 text-stone-300 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // View: Add Profile Form
  if (isAddingProfile) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white border border-stone-200 rounded-[3.5rem] p-10 lg:p-14 space-y-12 shadow-2xl relative overflow-hidden text-left">
          <header className="flex items-center gap-4 border-b border-stone-50 pb-8">
             <button onClick={() => setIsAddingProfile(false)} className="p-3 bg-stone-50 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <h2 className="text-4xl font-heading font-black text-stone-900 tracking-tighter">Initialize Farm Node</h2>
          </header>

          <form onSubmit={createProfile} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Crop Species</label>
                <select name="cropId" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800">
                  {KARNATAKA_CROPS.map(c => <option key={c.id} value={c.id}>{t.crops[c.id] || c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Commercial Variety</label>
                <input name="variety" placeholder="e.g. IR64, Byadagi" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Sowing Date</label>
                <input type="date" name="plantingDate" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Total Acreage</label>
                <input type="number" step="0.1" name="acreage" placeholder="e.g. 2.5" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Location Cluster</label>
                <input name="location" placeholder="e.g. Byadagi East Cluster" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">Season</label>
                <select name="season" className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800">
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
            </div>

            <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100 space-y-8">
               <h3 className="text-xl font-black text-stone-900 flex items-center gap-3">
                 <FlaskConical size={20} className="text-primary" /> Soil Intelligence Report
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">pH Level</label>
                    <input type="number" step="0.1" name="soilPh" placeholder="7.0" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Nitrogen (N)</label>
                    <select name="soilN" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none font-bold">
                      <option>Low</option>
                      <option selected>Medium</option>
                      <option>High</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Phosphorus (P)</label>
                    <select name="soilP" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none font-bold">
                      <option>Low</option>
                      <option selected>Medium</option>
                      <option>High</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Potassium (K)</label>
                    <select name="soilK" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none font-bold">
                      <option>Low</option>
                      <option selected>Medium</option>
                      <option>High</option>
                    </select>
                 </div>
               </div>
            </div>

            <button type="submit" className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black text-xs shadow-xl hover:bg-primary transition-all tracking-widest uppercase">
              {t.tracker.initBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // View: Management Node (Single Profile Detail)
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-10 text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <button onClick={() => setSelectedProfileId(null)} className="p-3 bg-stone-50 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
               <ChevronLeft size={20} />
             </button>
             <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
               Active Node
             </div>
          </div>
          <h1 className="text-5xl font-heading font-black text-stone-900 tracking-tighter">
            {currentProfile?.variety} <span className="text-primary italic">{currentProfile?.cropType}</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAddingLog(true)}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-stone-900 shadow-xl transition-all uppercase text-[10px] tracking-widest"
          >
            <Plus size={18} /> New Observation
          </button>
          <button 
            onClick={() => decommissionProfile(selectedProfileId!)}
            className="p-4 bg-white text-red-300 border border-stone-200 rounded-2xl hover:text-red-500 transition-all shadow-sm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Sidebar Intelligence */}
        <aside className="lg:col-span-3 space-y-8">
           <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-xl space-y-8 text-left">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-50 pb-4">Soil Intelligence</h4>
              <div className="space-y-6">
                <IntelligenceMetric label="pH Balance" value={currentProfile?.soilHealth?.ph?.toString() || '7.0'} icon={FlaskConical} />
                <IntelligenceMetric label="Nitrogen" value={currentProfile?.soilHealth?.nitrogen || 'Medium'} icon={Activity} />
                <IntelligenceMetric label="Phos / Potas" value={`${currentProfile?.soilHealth?.phosphorus || 'M'} / ${currentProfile?.soilHealth?.potassium || 'M'}`} icon={Target} />
              </div>
           </div>

           <div className="bg-stone-900 text-white rounded-[2.5rem] p-8 shadow-xl space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Coins size={100} /></div>
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Revenue Forecast</h4>
              <div className="space-y-4">
                <div className="space-y-0.5">
                   <p className="text-4xl font-black tabular-nums">₹{revenueForecast.revenue.toLocaleString()}</p>
                   <p className="text-[10px] font-bold text-stone-400 uppercase">Estimated Acreage Value</p>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                   <span className="text-xs font-medium text-stone-400 italic">Target Yield:</span>
                   <span className="text-xs font-black">{revenueForecast.yield} Q</span>
                </div>
              </div>
           </div>

           <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-xl space-y-6 text-left">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Field Geography</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <MapPin size={16} className="text-primary" />
                   <span className="text-sm font-black text-stone-800">{currentProfile?.location}</span>
                </div>
                <div className="flex items-center gap-3">
                   <LayoutGrid size={16} className="text-stone-300" />
                   <span className="text-sm font-black text-stone-800">{currentProfile?.acreage} Acres</span>
                </div>
              </div>
           </div>
        </aside>

        {/* Lifecycle Flow */}
        <div className="lg:col-span-9 space-y-12">
          <div className="bg-white border border-stone-200 rounded-[3.5rem] p-10 lg:p-14 shadow-xl space-y-12 text-left">
            <header className="flex justify-between items-center border-b border-stone-100 pb-8">
               <div className="space-y-1">
                 <h3 className="text-3xl font-heading font-black text-stone-900 flex items-center gap-3">
                   <Target className="text-primary" size={28} /> Growth Protocol
                 </h3>
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Biological Phase Sequencing</p>
               </div>
               <div className="bg-stone-50 px-6 py-4 rounded-2xl flex items-center gap-4 border border-stone-100 shadow-inner">
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Bio-Sync</span>
                    <span className="text-xl font-black text-stone-900">
                      {(currentProfile?.growthPlan?.stages.filter(s => s.completed).length || 0)} / {(currentProfile?.growthPlan?.stages.length || 0)}
                    </span>
                 </div>
               </div>
            </header>

            <div className="grid gap-12">
              {currentProfile?.growthPlan?.stages.map((stage, idx) => (
                <div key={idx} className={`relative pl-12 border-l-2 transition-all duration-500 ${stage.completed ? 'border-primary' : 'border-stone-100'}`}>
                  <div className={`absolute left-[-11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md transition-all ${stage.completed ? 'bg-primary' : 'bg-stone-200'}`} />
                  
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${stage.completed ? 'text-primary' : 'text-stone-400'}`}>
                          Phase 0{idx+1} — {stage.timeframe}
                        </span>
                        <h4 className="text-2xl font-black text-stone-900">{stage.name}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleSpeak(stage)}
                          className={`p-3 rounded-xl transition-all ${isSpeaking === stage.name ? 'bg-primary text-white animate-pulse' : 'bg-stone-100 text-stone-400 hover:text-primary'}`}
                        >
                          <Volume2 size={20} />
                        </button>
                        <button 
                          onClick={() => toggleTask(idx)}
                          className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                            stage.completed 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'bg-white border border-stone-200 text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          {stage.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                          {stage.completed ? "Verified" : "Verify Stage"}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-stone-50/50 p-8 rounded-[2rem] border border-stone-100 space-y-4">
                        <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                           <ClipboardList size={14} /> Field Tasks
                        </h5>
                        <ul className="space-y-3">
                          {stage.tasks.map((task, tidx) => (
                            <li key={tidx} className="flex items-start gap-3 text-sm font-medium text-stone-600 italic">
                              <span className="text-primary mt-1">•</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6">
                        <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Advisory Pulse</h5>
                        <div className="space-y-4">
                           <AdvisoryItem icon={Droplets} label="Watering" value={stage.recommendations.watering} color="text-blue-400" />
                           <AdvisoryItem icon={Sprout} label="Fertilization" value={stage.recommendations.fertilization} color="text-green-400" />
                           <AdvisoryItem icon={ShieldAlert} label="Pathogens" value={stage.recommendations.diseaseCheck} color="text-red-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white border border-stone-200 rounded-[3.5rem] p-10 lg:p-14 shadow-xl space-y-10 text-left">
            <header className="flex justify-between items-center border-b border-stone-100 pb-6">
               <h3 className="text-2xl font-black text-stone-900 flex items-center gap-3">
                 <HistoryIcon className="text-stone-300" size={24} /> Field Ledger
               </h3>
               <button onClick={() => setIsAddingLog(true)} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">+ Log Observations</button>
            </header>

            {isAddingLog && (
              <form onSubmit={(e) => { e.preventDefault(); addLog(e); }} className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-200 space-y-6 animate-in slide-in-from-top-4">
                 <div className="grid grid-cols-2 gap-6">
                    <input name="stage" placeholder="Current Stage" className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none font-bold" required />
                    <select name="healthStatus" className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none font-bold">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                 </div>
                 <textarea name="observations" placeholder="Details of observation..." rows={3} className="w-full p-4 bg-white border border-stone-200 rounded-2xl outline-none font-medium" required />
                 <div className="flex justify-end gap-4">
                    <button type="button" onClick={() => setIsAddingLog(false)} className="px-6 py-3 font-black text-[10px] text-stone-400 uppercase">Cancel</button>
                    <button type="submit" className="bg-stone-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg">Commit to Ledger</button>
                 </div>
              </form>
            )}

            <div className="space-y-6">
               {(currentProfile?.logs || []).map(log => (
                 <div key={log.id} className="p-8 bg-stone-50 rounded-3xl border border-stone-100 flex justify-between items-start group hover:border-primary/30 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{log.date}</span>
                         <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-stone-200">{log.stage}</span>
                      </div>
                      <p className="text-stone-700 font-medium italic">"{log.observations}"</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      log.healthStatus === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      log.healthStatus === 'Poor' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {log.healthStatus}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntelligenceMetric = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center gap-4 group">
    <div className="bg-stone-50 p-3 rounded-xl text-stone-300 shadow-inner border border-stone-100 group-hover:text-primary transition-all">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-stone-800">{value}</p>
    </div>
  </div>
);

const AdvisoryItem = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex gap-4 group">
    <Icon size={16} className={`${color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
    <div className="space-y-0.5">
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-medium text-stone-600 italic leading-relaxed">{value}</p>
    </div>
  </div>
);

export default TrackerPage;