import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  MessageSquare, 
  Sprout, 
  Loader2,
  ChevronRight,
  Target,
  Zap,
  History as HistoryIcon,
  Clock,
  Star,
  Send,
  ExternalLink
} from 'lucide-react';
import { analyzeCropImage } from '../geminiService';
import { AnalysisRecord, FeedbackEntry } from '../types';
import { useLang, useAuth } from '../App';

interface Props {
  onSave: (record: AnalysisRecord) => void;
  history: AnalysisRecord[];
}

const AnalysisPage: React.FC<Props> = ({ onSave, history }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewReady, setImagePreviewReady] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const { user } = useAuth();

  const getLangName = (code: string) => {
    switch(code) {
      case 'kn': return 'Kannada';
      default: return 'English';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        setError("File too large. Maximum size is 10MB.");
        return;
      }
      setImagePreviewReady(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        setShowFeedback(false);
        setFeedbackSubmitted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeCropImage(image, getLangName(lang));
      setResult(analysis);
      setShowFeedback(true);
      
      const record: AnalysisRecord = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: image,
        cropName: "Detected Crop",
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        details: {
          name: analysis.diseaseName,
          symptoms: analysis.symptoms || [],
          treatment: analysis.treatment || [],
          prevention: analysis.prevention || [],
          economicImpact: analysis.economicImpact,
          optimalConditions: analysis.yieldLossPercentage ? `Est. Loss: ${analysis.yieldLossPercentage}` : "Varies"
        }
      };
      onSave(record);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "High-latency or connection interruption. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!user || rating === 0) return;
    
    const feedback: FeedbackEntry = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      type: 'diagnosis',
      rating,
      comment: feedbackComment,
      timestamp: Date.now(),
      context: result?.diseaseName
    };

    const feedbackDb = JSON.parse(localStorage.getItem('kv_feedback_db') || '[]');
    feedbackDb.push(feedback);
    localStorage.setItem('kv_feedback_db', JSON.stringify(feedbackDb));
    
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const handleConsultAI = () => {
    if (!result) return;
    navigate('/chat', { 
      state: { 
        context: `I just performed a diagnostic scan that identified ${result.diseaseName} with ${(result.confidence * 100).toFixed(1)}% confidence. The symptoms are: ${result.symptoms.join(', ')}. Please provide a detailed management plan.` 
      } 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-10">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            <Target size={12} /> {t.analysis.title}
          </div>
          <h1 className="text-5xl font-heading font-bold text-stone-900 tracking-tight">
            {lang === 'kn' ? 'ಜೈವಿಕ' : 'Biological'} <span className="italic text-primary">{lang === 'kn' ? 'ಸ್ಕ್ಯಾನಿಂಗ್' : 'Scanning'}</span>
          </h1>
          <p className="text-stone-500 font-medium max-w-xl">{t.analysis.desc}</p>
        </div>
        <button 
          onClick={() => navigate('/history')}
          className="flex items-center gap-3 px-6 py-3 bg-stone-50 border border-stone-200 text-stone-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-stone-100 transition-all"
        >
          <HistoryIcon size={14} /> Full History
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start" ref={resultsRef}>
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-stone-200 border border-stone-100 space-y-10 relative overflow-hidden">
            <div className="aspect-[4/5] bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 overflow-hidden relative group">
              {!imagePreviewReady && image && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-10">
                  <Loader2 className="text-stone-300 animate-spin" size={32} />
                </div>
              )}
              
              {image ? (
                <>
                  <img 
                    src={image} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imagePreviewReady ? 'opacity-100' : 'opacity-0'}`} 
                    alt="Sample" 
                    onLoad={() => setImagePreviewReady(true)}
                  />
                  <button 
                    onClick={() => { setImage(null); setResult(null); }}
                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg text-red-500 shadow-md"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8">
                  <Camera size={48} className="text-primary float-anim" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-stone-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
                  >
                    {t.analysis.chooseFile}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
              )}
            </div>

            {image && !result && (
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="w-full py-6 rounded-[2rem] font-black text-white bg-primary hover:bg-stone-950 transition-all text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 disabled:bg-stone-300"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : t.analysis.runBtn}
              </button>
            )}
          </div>

          {/* Quick History Sidebar Widget */}
          <div className="bg-white border border-stone-200 rounded-[2.5rem] p-8 shadow-xl space-y-6 text-left">
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Recent Scans
            </h4>
            <div className="space-y-4">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/history')}>
                  <img src={item.imageUrl} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-stone-800 truncate">{item.diseaseName}</p>
                    <p className="text-[9px] font-bold text-stone-400 uppercase">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && <p className="text-xs italic text-stone-400">No diagnostic history found.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <div className="bg-stone-900 text-white rounded-[3.5rem] p-12 shadow-2xl space-y-12 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <CheckCircle size={200} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h2 className="text-5xl font-heading font-bold tracking-tight">{result.diseaseName}</h2>
                  <p className="text-stone-400 italic font-medium">Diagnostic Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <button 
                  onClick={handleConsultAI}
                  className="bg-primary text-stone-950 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-white transition-all"
                >
                  <MessageSquare size={16} /> Consult Vani AI
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                <ReportSection title={t.analysis.symptoms} items={result.symptoms} icon={Info} color="text-nature-accent" />
                <ReportSection title={t.analysis.treatment} items={result.treatment} icon={Sprout} color="text-primary" />
              </div>

              {showFeedback && (
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black text-primary">{t.feedback.title}</h4>
                    {feedbackSubmitted && <span className="text-xs font-bold text-emerald-400">{t.feedback.success}</span>}
                  </div>
                  {!feedbackSubmitted ? (
                    <>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button key={num} onClick={() => setRating(num)} className={`transition-all ${rating >= num ? 'text-nature-accent' : 'text-stone-700'}`}>
                            <Star size={32} fill={rating >= num ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={feedbackComment}
                        onChange={e => setFeedbackComment(e.target.value)}
                        placeholder={t.feedback.comment}
                        className="w-full bg-black/20 border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:ring-1 ring-primary/40"
                        rows={3}
                      />
                      <button 
                        onClick={handleFeedbackSubmit}
                        disabled={rating === 0}
                        className="w-full py-4 bg-primary text-stone-950 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30"
                      >
                        {t.feedback.submit}
                      </button>
                    </>
                  ) : (
                    <div className="py-6 text-center text-stone-400 italic">"Thank you for helping us optimize our neural core."</div>
                  )}
                </div>
              )}
            </div>
          ) : !loading && (
            <div className="h-full bg-stone-50 border border-stone-200 border-dashed rounded-[3.5rem] p-24 flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <Zap size={64} className="text-stone-300" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-stone-400 uppercase tracking-widest">Neural Terminal Standby</h3>
                <p className="text-stone-400 font-medium">Uplink biological visual pattern to initiate Scan cycle.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportSection = ({ title, items, icon: Icon, color }: any) => (
  <div className="space-y-6">
    <h3 className={`font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 ${color}`}>
      <Icon size={18} /> {title}
    </h3>
    <ul className="space-y-2">
      {(items || []).map((item: string, i: number) => (
        <li key={i} className="text-stone-300 text-sm font-medium leading-relaxed flex gap-3">
          <span className="text-stone-600 font-bold">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AnalysisPage;