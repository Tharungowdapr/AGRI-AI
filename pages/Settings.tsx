import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Shield, 
  Save, 
  Database,
  CheckCircle2
} from 'lucide-react';
import { useLang, useAuth } from '../App';
import { Language } from '../translations';

const SettingsPage: React.FC = () => {
  const { lang, setLang, t } = useLang();
  const { user, updateUser } = useAuth();
  
  const [localLang, setLocalLang] = useState<Language>(lang);
  const [cluster, setCluster] = useState(user?.preferences?.cluster || 'South Karnataka');
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setCluster(user.preferences.cluster);
      setNotifications(user.preferences.notifications);
    }
  }, [user]);

  const handleSave = () => {
    setLang(localLang);
    if (user) {
      updateUser({
        ...user,
        preferences: {
          language: localLang,
          cluster: cluster,
          notifications: notifications
        }
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500 text-left">
      <div className="space-y-4 border-b border-stone-200 pb-10">
        <div className="flex items-center gap-4 text-primary">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <SettingsIcon size={32} />
          </div>
          <h1 className="text-5xl font-heading font-black text-stone-900 tracking-tighter">{t.settings.title}</h1>
        </div>
        <p className="text-stone-500 font-medium max-w-xl leading-relaxed">{t.settings.desc}</p>
      </div>

      <div className="grid gap-8">
        {/* Section: Regional */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-10 space-y-10 shadow-xl shadow-stone-200/50">
          <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
            <div className="bg-stone-50 p-3 rounded-xl text-stone-400">
               <Globe size={24} />
            </div>
            <h3 className="text-2xl font-black text-stone-900">{t.settings.regional}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.settings.langLabel}</label>
              <select 
                value={localLang}
                onChange={(e) => setLocalLang(e.target.value as Language)}
                className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{t.settings.clusterLabel}</label>
              <select 
                value={cluster} onChange={e => setCluster(e.target.value)}
                className="w-full p-5 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all appearance-none cursor-pointer"
              >
                <option>North Karnataka</option>
                <option>South Karnataka</option>
                <option>Coastal Region</option>
                <option>Malnad Region</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Notifications */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-10 space-y-10 shadow-xl shadow-stone-200/50">
          <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
            <div className="bg-stone-50 p-3 rounded-xl text-stone-400">
               <Bell size={24} />
            </div>
            <h3 className="text-2xl font-black text-stone-900">{t.settings.alerts}</h3>
          </div>
          <div className="space-y-8">
            <ToggleItem 
              label={t.settings.alertDesc} 
              desc={t.settings.alertSub}
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>
        </div>

        {/* Section: Privacy & Storage */}
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-10 space-y-10 shadow-xl shadow-stone-200/50">
          <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
            <div className="bg-stone-50 p-3 rounded-xl text-stone-400">
               <Shield size={24} />
            </div>
            <h3 className="text-2xl font-black text-stone-900">{t.settings.privacy}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-8 bg-stone-50 rounded-[2rem] border border-stone-200">
              <div className="flex gap-6 items-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <Database className="text-stone-300" size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-lg">{t.settings.vault}</h4>
                  <p className="text-sm text-stone-500 font-medium">{t.settings.vaultDesc}: {user?.history?.length || 0}</p>
                </div>
              </div>
              <button 
                onClick={() => user && updateUser({ ...user, history: [] })}
                className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 tracking-widest bg-red-50 px-6 py-2 rounded-xl transition-all"
              >
                {t.settings.purgeHistory}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 pt-10 pb-20">
          <button className="px-10 py-5 bg-stone-100 text-stone-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-all">
            {t.settings.reset}
          </button>
          <button 
            onClick={handleSave}
            className="px-12 py-5 bg-stone-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all flex items-center gap-3"
          >
            {saved ? <CheckCircle2 size={18} className="text-primary" /> : <Save size={18} />}
            {saved ? t.settings.savedMsg : t.settings.saveBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

const ToggleItem = ({ label, desc, checked, onChange }: any) => (
  <div className="flex items-center justify-between group">
    <div className="space-y-1">
      <h4 className="font-black text-stone-900 text-lg group-hover:text-primary transition-colors">{label}</h4>
      <p className="text-sm text-stone-500 font-medium max-w-sm">{desc}</p>
    </div>
    <button 
      onClick={onChange}
      className={`w-16 h-9 rounded-full transition-all relative border-4 ${checked ? 'bg-primary border-primary/20' : 'bg-stone-200 border-stone-300'}`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${checked ? 'left-8' : 'left-1'}`} />
    </button>
  </div>
);

export default SettingsPage;