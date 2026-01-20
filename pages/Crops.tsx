import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KARNATAKA_CROPS } from '../constants';
import { 
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useLang } from '../App';
import { CropData } from '../types';

const CROP_ASSETS: Record<string, string> = {
  'paddy': 'https://img.freepik.com/free-photo/beautiful-shot-rice-field-ticino-mountains-switzerland_181624-34331.jpg?semt=ais_hybrid&w=740&q=80', 
  'sugarcane': 'https://images.unsplash.com/photo-1594750802422-777651030e46?auto=format&fit=crop&q=80&w=800',
  'ragi': 'https://images.unsplash.com/photo-1628102428503-49d799f2b800?auto=format&fit=crop&q=80&w=1200',
  'maize': 'https://static.vecteezy.com/system/resources/thumbnails/071/529/668/small/cornfield-agriculture-maize-crop-cultivation-rural-harvest-free-photo.jpg',
  'banana': 'https://img.freepik.com/premium-photo/large-bunches-ripe-bananas-branches-banana-palms-against-backdrop-rows_1266905-628.jpg?semt=ais_hybrid&w=740&q=80',
  'chilli': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMEXCv_BJXPyVUwTecJxs-fYRQO2cVgbxCGQ&s',
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1200',
  'potato': 'https://plantix.net/en/library/assets/custom/crop-images/potato.jpeg',
  'cotton': 'https://t4.ftcdn.net/jpg/06/84/31/79/360_F_684317966_Pn9qU1DEfW5zpwoj25znJ1i0VdaOM2Px.jpg',
  'groundnut': 'https://img.freepik.com/free-photo/groundnut-field-background_1150-13745.jpg?w=1200',
  'cauliflower': 'https://img.freepik.com/free-photo/cauliflower-field-background_1150-13745.jpg?w=1200',
  'coconut': 'https://images.unsplash.com/photo-1591193116340-e22137599021?auto=format&fit=crop&q=80&w=1200',
  'pepper': 'https://img.freepik.com/free-photo/black-pepper-plant-background_1150-13745.jpg?w=1200',
  'turmeric': 'https://img.freepik.com/free-photo/turmeric-field-background_1150-13745.jpg?w=1200',
  'greengram': 'https://img.freepik.com/free-photo/green-gram-field-background_1150-13745.jpg?w=1200'
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800';

const ImageWithFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-stone-100 flex items-center justify-center ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-50 z-20">
          <Loader2 className="text-stone-300 animate-spin" size={24} />
        </div>
      )}
      <img 
        src={imgSrc} 
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 z-10 ${loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (imgSrc !== FALLBACK_IMAGE) {
            setImgSrc(FALLBACK_IMAGE);
          } else {
            setLoading(false);
          }
        }}
        loading="lazy"
      />
    </div>
  );
};

const CropsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCrops, setAllCrops] = useState<CropData[]>([]);
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    const stored = localStorage.getItem('kv_master_crops');
    if (stored) {
      setAllCrops(JSON.parse(stored));
    } else {
      setAllCrops(KARNATAKA_CROPS);
    }
  }, []);

  const filteredCrops = allCrops.filter(crop => {
    const localizedName = t.crops[crop.id] || crop.name;
    return localizedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 text-left">
          <h1 className="text-5xl font-heading font-black text-stone-900 tracking-tighter">{t.nav.knowledge}</h1>
          <p className="text-stone-500 font-medium max-w-xl">{t.knowledge.subtitle}</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder={t.common.search}
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl outline-none focus:ring-4 ring-primary/10 transition-all font-bold text-stone-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="bg-white border border-stone-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-stone-200/40 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
            <div className="h-64 relative overflow-hidden">
              <ImageWithFallback 
                src={CROP_ASSETS[crop.id] || FALLBACK_IMAGE} 
                alt={t.crops[crop.id] || crop.name}
                className="w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none z-20" />
              <div className="absolute bottom-6 left-6 z-30">
                 <span className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                  {crop.season === 'Annual' ? t.common.annual : t.common.kharifRabi} {t.common.variety}
                 </span>
              </div>
            </div>
            
            <div className="p-10 space-y-6 flex-grow text-left">
              <div className="space-y-2">
                <h3 className="text-3xl font-heading font-black text-stone-900 group-hover:text-primary transition-colors">
                   {t.crops[crop.id] || crop.name}
                </h3>
                <p className="text-sm font-medium text-stone-400 italic">{crop.scientificName}</p>
              </div>

              <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed font-medium italic bg-stone-50 p-4 rounded-xl border border-stone-100">
                "{t.crops[`${crop.id}Desc`] || crop.description}"
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 space-y-1 shadow-sm">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.common.growthCycle}</p>
                  <p className="text-xs font-black text-stone-900">{crop.duration}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-stone-100 space-y-1 shadow-sm">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{t.common.yieldPotential}</p>
                  <p className="text-xs font-black text-stone-900">{crop.optimalYield.potential.split(' ')[0]}</p>
                </div>
              </div>
            </div>

            <div className="px-10 pb-10 mt-auto">
              <button 
                onClick={() => navigate(`/crops/${crop.id}`)}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl"
              >
                {t.common.accessProfile} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropsPage;
