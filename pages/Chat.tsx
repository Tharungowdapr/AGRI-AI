import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  X,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Plus,
  Clock,
  Menu,
  ChevronLeft,
  Star,
  ThumbsUp
} from 'lucide-react';
import { sendMultiModalMessage, speakText, decodeBase64Manual, decodeAudioDataManual } from '../geminiService';
import ReactMarkdown from 'react-markdown';
import { useLang, useAuth } from '../App';
import { ChatMessage, ChatSession, FeedbackEntry } from '../types';

const ChatPage: React.FC = () => {
  const { t, lang } = useLang();
  const { user, updateUser } = useAuth();
  const location = useLocation();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBuffersCache = useRef<Map<string, AudioBuffer>>(new Map());

  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const getLangName = (code: string) => code === 'kn' ? 'Kannada' : 'English';

  const systemInstruction = `You are KrishiVigyan AI, a helpful agricultural assistant for farmers in Karnataka. Respond exclusively in ${getLangName(lang)}.`;

  useEffect(() => {
    if (user?.chatHistory) setSessions(user.chatHistory);
    if (location.state?.context) {
      startNewChat(location.state.context);
    } else if (user?.chatHistory && user.chatHistory.length > 0) {
      const last = user.chatHistory[0];
      setCurrentSessionId(last.id);
      setMessages(last.messages);
    }
  }, [user?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (!currentSessionId || !user) return;
    const updatedSessions = sessions.map(s => s.id === currentSessionId ? { ...s, messages } : s);
    const current = sessions.find(s => s.id === currentSessionId);
    if (current && JSON.stringify(current.messages) !== JSON.stringify(messages)) {
      setSessions(updatedSessions);
      updateUser({ ...user, chatHistory: updatedSessions });
    }
  }, [messages]);

  const startNewChat = async (initialContext?: string) => {
    stopPlayback();
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: initialContext ? (initialContext.slice(0, 30) + '...') : t.chat.newChat,
      timestamp: Date.now(),
      messages: []
    };
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    setCurrentSessionId(newId);
    setMessages([]);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    if (user) updateUser({ ...user, chatHistory: updatedSessions });
    if (initialContext) await handleSendMessage(initialContext);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const userText = textOverride || input.trim();
    if ((!userText && !selectedImage && !recordedAudio) || loading) return;

    let sid = currentSessionId;
    if (!sid) {
      sid = Date.now().toString();
      setCurrentSessionId(sid);
      setSessions(prev => [{ id: sid!, title: userText.slice(0, 30) + '...', timestamp: Date.now(), messages: [] }, ...prev]);
    }

    const newUserMessage: ChatMessage = { 
      id: Date.now().toString(),
      role: 'user', 
      text: userText || "Analysis Uplink",
      image: selectedImage?.preview
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const responseText = await sendMultiModalMessage(history, userText, undefined, undefined, systemInstruction);
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText || '' };
      setMessages(prev => [...prev, modelMsg]);
      if (messages.length > 4 && !feedbackSubmitted) setShowFeedback(true);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Service busy." }]);
    } finally {
      setLoading(true); setLoading(false);
    }
  };

  const submitFeedback = () => {
    if (!user || rating === 0) return;
    const feedback: FeedbackEntry = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      type: 'chat',
      rating,
      comment: "Chat session quality rating",
      timestamp: Date.now(),
      context: sessions.find(s => s.id === currentSessionId)?.title
    };
    const feedbackDb = JSON.parse(localStorage.getItem('kv_feedback_db') || '[]');
    feedbackDb.push(feedback);
    localStorage.setItem('kv_feedback_db', JSON.stringify(feedbackDb));
    setFeedbackSubmitted(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioCtxRef.current;
  };

  const stopPlayback = () => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }
    setPlaybackStatus('stopped');
    setPlayingId(null);
  };

  const pausePlayback = async () => {
    const ctx = initAudioContext();
    if (ctx.state === 'running') { await ctx.suspend(); setPlaybackStatus('paused'); }
  };

  const playAdvice = async (message: ChatMessage) => {
    const ctx = initAudioContext();
    if (playingId === message.id && playbackStatus === 'paused') {
      const ctx = initAudioContext();
      await ctx.resume();
      setPlaybackStatus('playing');
      return;
    }
    stopPlayback();
    setPlayingId(message.id);
    setPlaybackStatus('playing');
    try {
      let buffer = audioBuffersCache.current.get(message.id);
      if (!buffer) {
        const base64Audio = await speakText(message.text);
        if (!base64Audio) throw new Error();
        const bytes = decodeBase64Manual(base64Audio);
        buffer = await decodeAudioDataManual(bytes, ctx, 24000, 1);
        audioBuffersCache.current.set(message.id, buffer);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => { if (currentSourceRef.current === source) { setPlaybackStatus('stopped'); setPlayingId(null); } };
      currentSourceRef.current = source;
      source.start(0);
    } catch (err) {
      setPlaybackStatus('stopped');
      setPlayingId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-stone-50 overflow-hidden animate-in fade-in duration-500">
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-stone-200 flex flex-col transition-all duration-300 relative shrink-0`}>
        <div className="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">{t.chat.history}</h3>
          <button onClick={() => startNewChat()} className="p-2 hover:bg-stone-50 rounded-xl text-primary transition-all shadow-sm border border-stone-100"><Plus size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {sessions.map(s => (
            <button key={s.id} onClick={() => { setCurrentSessionId(s.id); setMessages(s.messages); }} className={`w-full text-left p-4 rounded-2xl transition-all group relative flex items-start gap-4 ${currentSessionId === s.id ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-stone-50'}`}>
              <MessageCircle size={14} className="mt-1 text-stone-300" />
              <div className="flex-1 min-w-0 pr-6">
                <p className={`text-xs font-black truncate ${currentSessionId === s.id ? 'text-stone-900' : 'text-stone-500'}`}>{s.title}</p>
                <p className="text-[9px] font-bold text-stone-400 uppercase mt-1">{new Date(s.timestamp).toLocaleDateString()}</p>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-stone-200 rounded-full shadow-lg z-20 flex items-center justify-center text-stone-400"><ChevronLeft size={16} /></button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-inner relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-100 px-8 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-4">
             {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-stone-400 mr-2"><Menu size={20} /></button>}
             <Bot size={24} className="text-primary" />
             <div>
               <h2 className="text-lg font-black text-stone-900">{t.chat.title}</h2>
               <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.chat.subtitle}</p>
             </div>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-10">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${m.role === 'user' ? 'bg-primary border-primary/20 text-white' : 'bg-white border-stone-100 text-stone-400'}`}>
                  {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-primary text-white' : 'bg-stone-50 text-stone-800'}`}>
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                  {m.role === 'model' && (
                    <button onClick={() => playingId === m.id && playbackStatus === 'playing' ? pausePlayback() : playAdvice(m)} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-blue-500">
                      {playingId === m.id && playbackStatus === 'playing' ? <Pause size={12} /> : <Play size={12} />} Voice Output
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><Loader2 className="animate-spin text-primary" size={20} /></div>}
          
          {showFeedback && (
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl space-y-4 max-w-sm mx-auto text-center shadow-lg animate-in slide-in-from-bottom-2">
              <p className="text-xs font-black text-primary uppercase tracking-widest">Rate this session</p>
              <div className="flex justify-center gap-3">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className={`${rating >= n ? 'text-nature-accent' : 'text-stone-300'}`}>
                    <Star size={24} fill={rating >= n ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <button onClick={submitFeedback} disabled={rating === 0} className="w-full bg-primary text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30">Submit Feedback</button>
            </div>
          )}
        </div>

        <div className="p-8 md:px-12 md:pb-12 bg-white shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3 items-center bg-stone-100 p-2 rounded-[2.5rem] border border-stone-200">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.chat.placeholder} className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-4 h-12" disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="bg-primary text-white p-4 rounded-full shadow-lg"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;