import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  MessageSquare, 
  Users, 
  Trash2, 
  Plus, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Save,
  Loader2,
  Zap,
  Activity
} from 'lucide-react';
import { useLang, useAuth } from '../App';
import { CropData, FeedbackEntry, User, AnalysisRecord } from '../types';
import { KARNATAKA_CROPS } from '../constants';

const AdminPage: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'crops' | 'feedback' | 'users' | 'scans'>('crops');
  const [crops, setCrops] = useState<CropData[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [globalScans, setGlobalScans] = useState<(AnalysisRecord & { userName: string; userEmail: string })[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load data from simulated Relational DB (localStorage)
    const storedCrops = localStorage.getItem('kv_master_crops');
    if (storedCrops) setCrops(JSON.parse(storedCrops));
    else {
      setCrops(KARNATAKA_CROPS);
      localStorage.setItem('kv_master_crops', JSON.stringify(KARNATAKA_CROPS));
    }

    setFeedbacks(JSON.parse(localStorage.getItem('kv_feedback_db') || '[]'));
    setUsers(JSON.parse(localStorage.getItem('kv_user_db') || '[]'));
    setGlobalScans(JSON.parse(localStorage.getItem('kv_global_scans_db') || '[]'));
  }, []);

  const deleteCrop = (id: string) => {
    if (!confirm("Are you sure you want to purge this biological varietal from the registry?")) return;
    const updated = crops.filter(c => c.id !== id);
    setCrops(updated);
    localStorage.setItem('kv_master_crops', JSON.stringify(updated));
  };

  const handleAddCrop = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const newCrop: CropData = {
      id: (formData.get('id') as string).toLowerCase().replace(/\s+/g, '_'),
      name: formData.get('name') as string,
      scientificName: formData.get('scientificName') as string,
      duration: formData.get('duration') as string,
      season: formData.get('season') as string,
      description: formData.get('description') as string,
      stages: [], 
      market: {
        msp: `₹${formData.get('msp')}/quintal`,
        variation: 'Stable',
        peakHarvest: 'N/A',
        currentPrice: formData.get('msp') as string,
        forecastPrice: formData.get('msp') as string,
        prices: [],
        estimatedInvestment: `₹${formData.get('investment')}`,
        estimatedProfit: `₹${formData.get('profit')}`
      },
      optimalYield: {
        temperature: '20-30°C',
        soil: 'Loamy',
        sunlight: 'Full Sun',
        spacing: 'N/A',
        water: 'Regular',
        fertilizer: 'NPK',
        potential: 'N/A',
        avgYield: 'N/A'
      },
      resources: [],
      diseaseMatrix: []
    };

    setTimeout(() => {
      const updated = [newCrop, ...crops];
      setCrops(updated);
      localStorage.setItem('kv_master_crops', JSON.stringify(updated));
      setShowAddModal(false);
      setIsSubmitting(false);
    }, 1000);
  };

  const promoteToAdmin = (email: string) => {
    const updatedUsers = users.map(u => u.email === email ? { ...u, role: 'admin' as const } : u);
    setUsers(updatedUsers);
    localStorage.setItem('kv_user_db', JSON.stringify(updatedUsers));
  };

  const revokeAdmin = (email: string) => {
    if (email === "tharungowdapr@gmail.com") {
      alert("Root Administrative privileges cannot be revoked.");
      return;
    }
    const updatedUsers = users.map(u => u.email === email ? { ...u, role: 'user' as const } : u);
    setUsers(updatedUsers);
    localStorage.setItem('kv_user_db', JSON.stringify(updatedUsers));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500 text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-nature-accent uppercase tracking-[0.4em]">
            <ShieldCheck size={14} /> Neural Overdrive Active
          </div>
          <h1 className="text-5xl font-heading font-black text-stone-900 tracking-tighter">
            Admin <span className="italic text-primary">Terminal</span>
          </h1>
          <p className="text-stone-500 font-medium max-w-xl italic">
            Central orchestration hub for biological datasets, user intelligence, and system access.
          </p>
        </div>

        <div className="flex flex-wrap bg-stone-50 p-1.5 rounded-2xl border border-stone-100 gap-1">
          <TabButton active={activeTab === 'crops'} onClick={() => setActiveTab('crops')} icon={Sprout} label={t.admin.cropsTab} />
          <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} icon={MessageSquare} label={t.admin.feedbackTab} />
          <TabButton active={activeTab === 'scans'} onClick={() => setActiveTab('scans')} icon={Search} label="System Scans" />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label={t.admin.usersTab} />
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <AdminStat icon={Sprout} label={t.admin.cropCount} value={crops.length} color="text-primary" />
        <AdminStat icon={MessageSquare} label={t.admin.feedbackCount} value={feedbacks.length} color="text-nature-accent" />
        <AdminStat icon={Zap} label="Total Scans" value={globalScans.length} color="text-amber-500" />
        <AdminStat icon={Users} label={t.admin.userCount} value={users.length} color="text-blue-500" />
      </div>

      <div className="bg-white border border-stone-200 rounded-[3.5rem] p-10 lg:p-14 shadow-xl min-h-[600px]">
        {activeTab === 'crops' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-stone-900">{t.admin.cropsTab}</h3>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Molecular Varietal Master Registry</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-stone-900 transition-all"
              >
                <Plus size={16} /> {t.admin.addCrop}
              </button>
            </div>
            <div className="grid gap-4">
              {crops.map(crop => (
                <div key={crop.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100 hover:bg-white hover:border-primary/20 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-stone-100 shadow-sm text-primary group-hover:rotate-12 transition-transform">
                        <Sprout size={24} />
                      </div>
                      <div>
                        <p className="font-black text-stone-900">{t.crops[crop.id] || crop.name}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{crop.scientificName} • {crop.duration}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-stone-800">{crop.market.msp}</p>
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Floor MSP</p>
                     </div>
                     <button onClick={() => deleteCrop(crop.id)} className="p-3 text-stone-300 hover:text-red-500 transition-colors">
                       <Trash2 size={20} />
                     </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-stone-900">{t.admin.feedbackTab}</h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Stakeholder Experience Pulse</p>
            </div>
            {feedbacks.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <MessageSquare size={48} />
                <p className="text-stone-400 italic">{t.admin.noFeedback}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {feedbacks.sort((a,b) => b.timestamp - a.timestamp).map(fb => (
                  <div key={fb.id} className="p-8 bg-stone-50 rounded-3xl border border-stone-100 space-y-4 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${fb.type === 'diagnosis' ? 'bg-nature-accent/10 text-nature-accent' : 'bg-primary/10 text-primary'}`}>
                           {fb.type === 'diagnosis' ? <Search size={16} /> : <MessageSquare size={16} />}
                         </div>
                         <div>
                            <p className="text-xs font-black text-stone-900">{fb.userName}</p>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{new Date(fb.timestamp).toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="flex gap-1 text-nature-accent">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < fb.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-100">
                       <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Context Reference: {fb.context || 'General Intelligence'}</p>
                       <p className="text-sm font-medium text-stone-700 italic">"{fb.comment || 'No descriptive comment provided.'}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scans' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
             <div className="space-y-1">
              <h3 className="text-2xl font-black text-stone-900">System Diagnostic Stream</h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Global Pathogen Detection Feed</p>
            </div>
            {globalScans.length === 0 ? (
               <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Activity size={48} />
                <p className="text-stone-400 italic">No global scan data uplinked.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                 {globalScans.map((scan, idx) => (
                    <div key={idx} className="flex items-center gap-8 p-6 bg-stone-50 rounded-[2.5rem] border border-stone-100">
                       <img src={scan.imageUrl} className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-white" alt="Scan" />
                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-lg font-black text-stone-900">{scan.diseaseName}</h4>
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{scan.userName} ({scan.userEmail})</p>
                             </div>
                             <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-primary border border-stone-200">{(scan.confidence * 100).toFixed(0)}% Precision</span>
                          </div>
                          <p className="text-xs text-stone-500 italic">Target Match: {scan.cropName} • {new Date(scan.timestamp).toLocaleString()}</p>
                       </div>
                    </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-stone-900">{t.admin.usersTab}</h3>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Neural Access Permissions Center</p>
            </div>
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-6 bg-stone-50 rounded-3xl border border-stone-100 hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-6">
                    <img src={u.photoURL} className="w-12 h-12 rounded-2xl border border-white shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-stone-900 flex items-center gap-2">
                        {u.name} 
                        {u.email === "tharungowdapr@gmail.com" && <span className="bg-nature-accent text-[8px] font-black text-stone-950 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-nature-accent/50">Root Admin</span>}
                      </p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-nature-accent/10 text-nature-accent border border-nature-accent/20' : 'bg-stone-200 text-stone-500'}`}>
                      {u.role}
                    </span>
                    {user?.email === "tharungowdapr@gmail.com" && u.email !== "tharungowdapr@gmail.com" && (
                      u.role === 'admin' ? (
                        <button onClick={() => revokeAdmin(u.email)} className="text-[10px] font-black text-red-400 hover:text-red-500 px-4 py-1.5 border border-red-100 rounded-lg bg-red-50 transition-colors uppercase">Revoke Access</button>
                      ) : (
                        <button onClick={() => promoteToAdmin(u.email)} className="text-[10px] font-black text-primary hover:text-nature-accent px-4 py-1.5 border border-primary/10 rounded-lg bg-primary/5 transition-colors uppercase">Uplink Admin</button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 text-left">
              <header className="bg-stone-900 p-8 flex justify-between items-center text-white">
                 <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-2 rounded-xl">
                       <Sprout size={24} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Register Biological Varietal</h3>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
              </header>

              <form onSubmit={handleAddCrop} className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <FormInput name="id" label="Registry ID (Unique)" placeholder="e.g. ragi_byadagi" required />
                    <FormInput name="name" label="Common Name" placeholder="e.g. Byadagi Ragi" required />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <FormInput name="scientificName" label="Scientific Name" placeholder="e.g. Eleusine coracana" required />
                    <FormInput name="duration" label="Biological Cycle" placeholder="e.g. 110-120 Days" required />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Sowing Season</label>
                       <select name="season" className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800">
                          <option>Kharif</option>
                          <option>Rabi</option>
                          <option>Annual</option>
                       </select>
                    </div>
                    <FormInput name="msp" label="Current MSP (Base Rate)" placeholder="2300" type="number" required />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <FormInput name="investment" label="Estimated Investment / Acre" placeholder="35000" type="number" />
                    <FormInput name="profit" label="Target Net Profit / Acre" placeholder="40000" type="number" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">Botanical Overview</label>
                    <textarea name="description" rows={3} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-medium text-stone-800" placeholder="Technical description for neural grounding..." required />
                 </div>

                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Commit to Registry</>}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const FormInput = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">{label}</label>
    <input {...props} className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 font-bold text-stone-800 transition-all" />
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
      active ? 'bg-white text-primary shadow-md' : 'text-stone-400 hover:text-stone-600'
    }`}
  >
    <Icon size={14} />
    {label}
  </button>
);

const AdminStat = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white border border-stone-200 p-8 rounded-[2.5rem] flex items-center justify-between shadow-lg shadow-stone-200/40 hover:border-primary/20 transition-all">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-black text-stone-900 tabular-nums">{value}</p>
    </div>
    <div className={`p-4 rounded-2xl bg-stone-50 ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export default AdminPage;
