
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisRecord } from '../types';
import { 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle, 
  MessageSquare, 
  FileText,
  Download,
  Trash2,
  Calendar,
  Zap,
  BarChart3,
  // Fix: Added missing History import as HistoryIcon
  History as HistoryIcon
} from 'lucide-react';
import { useLang, useAuth } from '../App';

interface Props {
  history: AnalysisRecord[];
}

const HistoryPage: React.FC<Props> = ({ history }) => {
  const { t } = useLang();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleConsultAI = (record: AnalysisRecord) => {
    // Navigate to chat with pre-filled context via state
    navigate('/chat', { 
      state: { 
        context: `I want to discuss my scan from ${new Date(record.timestamp).toLocaleDateString()}. It identified ${record.diseaseName}. I need a remediation plan.` 
      } 
    });
  };

  const purgeRecord = (id: string) => {
    if (user) {
      const filtered = user.history.filter(h => h.id !== id);
      updateUser({ ...user, history: filtered });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-stone-200 pb-12">
        <div className="space-y-6 text-left">
          <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
            <HistoryIcon size={12} /> {t.history.title}
          </div>
          <h1 className="text-6xl font-heading font-black text-stone-900 tracking-tighter leading-none">
            Diagnostic <br /><span className="italic text-primary">Archive</span>
          </h1>
          <p className="text-xl text-stone-500 font-medium max-w-xl italic">
            "A chronological record of molecular patterns detected across your acreage lifecycles."
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <button className="flex items-center gap-3 px-8 py-4 bg-stone-50 border border-stone-200 text-stone-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-100 transition-all shadow-sm">
             <Download size={14} /> Export Technical Ledger
           </button>
           <button 
             onClick={() => navigate('/analysis')}
             className="flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
           >
             <Zap size={14} /> New Diagnostic Scan
           </button>
        </div>
      </div>

      {/* Main Content */}
      {history.length === 0 ? (
        <div className="bg-white rounded-[4rem] p-32 text-center space-y-10 border border-stone-200 shadow-2xl shadow-stone-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="bg-stone-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-stone-100 shadow-inner">
            <Clock size={48} className="text-stone-300" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-heading font-black text-stone-800">{t.history.noRecords}</h2>
            <p className="text-stone-400 max-w-sm mx-auto font-medium italic text-lg leading-relaxed">
              Your diagnostic vault is currently empty. Initiate a scan to begin recording biogenic trends.
            </p>
          </div>
          <button 
            onClick={() => navigate('/analysis')}
            className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-900 transition-all shadow-2xl shadow-primary/20"
          >
            Start First Analysis
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {history.map((record) => (
            <div key={record.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-stone-200/40 border border-stone-100 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
              {/* Image Preview */}
              <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
                <img src={record.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Analysis Sample" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-stone-700 shadow-lg border border-stone-200 flex items-center gap-2">
                    <Calendar size={12} className="text-primary" />
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={() => purgeRecord(record.id)}
                  className="absolute top-6 right-6 p-3 bg-red-50/90 backdrop-blur-md text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-xl"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-xl shadow-primary/20 border border-primary/20 flex items-center gap-2">
                  <Zap size={12} /> {(record.confidence * 100).toFixed(0)}% Match
                </div>
              </div>

              {/* Data Content */}
              <div className="p-10 space-y-8 flex-grow text-left">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Pathogen Detected</p>
                  <h3 className="font-heading font-black text-3xl text-stone-900 group-hover:text-primary transition-colors leading-tight">
                    {record.diseaseName}
                  </h3>
                </div>

                <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 size={10} className="text-amber-500" /> Economic Impact
                    </h5>
                  </div>
                  <p className="text-sm text-stone-600 font-medium italic leading-relaxed">
                    "{record.details.economicImpact.split('.')[0]}."
                  </p>
                </div>
                
                <div className="pt-4 mt-auto flex flex-col gap-3">
                  <button 
                    onClick={() => handleConsultAI(record)}
                    className="w-full flex items-center justify-center gap-3 bg-stone-900 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-stone-200"
                  >
                    <MessageSquare size={16} /> Consult Vani AI
                  </button>
                  <button 
                    onClick={() => navigate('/analysis')}
                    className="w-full flex items-center justify-center gap-3 bg-white text-stone-500 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-stone-900 hover:border-stone-400 transition-all border border-stone-200"
                  >
                    View Molecular Breakdown <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Footer */}
      {history.length > 0 && (
        <div className="bg-stone-900 text-white p-12 lg:p-20 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[150px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="space-y-6 relative z-10 text-left">
            <h3 className="text-4xl font-heading font-black tracking-tight">Consolidated Yield Intelligence</h3>
            <p className="text-stone-400 font-medium max-w-xl text-lg leading-relaxed">
              Generate a unified report of your farm's biological health for bank evaluations, insurance claims, or agricultural research.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 relative z-10">
            <button className="bg-white/10 hover:bg-white/20 px-10 py-5 rounded-2xl font-black transition-all text-[10px] uppercase tracking-widest border border-white/10 backdrop-blur-md">
              Download CSV Ledger
            </button>
            <button className="bg-primary text-stone-950 px-12 py-5 rounded-2xl font-black hover:bg-white transition-all text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20">
              Download PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
