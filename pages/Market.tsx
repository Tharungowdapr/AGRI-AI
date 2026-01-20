import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CloudSun, 
  Info, 
  Globe, 
  Wallet, 
  Search, 
  ChevronRight,
  ArrowUpRight,
  MapPin,
  TrendingDown,
  BarChart4,
  LayoutGrid
} from 'lucide-react';
import { useLang } from '../App';
import { KARNATAKA_CROPS } from '../constants';
import { CropData } from '../types';

const MarketPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCrops, setAllCrops] = useState<CropData[]>([]);
  const { t } = useLang();

  useEffect(() => {
    const stored = localStorage.getItem('kv_master_crops');
    if (stored) {
      setAllCrops(JSON.parse(stored));
    } else {
      setAllCrops(KARNATAKA_CROPS);
    }
  }, []);

  const filteredCrops = allCrops.filter(crop => 
    (t.crops[crop.id] || crop.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
      {/* Enhanced Live Ticker */}
      <div className="bg-stone-900 overflow-hidden py-4 -mx-6 lg:-mx-12 border-y border-stone-800 shadow-2xl relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-900 to-transparent z-10" />
        <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap gap-16 items-center">
          {(allCrops.length > 0 ? allCrops : KARNATAKA_CROPS).concat(allCrops.length > 0 ? allCrops : KARNATAKA_CROPS).map((crop, idx) => (
            <div key={`${crop.id}-${idx}`} className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.crops[crop.id] || crop.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white tabular-nums">₹{crop.market.currentPrice}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${idx % 3 === 0 ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                    {idx % 3 === 0 ? `▼ ${t.market.tickerFall}` : `▲ ${t.market.tickerRise}`}
                  </span>
                </div>
              </div>
              <div className="w-px h-10 bg-stone-800" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-stone-100 pb-12 text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <Globe size={14} /> {t.market.mandiIndex}
          </div>
          <h1 className="text-6xl font-heading font-black text-stone-900 tracking-tighter leading-none">
            {t.market.title.split(' ')[0]} <span className="italic text-primary">{t.market.title.split(' ')[1]}</span>
          </h1>
          <p className="text-xl text-stone-500 font-medium max-w-xl italic">{t.market.desc}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none" size={18} />
            <input 
              type="text"
              placeholder={t.market.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 pl-14 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-xs uppercase tracking-widest text-stone-800 shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left Column: All Crop Prices Table */}
        <div className="lg:col-span-8 space-y-10 text-left">
          
          {/* Main Price Index Table */}
          <div className="bg-white border border-stone-200 rounded-[4rem] p-10 lg:p-14 shadow-xl shadow-stone-200/40 space-y-10 relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-3xl font-heading font-black text-stone-900">{t.market.indexTitle}</h3>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">{t.market.valuationSub}</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{t.market.liveSync}</span>
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                      <th className="pb-4 pl-4">{t.market.tableSpecies}</th>
                      <th className="pb-4">{t.market.tablePrice}</th>
                      <th className="pb-4">{t.market.tableMsp}</th>
                      <th className="pb-4 text-right pr-4">{t.market.tableForecast}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrops.map(crop => (
                      <tr key={crop.id} className="bg-stone-50/50 hover:bg-white border border-stone-100 transition-all group">
                        <td className="py-6 pl-6 rounded-l-[2rem] border-y border-l border-stone-100 group-hover:border-primary/20">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-stone-900">{t.crops[crop.id] || crop.name}</span>
                            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{crop.scientificName}</span>
                          </div>
                        </td>
                        <td className="py-6 border-y border-stone-100 group-hover:border-primary/20">
                          <span className="text-lg font-black text-stone-900 tabular-nums">₹{crop.market.currentPrice}</span>
                        </td>
                        <td className="py-6 border-y border-stone-100 group-hover:border-primary/20">
                          <span className="text-sm font-bold text-stone-500 tabular-nums">{crop.market.msp.split('/')[0]}</span>
                        </td>
                        <td className="py-6 pr-6 rounded-r-[2rem] border-y border-r border-stone-100 group-hover:border-primary/20 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-lg font-black text-primary tabular-nums">₹{crop.market.forecastPrice}</span>
                            <ArrowUpRight size={16} className="text-primary" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Mandi Comparative Table */}
          <div className="bg-white border border-stone-200 rounded-[3.5rem] p-12 shadow-xl shadow-stone-200/40 space-y-10">
             <div className="flex justify-between items-center">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-stone-900 tracking-tight">{t.market.mandiTitle}</h3>
                   <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">{t.market.mandiSub}</p>
                </div>
                <BarChart4 size={24} className="text-stone-200" />
             </div>
             
             <div className="space-y-4">
                <MandiRow name={t.market.mandiBlr} price="₹2,340" delta="+₹40" trend="up" priorityLabel={t.market.regionalPriority} />
                <MandiRow name={t.market.mandiCbp} price="₹2,280" delta="-₹20" trend="down" priorityLabel={t.market.regionalPriority} />
                <MandiRow name={t.market.mandiKlr} price="₹2,310" delta="+₹10" trend="up" priorityLabel={t.market.regionalPriority} />
             </div>
          </div>
        </div>

        {/* Right Column: Bengaluru Weather Cluster */}
        <div className="lg:col-span-4 space-y-10 text-left">
          
          {/* Environmental Node */}
          <div className="bg-white border border-stone-200 rounded-[3.5rem] p-10 shadow-xl space-y-10">
              <div className="flex justify-between items-center border-b border-stone-50 pb-6">
                 <h4 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                   <CloudSun className="text-primary" size={22} /> {t.market.climateTitle}
                 </h4>
                 <div className="bg-stone-50 px-3 py-1 rounded-full text-[9px] font-black text-stone-400 uppercase tracking-widest border border-stone-100">{t.market.blr}</div>
              </div>
              
              <div className="flex items-center gap-10">
                 <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <div className="relative bg-white p-6 rounded-4xl border border-stone-100 shadow-xl">
                       <CloudSun size={48} className="text-primary" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <span className="text-5xl font-black tracking-tighter text-stone-900 tabular-nums">26°C</span>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest italic">{t.market.weatherCloudy}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 space-y-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid size={10} /> {t.market.precip}
                    </p>
                    <p className="text-lg font-black text-stone-900">8%</p>
                 </div>
                 <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 space-y-2">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid size={10} /> {t.market.humidity}
                    </p>
                    <p className="text-lg font-black text-stone-900">58%</p>
                 </div>
              </div>
              
              <div className="pt-4 border-t border-stone-50">
                 <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest italic">{t.market.climateSource}</p>
              </div>
          </div>

          {/* Market KPI Info */}
          <div className="bg-stone-900 text-white rounded-[3.5rem] p-10 shadow-2xl space-y-8">
            <h3 className="text-2xl font-black text-primary flex items-center gap-3">
              <Info size={24} /> {t.market.strategyTitle}
            </h3>
            <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-2">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">{t.market.sentimentLabel}</p>
                    <p className="text-2xl font-black">{t.market.sentimentValue}</p>
                    <p className="text-xs text-stone-400 italic">{t.market.sentimentDesc}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-2">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">{t.market.arbitrageLabel}</p>
                    <p className="text-2xl font-black text-primary">{t.market.arbitrageValue}</p>
                    <p className="text-xs text-stone-400 italic">{t.market.arbitrageDesc}</p>
                </div>
            </div>
            <button className="w-full py-5 bg-primary text-stone-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
                {t.market.depthBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MandiRow = ({ name, price, delta, trend, priorityLabel }: { name: string, price: string, delta: string, trend: 'up' | 'down' | 'stable', priorityLabel: string }) => (
  <div className="flex items-center justify-between p-6 bg-stone-50/50 border border-stone-100 rounded-3xl hover:bg-white hover:border-primary/20 transition-all group">
     <div className="flex items-center gap-5">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100 group-hover:text-primary transition-colors">
          <MapPin size={18} />
        </div>
        <div className="space-y-0.5">
           <p className="text-sm font-black text-stone-900">{name}</p>
           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">{priorityLabel}</p>
        </div>
     </div>
     <div className="text-right flex items-center gap-8">
        <div className="space-y-0.5">
           <p className="text-xl font-black text-stone-900 tabular-nums">{price}</p>
           <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-red-400' : 'text-stone-400'}`}>
              {trend === 'up' && <TrendingUp size={10} />}
              {trend === 'down' && <TrendingDown size={10} />}
              {delta}
           </div>
        </div>
        <button className="p-2 text-stone-200 hover:text-stone-900 transition-colors">
          <ChevronRight size={18} />
        </button>
     </div>
  </div>
);

export default MarketPage;
