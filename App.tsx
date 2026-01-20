import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu,
  X,
  Sprout,
  Globe,
  Home,
  Search,
  BookOpen,
  History as HistoryIcon,
  MessageCircle,
  Settings as SettingsIcon,
  Cpu,
  ChevronDown,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

import HomePage from './pages/Home';
import AnalysisPage from './pages/Analysis';
import CropsPage from './pages/Crops';
import CropDetailPage from './pages/CropDetail';
import MarketPage from './pages/Market';
import ChatPage from './pages/Chat';
import HistoryPage from './pages/History';
import EnhancementPage from './pages/Enhancement';
import SettingsPage from './pages/Settings';
import TrackerPage from './pages/Tracker';
import LoginPage from './pages/Login';
import AdminPage from './pages/Admin'; // New Admin Page
import FloatingChat from './components/FloatingChat';
import { AnalysisRecord, User } from './types';
import { translations, Language } from './translations';

// Simple Context for Localization
interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LangProvider");
  return context;
};

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "tharungowdapr@gmail.com";

  useEffect(() => {
    const savedUser = localStorage.getItem('kv_session');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      // Ensure logic for core admin is persistent
      if (u.email === ADMIN_EMAIL) u.role = 'admin';
      
      const db = JSON.parse(localStorage.getItem('kv_user_db') || '[]');
      const latest = db.find((item: User) => item.id === u.id);
      if (latest) {
        setUser({ ...latest, role: latest.email === ADMIN_EMAIL ? 'admin' : latest.role });
      } else {
        setUser(u);
      }
    }
    setLoading(false);
  }, []);

  const login = (u: User) => {
    const userToLogin = { ...u, role: u.email === ADMIN_EMAIL ? 'admin' : u.role };
    setUser(userToLogin);
    localStorage.setItem('kv_session', JSON.stringify(userToLogin));
    
    const db = JSON.parse(localStorage.getItem('kv_user_db') || '[]');
    const index = db.findIndex((item: User) => item.id === u.id);
    if (index === -1) {
      db.push(userToLogin);
    } else {
      db[index] = userToLogin;
    }
    localStorage.setItem('kv_user_db', JSON.stringify(db));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kv_session');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('kv_session', JSON.stringify(updated));
    const db = JSON.parse(localStorage.getItem('kv_user_db') || '[]');
    const index = db.findIndex((item: User) => item.id === updated.id);
    if (index !== -1) {
      db[index] = updated;
      localStorage.setItem('kv_user_db', JSON.stringify(db));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: t.nav.home, icon: Home },
    { path: '/analysis', label: t.nav.detection, icon: Search },
    { path: '/crops', label: t.nav.knowledge, icon: BookOpen },
    { path: '/market', label: t.nav.market, icon: Globe },
    { path: '/tracker', label: t.nav.tracker, icon: Cpu },
    { path: '/chat', label: t.nav.chat, icon: MessageCircle },
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'kn', name: 'ಕನ್ನಡ' }
  ];

  const getLangName = (l: Language) => {
    switch(l) {
      case 'kn': return 'ಕನ್ನಡ';
      default: return 'English';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md z-50 px-6 lg:px-12 flex items-center justify-between border-b border-stone-100 shadow-sm">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Sprout size={24} />
          </div>
          <span className="text-2xl font-black text-stone-800 tracking-tight font-heading italic">{t.brand}</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
                ${isActive ? 'text-primary' : 'text-stone-400 hover:text-stone-800'}
              `}
            >
              <item.icon size={14} />
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
             <NavLink
               to="/admin"
               className={({ isActive }) => `
                 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all
                 ${isActive ? 'text-nature-accent' : 'text-stone-400 hover:text-stone-800'}
               `}
             >
               <LayoutDashboard size={14} />
               {t.nav.admin}
             </NavLink>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button 
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-2 text-stone-600 text-[10px] font-black uppercase tracking-widest bg-stone-50 px-4 py-2 rounded-full border border-stone-100 hover:bg-stone-100 transition-colors"
          >
            <Globe size={14} className="text-primary" />
            <span>{getLangName(lang)}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLangDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-stone-100 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                    lang === l.code ? 'text-primary bg-primary/5' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="relative" ref={userRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 bg-stone-50 border border-stone-100 pl-1.5 pr-4 py-1.5 rounded-full hover:border-primary transition-all shadow-sm"
            >
              <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-white" />
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest hidden sm:block">{user.name.split(' ')[0]}</span>
              <ChevronDown size={12} className="text-stone-400" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-100 rounded-[2rem] shadow-2xl py-4 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 pb-3 border-b border-stone-50 mb-2">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={10} className="text-primary" /> {t.auth.welcome}
                  </p>
                  <p className="text-sm font-black text-stone-900 truncate">{user.name}</p>
                  <p className="text-[9px] text-stone-400 font-medium truncate">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-nature-accent hover:bg-nature-accent/5 rounded-xl transition-all">
                    <LayoutDashboard size={14} /> Admin Terminal
                  </Link>
                )}
                <Link to="/tracker" className="flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-stone-500 hover:text-primary hover:bg-stone-50 rounded-xl transition-all">
                  <Cpu size={14} /> My Acreage Hub
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-stone-500 hover:text-primary hover:bg-stone-50 rounded-xl transition-all">
                  <SettingsIcon size={14} /> {t.nav.settings}
                </Link>
                <button 
                  onClick={() => { logout(); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={14} /> {t.auth.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg">
            <UserIcon size={14} /> Login
          </Link>
        )}

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-stone-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-stone-100 p-6 space-y-6 shadow-xl animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-stone-600 font-black text-xs uppercase tracking-widest py-2"
              >
                <item.icon size={18} className="text-primary" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLang();

  const addAnalysis = (record: AnalysisRecord) => {
    if (!user) return;
    
    // User personal history
    const updated = [record, ...(user.history || [])];
    updateUser({ ...user, history: updated });

    // Admin global records
    const globalScans = JSON.parse(localStorage.getItem('kv_global_scans_db') || '[]');
    globalScans.unshift({
      ...record,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    });
    localStorage.setItem('kv_global_scans_db', JSON.stringify(globalScans.slice(0, 500))); // Keep last 500
  };

  return (
    <div className="min-h-screen bg-bg-base pt-20 flex flex-col">
      <Navbar />
      <main className="flex-grow relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/analysis" element={<AnalysisPage onSave={addAnalysis} history={user?.history || []} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/crops/:id" element={<CropDetailPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/history" element={<HistoryPage history={user?.history || []} />} />
          <Route path="/enhancements" element={<EnhancementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <TrackerPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingChat />
      </main>
      
      <footer className="bg-stone-900 text-stone-400 py-12 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 items-start text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-black text-2xl font-heading italic">
              <Sprout size={28} className="text-primary" /> {t.brand} AI
            </div>
          </div>
          <div className="flex flex-col gap-3 font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="text-white mb-2">QUICK LINKS</span>
            <Link to="/analysis" className="hover:text-primary transition-colors">{t.nav.detection}</Link>
            <Link to="/market" className="hover:text-primary transition-colors">{t.nav.market}</Link>
          </div>
          <div className="flex flex-col gap-3 font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="text-white mb-2">SYSTEM</span>
            <Link to="/enhancements" className="hover:text-primary transition-colors">Neural Roadmap</Link>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white">SYSTEM STATUS</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black text-[10px] uppercase">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {t.common.online}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('user_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('user_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LangContext.Provider>
  );
};

export default App;
