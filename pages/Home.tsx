
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Bug, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Zap, 
  ExternalLink
} from 'lucide-react';
import { useLang } from '../App';

const HomePage: React.FC = () => {
  const { t } = useLang();

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section - High Impact */}
      <section className="relative min-h-[90vh] flex items-center px-6 lg:px-12">
        <div className="absolute inset-4 overflow-hidden rounded-[3rem] lg:rounded-[5xl]">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2600" 
            className="w-full h-full object-cover scale-105 brightness-75" 
            alt="Karnataka Paddy Field" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/20 to-transparent" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto w-full py-20">
          <div className="max-w-4xl space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t.hero.badge}
            </div>
            
            <div className="space-y-0">
               <h1 className="text-6xl md:text-9xl font-heading font-black text-white/90 leading-[0.8] tracking-tighter opacity-80">
                {t.hero.titlePart1}
              </h1>
              <h1 className="text-6xl md:text-9xl font-heading font-black text-white leading-[0.9] tracking-tighter">
                {t.hero.titlePart2}
              </h1>
              <h1 className="text-6xl md:text-9xl font-heading font-black text-primary italic leading-[0.9] tracking-tighter">
                {t.hero.titlePart3}
              </h1>
            </div>
            
            <p className="text-xl text-stone-200 font-medium leading-relaxed max-w-xl opacity-90">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Link to="/analysis" className="bg-primary text-stone-950 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-3 group">
                {t.hero.startBtn} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/chat" className="bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg backdrop-blur-md flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                <MessageSquare size={20} /> {t.hero.talkBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features - High Contrast */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* Main Module - Diagnosis */}
          <div className="md:col-span-4 lg:col-span-3 bg-white border border-stone-200 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Bug size={300} />
            </div>
            <div className="space-y-6 relative z-10 text-left">
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl w-fit">
                <Bug size={32} />
              </div>
              <h3 className="text-4xl font-heading font-bold text-stone-900 leading-tight">
                {t.analysis.title}
              </h3>
              <p className="text-stone-500 font-medium text-lg italic">
                {t.analysis.desc.split('.')[0]}.
              </p>
            </div>
            <Link to="/analysis" className="mt-10 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all">
              {t.analysis.runBtn} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Market Intelligence */}
          <div className="md:col-span-2 lg:col-span-3 bg-stone-900 text-white rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-2xl transition-all relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="space-y-6 text-left">
              <div className="bg-primary/20 text-primary p-4 rounded-2xl w-fit border border-primary/20">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-4xl font-heading font-bold leading-tight">
                {t.market.title}
              </h3>
              <p className="text-stone-400 font-medium text-lg italic">
                {t.market.desc.split('.')[0]}.
              </p>
            </div>
            <Link to="/market" className="mt-10 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary hover:gap-4 transition-all">
              {t.market.trajectory} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Knowledge Card */}
          <div className="md:col-span-2 bg-stone-100 border border-stone-200 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-xl transition-all group h-full">
            <div className="space-y-4 text-left">
               <BookOpen className="text-stone-400 group-hover:text-primary transition-colors" size={32} />
               <h4 className="text-2xl font-bold text-stone-900">{t.nav.knowledge}</h4>
               <p className="text-sm text-stone-500 font-medium">{t.knowledge.subtitle}</p>
            </div>
            <Link to="/crops" className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2 hover:text-stone-900">
               {t.common.browse} <ExternalLink size={12} />
            </Link>
          </div>

          {/* AI Support */}
          <div className="md:col-span-2 bg-primary text-stone-950 rounded-[3rem] p-10 flex flex-col justify-between hover:shadow-xl transition-all shadow-2xl shadow-primary/10 group h-full">
            <div className="space-y-4 text-left">
               <Zap className="text-stone-950/60 group-hover:scale-110 transition-transform" size={32} />
               <h4 className="text-2xl font-bold">{t.home.featureChatTitle}</h4>
               <p className="text-sm text-stone-900/70 font-bold">{t.home.aiSub}</p>
            </div>
            <Link to="/chat" className="mt-8 bg-stone-950 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center">
               {t.home.messageAi}
            </Link>
          </div>

          {/* Impact Stats */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-[3rem] p-10 flex flex-col justify-center space-y-6 h-full text-left">
             <div className="space-y-1">
                <p className="text-5xl font-heading font-bold text-stone-900 tracking-tighter">4.2M</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.hero.acreageStat}</p>
             </div>
             <div className="w-full h-px bg-stone-100"></div>
             <div className="space-y-1">
                <p className="text-5xl font-heading font-bold text-stone-900 tracking-tighter">98%</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{t.hero.confidenceStat}</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
