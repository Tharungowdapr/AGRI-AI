import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { KARNATAKA_CROPS, PLANTVILLAGE_DB } from '../constants';
import { 
  ArrowLeft,
  ChevronRight,
  Clock,
  Droplets,
  Thermometer,
  Zap,
  Layout,
  TrendingUp,
  FileDown,
  Target,
  Bug,
  Calendar,
  Wallet,
  ArrowUpCircle,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { useLang } from '../App';
import { CropData } from '../types';

const CropDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [crop, setCrop] = useState<CropData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem('kv_master_crops');
    const crops = stored ? JSON.parse(stored) : KARNATAKA_CROPS;
    const found = crops.find((c: CropData) => c.id === id);
    setCrop(found);
  }, [id]);

  if (!crop) return (
    <div className="h-screen flex items-center justify-center flex-col gap-6 bg-nature-50">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center space-y-6 max-w-md">
        <h1 className="text-2xl font-heading font-black text-stone-800 uppercase tracking-tighter">{t.cropDetail?.notFound || 'Not Found'}</h1>
        <button onClick={() => navigate('/crops')} className="w-full bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest">
          {t.cropDetail?.return || 'Return'}
        </button>
      </div>
    </div>
  );

  const associatedDiseases = (crop.diseaseMatrix || [])
    .map(dm => {
      const entry = PLANTVILLAGE_DB[dm.disease];
      if (!entry) return null;
      return entry[lang] || entry['en'];
    })
    .filter(Boolean);

  const getLocalizedSeason = (season: string = '') => {
    if (season.includes('Kharif') && season.includes('Rabi')) return t.common?.kharifRabi || 'Kharif/Rabi';
    if (season === 'Kharif') return t.common?.kharif || 'Kharif';
    if (season === 'Rabi') return t.common?.rabi || 'Rabi';
    if (season === 'Winter') return t.common?.winter || 'Winter';
    return t.common?.annual || 'Annual';
  };

  const getLocalizedDemand = (demand: string = '') => {
    const d = demand.toLowerCase();
    if (d.includes('high')) return t.common?.high || 'High';
    if (d.includes('moderate')) return t.common?.moderate || 'Moderate';
    if (d.includes('low')) return t.common?.low || 'Low';
    return demand;
  };

  // Safe extraction for display values
  const displayMsp = crop.market?.msp || '--';
  const displayDuration = (crop.duration || '').replace('Days', t.common?.days || 'Days');
  const displayIrrigation = crop.optimalYield?.water || '--';
  const displayYield = crop.optimalYield?.avgYield || '--';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-stone-100 pb-10">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">
            <Link to="/crops" className="hover:text-primary transition-colors">{t.cropDetail?.registry || 'REGISTRY'}</Link>
            <ChevronRight size={10} className="text-stone-300" />
            <span className="text-primary">{(t.crops?.[crop.id] || crop.name || '').toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/crops')}
              className="p-4 bg-white border border-stone-200 rounded-2xl text-stone-400 hover:text-primary transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="space-y-1">
              <h1 className="text-6xl font-heading font-black text-stone-800 tracking-tighter leading-none">
                {t.crops?.[crop.id] || crop.name}
              </h1>
              <p className="text-xl text-stone-400 italic font-medium">{crop.scientificName || ''}</p>
            </div>
          </div>
        </div>
        <button className="bg-stone-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl">
          <FileDown size={18} /> {t.cropDetail?.exportProfile || 'Export Profile'}
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <SummaryTile label={t.cropDetail?.marketFloor || 'Market Floor'} value={displayMsp} sub={t.cropDetail?.perQuintal || 'Per Quintal'} icon={TrendingUp} active />
        <SummaryTile label={t.cropDetail?.biologicalCycle || 'Biological Cycle'} value={displayDuration} sub={t.cropDetail?.totalDuration || 'Total Duration'} icon={Clock} />
        <SummaryTile label={t.cropDetail?.irrigationDemand || 'Irrigation Demand'} value={getLocalizedDemand(displayIrrigation)} sub={t.cropDetail?.waterMetric || 'Water Metric'} icon={Droplets} />
        <SummaryTile label={t.cropDetail?.avgYield || 'Average Yield'} value={displayYield} sub={t.cropDetail?.regionalBenchmark || 'Benchmark'} icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          {/* Financial Overview */}
          <section className="bg-stone-900 text-white rounded-[3.5rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden group text-left">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Wallet size={200} />
            </div>
            <div className="relative z-10 space-y-10">
               <div className="space-y-2">
                 <h3 className="text-3xl font-heading font-black tracking-tight">{lang === 'kn' ? 'ಆರ್ಥಿಕ ವಿಶ್ಲೇಷಣೆ' : 'Financial Assessment'}</h3>
                 <p className="text-stone-400 font-medium italic">Consolidated economic targets per acre.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-2">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.cropDetail.estInvestment}</p>
                    <p className="text-3xl font-black text-primary">{crop.market.estimatedInvestment || '--'}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-2">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.cropDetail.estProfit}</p>
                    <p className="text-3xl font-black text-nature-accent">{crop.market.estimatedProfit || '--'}</p>
                 </div>
               </div>
            </div>
          </section>

          <section className="bg-white rounded-[3.5rem] p-12 lg:p-16 border border-stone-100 shadow-sm space-y-10 text-left">
            <h3 className="text-3xl font-heading font-black text-stone-800">{t.cropDetail?.botanicalOverview || 'Botanical Overview'}</h3>
            <p className="text-xl text-stone-600 leading-relaxed font-medium">
              {t.crops?.[`${crop.id}Desc`] || crop.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-10 border-t border-stone-50">
              <ProfileMetric icon={Calendar} label={t.cropDetail?.idealSeason || 'Season'} value={getLocalizedSeason(crop.season)} />
              <ProfileMetric icon={Thermometer} label={t.cropDetail?.tempRange || 'Temp'} value={crop.optimalYield?.temperature || '--'} />
              <ProfileMetric icon={Zap} label={t.cropDetail?.nutrientFeed || 'Nutrients'} value={crop.optimalYield?.fertilizer || '--'} />
              <ProfileMetric icon={Layout} label={t.cropDetail?.soilAffinity || 'Soil'} value={crop.optimalYield?.soil || '--'} />
            </div>
          </section>

          {/* Lifecycle Roadmap */}
          <section className="space-y-10 text-left">
            <div className="space-y-2">
              <h3 className="text-4xl font-heading font-black text-stone-800 flex items-center gap-4 tracking-tight">
                <ClipboardList className="text-primary" size={34} /> {t.cropDetail.lifecycleTitle}
              </h3>
              <p className="text-stone-400 font-medium italic">{t.cropDetail.lifecycleSub}</p>
            </div>
            
            <div className="space-y-12">
              {crop.stages.map((stage, idx) => {
                // Fetch dynamic translations if available
                const translatedStage = t.lifecycle?.[crop.id]?.[idx];
                const stageName = translatedStage?.name || stage.stage;
                const stageTasks = translatedStage?.tasks || stage.keyTasks;
                const stageNutrients = translatedStage?.nutrients || stage.nutrientNeeds;

                return (
                  <div key={idx} className="bg-white border border-stone-100 rounded-[3rem] p-10 lg:p-14 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                    {/* Background Number - set to z-0 */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-stone-50 rounded-bl-[3rem] flex items-center justify-center text-stone-200 font-black text-3xl z-0">0{idx+1}</div>
                    
                    {/* Header Content - set to relative z-10 to stay on top */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-50 pb-8 mb-8">
                      <div className="space-y-1">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{stage.days} {t.cropDetail.lifecycleDays}</span>
                          <h4 className="text-3xl font-heading font-black text-stone-800">{stageName}</h4>
                      </div>
                      <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100 flex items-center gap-3">
                          <Wallet size={16} className="text-stone-400" />
                          <span className="text-sm font-black text-stone-800">{t.cropDetail.stageInvestment}: {stage.investment}</span>
                      </div>
                    </div>

                    {/* Body Content - set to relative z-10 */}
                    <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><ClipboardList size={14} /> {t.cropDetail.keyTasksLabel}</h5>
                          <p className="text-sm text-stone-600 font-medium italic leading-relaxed">"{stageTasks}"</p>
                        </div>
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> {t.cropDetail.nutritionLabel}</h5>
                          <p className="text-sm text-stone-600 font-medium italic leading-relaxed">"{stageNutrients}"</p>
                        </div>
                        <div className="bg-red-50/50 border border-red-100 p-6 rounded-[2rem] space-y-4">
                          <h5 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14} /> {t.cropDetail.riskImpact}</h5>
                          <div className="space-y-1">
                              <p className="text-xs font-black text-red-600">{stage.majorDiseases.join(', ')}</p>
                              <p className="text-[10px] font-medium text-red-400">{t.cropDetail.lossDescription}: {stage.economicLoss} ({stage.yieldImpact} impact)</p>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pathogen Encyclopedia */}
          <section className="space-y-10 text-left">
            <div className="space-y-2">
              <h3 className="text-4xl font-heading font-black text-stone-800 flex items-center gap-4 tracking-tight">
                <Bug className="text-primary" size={34} /> {t.cropDetail?.pathogenProfiles || 'Pathogen Encyclopedia'}
              </h3>
              <p className="text-stone-400 font-medium italic">{t.cropDetail?.diagnosticData || 'Critical diagnostic data mapping for agricultural threats.'}</p>
            </div>
            <div className="grid grid-cols-1 gap-10">
              {associatedDiseases.map((disease: any, idx) => (
                <div key={idx} className="bg-white border border-stone-100 rounded-[3rem] p-12 lg:p-16 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-50 pb-10 mb-10">
                    <h4 className="text-3xl font-heading font-black text-stone-800">{disease.name || 'Pathogen'}</h4>
                    <span className="bg-red-50 text-red-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                      {t.cropDetail?.riskBadge || 'HIGH IMPACT RISK'}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="space-y-6">
                      <h5 className="font-black text-stone-800 text-[10px] uppercase tracking-widest border-b border-stone-100 pb-2">{t.cropDetail?.symptoms || 'PRIMARY SYMPTOMS'}</h5>
                      <ul className="space-y-4">
                        {(disease.symptoms || []).map((item: string, i: number) => (
                          <li key={i} className="text-stone-500 text-sm font-medium flex gap-3">
                            <span className="text-primary font-bold">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <h5 className="font-black text-stone-800 text-[10px] uppercase tracking-widest border-b border-stone-100 pb-2">{t.cropDetail?.protocol || 'CURATIVE PROTOCOL'}</h5>
                      <ul className="space-y-4">
                        {(disease.treatment || []).map((item: string, i: number) => (
                          <li key={i} className="text-stone-500 text-sm font-medium flex gap-3">
                            <span className="text-primary font-bold">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-6 hidden lg:block">
                      <h5 className="font-black text-stone-800 text-[10px] uppercase tracking-widest border-b border-stone-100 pb-2">PREVENTION</h5>
                      <ul className="space-y-4">
                        {(disease.prevention || []).map((item: string, i: number) => (
                          <li key={i} className="text-stone-500 text-sm font-medium flex gap-3">
                            <span className="text-stone-400 font-bold">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-12 text-left">
          <section className="bg-white border border-stone-100 p-12 rounded-[3.5rem] shadow-sm space-y-10">
            <h3 className="text-3xl font-heading font-black text-stone-800 tracking-tighter">{t.cropDetail?.marketPulse || 'Market Pulse'}</h3>
            <div className="space-y-6">
              <MarketStat label={t.cropDetail?.mandiPrice || 'Mandi Price'} value={`₹${crop.market?.currentPrice || '--'}`} sub={t.cropDetail?.currentQuintal || 'Current Quintal'} active />
              <MarketStat label={t.cropDetail?.forecast15d || 'Forecast'} value={`₹${crop.market?.forecastPrice || '--'}`} sub={t.cropDetail?.projectedValue || 'Projected'} accent />
            </div>
            <Link to="/market" className="block text-center py-5 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all">
              {t.cropDetail?.marketDepth || 'Market Depth'}
            </Link>
          </section>

          <section className="bg-primary text-white p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden group shadow-2xl">
            <Zap size={36} className="text-nature-accent" />
            <h4 className="text-3xl font-heading font-black leading-none">{t.cropDetail?.aiFieldAdvice || 'AI Advice'}</h4>
            <p className="text-sm font-medium leading-relaxed opacity-90 italic">
              {t.cropDetail?.adviceDesc || 'Specialized advice for'} {t.crops?.[crop.id] || crop.name}
            </p>
            <button onClick={() => navigate('/chat')} className="w-full py-5 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-50 transition-all shadow-xl">
              {t.cropDetail?.launchAgent || 'Contact AI'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProfileMetric = ({ icon: Icon, label, value }: any) => (
  <div className="space-y-3">
    <div className="bg-stone-50 p-4 rounded-2xl w-fit text-primary border border-stone-100 shadow-sm">
      <Icon size={20} />
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-stone-800">{value}</p>
    </div>
  </div>
);

const MarketStat = ({ label, value, sub, active, accent }: any) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all ${
    active ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 
    accent ? 'bg-emerald-50 border-emerald-100 shadow-md shadow-emerald-50' : 
    'bg-stone-50 border-stone-100'
  }`}>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <h4 className={`text-3xl font-black ${active || accent ? 'text-primary' : 'text-stone-800'}`}>{value}</h4>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

const SummaryTile = ({ label, value, sub, icon: Icon, active }: any) => (
  <div className={`p-10 rounded-[3rem] border transition-all space-y-10 flex flex-col justify-between shadow-sm hover:shadow-xl ${active ? 'bg-primary/5 border-primary/20' : 'bg-white border-stone-100'}`}>
    <div className="flex justify-between items-start">
      <div className="space-y-2 text-left">
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label || 'Metric'}</p>
        <h4 className={`text-4xl font-heading font-black tracking-tight ${active ? 'text-primary' : 'text-stone-800'}`}>{value || '--'}</h4>
      </div>
      <div className={`p-4 rounded-2xl ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-stone-50 text-stone-400'}`}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-xs text-stone-400 font-bold uppercase tracking-widest pt-4 text-left italic border-t border-stone-50">{sub || ''}</p>
  </div>
);

export default CropDetailPage;
