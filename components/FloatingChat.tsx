import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Bot, 
  User as UserIcon,
  ChevronDown,
  Maximize2,
  Minimize2,
  History as HistoryIcon
} from 'lucide-react';
import { useLang, useAuth } from '../App';
import { sendMultiModalMessage } from '../geminiService';
import ReactMarkdown from 'react-markdown';
import { KARNATAKA_CROPS } from '../constants';

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLang();
  const { user } = useAuth();
  const location = useLocation();
  const { id: cropId } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Deep Context Extraction
  const getContextPrompt = () => {
    const path = location.pathname;
    let context = `User is currently at ${path}. `;

    // 1. Crop Context
    if (path.includes('/crops/')) {
      const crop = KARNATAKA_CROPS.find(c => c.id === cropId);
      if (crop) {
        context += `Specifically, they are viewing the profile for ${crop.name} (${crop.scientificName}). Provide advice specific to this crop's growth cycle and pests. `;
      }
    }

    // 2. Analysis Context
    if (path === '/analysis') {
      context += `They are in the biological scan terminal. They are likely looking for a diagnosis or have just performed one. `;
    }

    // 3. User History Context (The "All" reference)
    if (user?.history && user.history.length > 0) {
      const latestScans = user.history.slice(0, 3).map(h => `${h.diseaseName} on ${new Date(h.timestamp).toLocaleDateString()}`).join(', ');
      context += `The user has a history of these detected diseases: [${latestScans}]. Use this to inform your long-term agricultural strategy. `;
    }

    return context;
  };

  const getLangName = (code: string) => {
    switch(code) {
      case 'kn': return 'Kannada';
      default: return 'English';
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    const systemInstruction = `
      You are Vani AI, a sophisticated agricultural assistant.
      Current Context: ${getContextPrompt()}
      Language: Respond ONLY in ${getLangName(lang)}.
      Behavior: Be brief, technical yet accessible to farmers, and always use Markdown. 
      Reference the user's past scans if relevant to their question.
    `;

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendMultiModalMessage(history, userText, undefined, undefined, systemInstruction);
      setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Connectivity issues with the neural backbone. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Floating Icon View
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-stone-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-primary transition-all z-[100] group"
        aria-label="Open AI Assistant"
      >
        <div className="absolute -top-1 -right-1 bg-primary w-4 h-4 rounded-full border-2 border-white animate-pulse" />
        <Bot size={28} className="group-hover:rotate-12 transition-transform" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-stone-200 z-[100] overflow-hidden flex flex-col transition-all duration-300 animate-in slide-in-from-bottom-10 ${isMinimized ? 'h-20' : 'h-[650px]'}`}>
      {/* Header */}
      <div className="bg-stone-900 p-6 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl border border-primary/30">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <h4 className="font-black text-sm tracking-tight">Vani AI</h4>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Neural Context Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Feed */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-stone-50/50">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 opacity-40">
                <Bot size={60} className="text-stone-300" />
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest text-stone-500">How can I help you today?</p>
                  <p className="text-xs font-medium italic max-w-[200px]">
                    I can see your farm's history and current research focus.
                  </p>
                </div>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none prose prose-stone prose-sm'
                }`}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Processing Context...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Interface */}
          <div className="p-5 bg-white border-t border-stone-100">
            <form onSubmit={handleSend} className="flex gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-100 group-focus-within:border-primary transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chat.placeholder}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-stone-900 text-white p-3 rounded-xl hover:bg-primary transition-all disabled:opacity-30 shadow-lg"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChat;