
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useLang } from '../App';
import { Sprout, Loader2, Mail, Lock, User, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, setLang } = useLang();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [region, setRegion] = useState('South Karnataka');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate Network Latency
    setTimeout(() => {
      const db: UserType[] = JSON.parse(localStorage.getItem('kv_user_db') || '[]');

      if (isRegister) {
        // Register Logic
        if (db.find(u => u.email === email)) {
          setError("User already registered with this biological link.");
          setLoading(false);
          return;
        }

        // Added role property to satisfy UserType interface
        const newUser: UserType = {
          id: Date.now().toString(),
          name: fullName,
          email: email,
          role: 'user',
          password: password, // In real apps, hash this!
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=65a30d&color=fff`,
          preferences: {
            language: 'en',
            cluster: region,
            notifications: true
          },
          history: []
        };

        db.push(newUser);
        localStorage.setItem('kv_user_db', JSON.stringify(db));
        login(newUser);
        navigate('/');
      } else {
        // Login Logic
        const foundUser = db.find(u => u.email === email && u.password === password);
        if (foundUser) {
          login(foundUser);
          // Sync language preference if available
          if (foundUser.preferences?.language) {
            setLang(foundUser.preferences.language as any);
          }
          navigate('/');
        } else {
          setError(t.auth.error);
        }
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 animate-in fade-in duration-1000">
      <div className="max-w-xl w-full grid md:grid-cols-1 gap-0 bg-white rounded-[4rem] border border-stone-200 shadow-2xl shadow-stone-200/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="p-10 lg:p-14 space-y-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-primary/10 w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-primary shadow-inner border border-primary/10">
              <Sprout size={40} className="float-anim" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-black text-stone-900 tracking-tighter leading-none">
                {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
              </h1>
              <p className="text-stone-400 font-medium text-sm italic">
                {isRegister ? t.auth.registerDesc : t.auth.loginDesc}
              </p>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.auth.fullName}</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-4">{t.auth.region}</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <select 
                    value={region} onChange={e => setRegion(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all appearance-none cursor-pointer"
                  >
                    <option>North Karnataka</option>
                    <option>South Karnataka</option>
                    <option>Coastal Region</option>
                    <option>Malnad Region</option>
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold italic border border-red-100 animate-in shake duration-500">
                {error}
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-stone-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-primary transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (isRegister ? t.auth.register : t.auth.signIn)}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="pt-6 border-t border-stone-50 flex flex-col items-center gap-6">
            <button 
              onClick={() => { setIsRegister(!isRegister); setError(null); }}
              className="text-stone-400 hover:text-stone-900 transition-colors text-xs font-black uppercase tracking-widest"
            >
              {isRegister ? t.auth.alreadyHave : t.auth.needAccount} <span className="text-primary ml-1">{isRegister ? t.auth.signIn : t.auth.register}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-stone-300 text-[10px] font-bold uppercase tracking-[0.3em]">
              <ShieldCheck size={12} className="text-primary/40" /> Neural Data Encryption Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
