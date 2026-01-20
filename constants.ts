import { CropData, DiseaseInfo, CropStage } from './types';

const PADDY_STAGES: CropStage[] = [
  { stage: 'Nursery & Sowing', days: '0-25', temp: '25-35°C', waterLevel: 'Saturated', nutrientNeeds: 'FYM + DAP', keyTasks: 'Seed treatment, Bed preparation', majorDiseases: ['Seedling Blight'], yieldImpact: '15%', economicLoss: '₹3,000', investment: '₹8,000' },
  { stage: 'Transplanting', days: '25-40', temp: '28-32°C', waterLevel: '2-3 cm standing', nutrientNeeds: 'Basal NPK', keyTasks: 'Gap filling, Weeding', majorDiseases: ['Root Rot'], yieldImpact: '10%', economicLoss: '₹2,500', investment: '₹12,000' },
  { stage: 'Tillering', days: '40-70', temp: '28-32°C', waterLevel: '5 cm standing', nutrientNeeds: 'Urea Top-dress', keyTasks: 'Water monitoring', majorDiseases: ['Rice Blast'], yieldImpact: '25%', economicLoss: '₹8,000', investment: '₹5,000' },
  { stage: 'Panicle Initiation', days: '70-100', temp: '25-30°C', waterLevel: 'Consistent saturation', nutrientNeeds: 'Potash application', keyTasks: 'Pest scouting', majorDiseases: ['Stem Borer', 'Sheath Rot'], yieldImpact: '30%', economicLoss: '₹12,000', investment: '₹4,000' },
  { stage: 'Harvesting', days: '120-150', temp: '20-25°C', waterLevel: 'Drain field', nutrientNeeds: 'None', keyTasks: 'Moisture testing', majorDiseases: ['Grain Discoloration'], yieldImpact: '5%', economicLoss: '₹1,500', investment: '₹6,000' }
];

const BANANA_STAGES: CropStage[] = [
  { stage: 'Planting', days: '0-30', temp: '25-30°C', waterLevel: 'Moist', nutrientNeeds: 'FYM + Vermicompost', keyTasks: 'Pit digging, Sucker treatment', majorDiseases: ['Rhizome Rot'], yieldImpact: '20%', economicLoss: '₹10,000', investment: '₹40,000' },
  { stage: 'Vegetative Growth', days: '30-180', temp: '25-30°C', waterLevel: 'Regular irrigation', nutrientNeeds: 'Nitrogen Split 1 & 2', keyTasks: 'Desuckering, Weeding', majorDiseases: ['Sigatoka Leaf Spot'], yieldImpact: '30%', economicLoss: '₹15,000', investment: '₹25,000' },
  { stage: 'Bunch Initiation', days: '180-240', temp: '20-30°C', waterLevel: 'High demand', nutrientNeeds: 'Potassium rich feed', keyTasks: 'Propping, Bagging', majorDiseases: ['Bunchy Top'], yieldImpact: '40%', economicLoss: '₹25,000', investment: '₹15,000' },
  { stage: 'Harvesting', days: '300-360', temp: '20-25°C', waterLevel: 'Moderate', nutrientNeeds: 'None', keyTasks: 'Cutting, Packing', majorDiseases: ['Fruit Rot'], yieldImpact: '10%', economicLoss: '₹5,000', investment: '₹10,000' }
];

const CHILLI_STAGES: CropStage[] = [
  { stage: 'Nursery', days: '0-35', temp: '25-30°C', waterLevel: 'Controlled', nutrientNeeds: 'DAP', keyTasks: 'Hardening', majorDiseases: ['Damping Off'], yieldImpact: '15%', economicLoss: '₹2,000', investment: '₹5,000' },
  { stage: 'Establishment', days: '35-60', temp: '25-32°C', waterLevel: 'Regular', nutrientNeeds: 'NPK 19:19:19', keyTasks: 'Transplanting, Gap filling', majorDiseases: ['Root Rot'], yieldImpact: '10%', economicLoss: '₹3,000', investment: '₹10,000' },
  { stage: 'Flowering & Fruiting', days: '60-120', temp: '22-28°C', waterLevel: 'Critical demand', nutrientNeeds: 'Micronutrients + Boron', keyTasks: 'Pest monitoring', majorDiseases: ['Leaf Curl Virus', 'Fruit Rot'], yieldImpact: '50%', economicLoss: '₹30,000', investment: '₹15,000' },
  { stage: 'Harvesting', days: '120-180', temp: '20-25°C', waterLevel: 'Low', nutrientNeeds: 'None', keyTasks: 'Drying', majorDiseases: ['Powdery Mildew'], yieldImpact: '10%', economicLoss: '₹5,000', investment: '₹8,000' }
];

const SUGARCANE_STAGES: CropStage[] = [
  { stage: 'Germination', days: '0-45', temp: '25-32°C', waterLevel: 'High', nutrientNeeds: 'Basal Nitrogen', keyTasks: 'Sett treatment', majorDiseases: ['Red Rot'], yieldImpact: '20%', economicLoss: '₹15,000', investment: '₹35,000' },
  { stage: 'Tillering', days: '45-120', temp: '28-35°C', waterLevel: 'Moderate', nutrientNeeds: 'Nitrogen Split 1', keyTasks: 'Earthing up', majorDiseases: ['Smut'], yieldImpact: '15%', economicLoss: '₹10,000', investment: '₹20,000' },
  { stage: 'Grand Growth', days: '120-270', temp: '25-32°C', waterLevel: 'High', nutrientNeeds: 'Potash application', keyTasks: 'Propping', majorDiseases: ['Top Borer', 'Wilt'], yieldImpact: '40%', economicLoss: '₹30,000', investment: '₹25,000' },
  { stage: 'Maturity', days: '270-360', temp: '15-25°C', waterLevel: 'Stop irrigation', nutrientNeeds: 'None', keyTasks: 'Brix testing', majorDiseases: ['Grassy Shoot'], yieldImpact: '10%', economicLoss: '₹5,000', investment: '₹5,000' }
];

const TOMATO_STAGES: CropStage[] = [
  { stage: 'Nursery', days: '0-25', temp: '20-28°C', waterLevel: 'Light misting', nutrientNeeds: 'DAP', keyTasks: 'Hardening off', majorDiseases: ['Damping off'], yieldImpact: '15%', economicLoss: '₹5,000', investment: '₹6,000' },
  { stage: 'Vegetative', days: '25-50', temp: '22-30°C', waterLevel: 'Drip regular', nutrientNeeds: 'NPK 19:19:19', keyTasks: 'Staking, Mulching', majorDiseases: ['Early Blight', 'Bacterial Spot'], yieldImpact: '20%', economicLoss: '₹10,000', investment: '₹12,000' },
  { stage: 'Flowering', days: '50-75', temp: '20-25°C', waterLevel: 'Controlled', nutrientNeeds: 'Calcium Boron', keyTasks: 'Pruning', majorDiseases: ['Leaf Curl', 'Septoria Leaf Spot'], yieldImpact: '35%', economicLoss: '₹20,000', investment: '₹10,000' },
  { stage: 'Fruiting & Harvest', days: '75-120', temp: '18-24°C', waterLevel: 'Steady', nutrientNeeds: 'SOP', keyTasks: 'Grading', majorDiseases: ['Fruit Borer', 'Late Blight'], yieldImpact: '20%', economicLoss: '₹15,000', investment: '₹8,000' }
];

const MAIZE_STAGES: CropStage[] = [
  { stage: 'Sowing & Germination', days: '0-15', temp: '25-32°C', waterLevel: 'Moist', nutrientNeeds: 'DAP + Zinc', keyTasks: 'Seed treatment', majorDiseases: ['Seedling Blight'], yieldImpact: '10%', economicLoss: '₹2,000', investment: '₹12,000' },
  { stage: 'Knee-High Stage', days: '15-45', temp: '25-35°C', waterLevel: 'Moderate', nutrientNeeds: 'Urea top dressing', keyTasks: 'Weeding, Pest checking', majorDiseases: ['Fall Armyworm'], yieldImpact: '50%', economicLoss: '₹12,000', investment: '₹8,000' },
  { stage: 'Tasseling & Silking', days: '45-75', temp: '25-30°C', waterLevel: 'Critical irrigation', nutrientNeeds: 'Potash application', keyTasks: 'Nutrient spraying', majorDiseases: ['Common Rust'], yieldImpact: '20%', economicLoss: '₹5,000', investment: '₹5,000' },
  { stage: 'Maturity & Harvest', days: '75-110', temp: '20-28°C', waterLevel: 'Dry', nutrientNeeds: 'None', keyTasks: 'Cob drying', majorDiseases: ['Grain Mold'], yieldImpact: '5%', economicLoss: '₹1,500', investment: '₹5,000' }
];

const POTATO_STAGES: CropStage[] = [
  { stage: 'Sprouting', days: '0-20', temp: '15-20°C', waterLevel: 'Low', nutrientNeeds: 'FYM + NPK', keyTasks: 'Seed grading', majorDiseases: ['Rhizoctonia'], yieldImpact: '15%', economicLoss: '₹5,000', investment: '₹25,000' },
  { stage: 'Vegetative Growth', days: '20-50', temp: '20-25°C', waterLevel: 'Consistent', nutrientNeeds: 'Nitrogen Split', keyTasks: 'Earthing up', majorDiseases: ['Early Blight'], yieldImpact: '20%', economicLoss: '₹8,000', investment: '₹15,000' },
  { stage: 'Tuber Initiation', days: '50-80', temp: '15-20°C', waterLevel: 'High demand', nutrientNeeds: 'Potash Rich', keyTasks: 'Late Blight scout', majorDiseases: ['Late Blight'], yieldImpact: '60%', economicLoss: '₹30,000', investment: '₹10,000' },
  { stage: 'Harvesting', days: '90-110', temp: '15-20°C', waterLevel: 'Stop irrigation', nutrientNeeds: 'None', keyTasks: 'Dehaulming', majorDiseases: ['Common Scab'], yieldImpact: '10%', economicLoss: '₹4,000', investment: '₹10,000' }
];

const COTTON_STAGES: CropStage[] = [
  { stage: 'Establishment', days: '0-30', temp: '25-35°C', waterLevel: 'Moist', nutrientNeeds: 'NPK basal', keyTasks: 'Thinning, Weeding', majorDiseases: ['Damping Off'], yieldImpact: '10%', economicLoss: '₹2,000', investment: '₹15,000' },
  { stage: 'Square Formation', days: '30-60', temp: '25-32°C', waterLevel: 'Moderate', nutrientNeeds: 'Nitrogen top dress', keyTasks: 'Pest monitoring', majorDiseases: ['Bacterial Blight'], yieldImpact: '20%', economicLoss: '₹5,000', investment: '₹10,000' },
  { stage: 'Boll Development', days: '60-120', temp: '22-30°C', waterLevel: 'Regular', nutrientNeeds: 'Potassium + Boron', keyTasks: 'Insect management', majorDiseases: ['Wilt', 'Leaf Curl'], yieldImpact: '40%', economicLoss: '₹15,000', investment: '₹15,000' },
  { stage: 'Harvesting', days: '120-180', temp: '20-28°C', waterLevel: 'Dry', nutrientNeeds: 'None', keyTasks: 'Picking', majorDiseases: ['Boll Rot'], yieldImpact: '5%', economicLoss: '₹1,500', investment: '₹10,000' }
];

export const KARNATAKA_CROPS: CropData[] = [
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    scientificName: 'Oryza sativa',
    duration: '120-150 Days',
    season: 'Kharif/Rabi',
    description: 'Staple food crop requiring submerged conditions. High pathogen pressure in humid delta and river basin zones.',
    market: {
      msp: '₹2,300/quintal',
      variation: '₹1,800-₹2,500/quintal',
      peakHarvest: 'Oct-Jan',
      currentPrice: '2,300',
      forecastPrice: '2,450',
      prices: [],
      estimatedInvestment: '₹35,000 - ₹45,000 / Acre',
      estimatedProfit: '₹25,000 - ₹40,000 / Acre'
    },
    optimalYield: {
      temperature: '25-35°C',
      soil: 'Heavy clay or clayey loam',
      sunlight: '6-8 hours daily',
      spacing: '20cm x 15cm',
      water: 'Submerged (5-10cm)',
      fertilizer: 'NPK (100:50:50)',
      potential: '40-60 Quintals/Acre',
      avgYield: '4.2 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Rice___Leaf_Blast', seedling: 'low', tillering: 'high', panicle: 'high', ripening: 'moderate' },
      { disease: 'Rice___Brown_Spot', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'moderate' },
      { disease: 'Rice___Bacterial_Blight', seedling: 'moderate', tillering: 'high', panicle: 'high', ripening: 'high' }
    ],
    stages: PADDY_STAGES
  },
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa paradisiaca',
    duration: '10-12 Months',
    season: 'Annual',
    description: 'Grown for both fruit and fiber. Highly vulnerable to soil-borne wilts and leaf pathogens.',
    market: {
      msp: '₹1,200-₹1,800/quintal',
      variation: '₹800-₹2,200',
      peakHarvest: 'Year-round',
      currentPrice: '1,450',
      forecastPrice: '1,600',
      prices: [],
      estimatedInvestment: '₹90,000 - ₹1,20,000 / Acre',
      estimatedProfit: '₹1,50,000 - ₹2,50,000 / Acre'
    },
    optimalYield: {
      temperature: '25-30°C',
      soil: 'Deep well-drained loamy',
      sunlight: 'High intensity',
      spacing: '1.8m x 1.8m',
      water: 'Weekly irrigation',
      fertilizer: 'NPK (200:100:300)',
      potential: '20-30 Tons/Acre',
      avgYield: '25 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Banana___Leaf_Spot', seedling: 'moderate', tillering: 'high', panicle: 'high', ripening: 'high' },
      { disease: 'Banana___Panama_Wilt', seedling: 'high', tillering: 'high', panicle: 'high', ripening: 'high' }
    ],
    stages: BANANA_STAGES
  },
  {
    id: 'chilli',
    name: 'Chilli',
    scientificName: 'Capsicum annuum',
    duration: '150-180 Days',
    season: 'Kharif/Rabi',
    description: 'Vital spice crop. Leaf curl viruses transmitted by whiteflies are a major threat.',
    market: {
      msp: '₹15,000-₹20,000/quintal',
      variation: 'High volatility',
      peakHarvest: 'Jan-Mar',
      currentPrice: '18,200',
      forecastPrice: '19,500',
      prices: [],
      estimatedInvestment: '₹38,000 - ₹50,000 / Acre',
      estimatedProfit: '₹60,000 - ₹1,00,000 / Acre'
    },
    optimalYield: {
      temperature: '20-30°C',
      soil: 'Black cotton or loamy',
      sunlight: 'Full sun',
      spacing: '60cm x 45cm',
      water: 'Controlled',
      fertilizer: '150:75:75 NPK',
      potential: '15-25 Quintals/Acre',
      avgYield: '18 Q/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Chilli___Leaf_Curl', seedling: 'high', tillering: 'high', panicle: 'moderate', ripening: 'low' },
      { disease: 'Chilli___Anthracnose', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' }
    ],
    stages: CHILLI_STAGES
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    duration: '90-120 Days',
    season: 'Annual',
    description: 'High-value crop requiring intensive management of blights and bacterial pathogens.',
    market: {
      msp: 'Market Dependent',
      variation: '₹500-₹5,000/crate',
      peakHarvest: 'Feb-May',
      currentPrice: '1,200',
      forecastPrice: '1,100',
      prices: [],
      estimatedInvestment: '₹35,000 - ₹55,000 / Acre',
      estimatedProfit: '₹40,000 - ₹1,50,000 / Acre'
    },
    optimalYield: {
      temperature: '18-28°C',
      soil: 'Sandy loam to clay',
      sunlight: '6-8 hours',
      spacing: '60cm x 45cm',
      water: 'Frequent light',
      fertilizer: '100:50:50 NPK',
      potential: '30-50 Tons/Acre',
      avgYield: '35 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Tomato___Early_Blight', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' },
      { disease: 'Tomato___Late_Blight', seedling: 'low', tillering: 'high', panicle: 'high', ripening: 'high' },
      { disease: 'Tomato___Bacterial_Spot', seedling: 'moderate', tillering: 'high', panicle: 'high', ripening: 'high' },
      { disease: 'Tomato___Leaf_Mold', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' }
    ],
    stages: TOMATO_STAGES
  },
  {
    id: 'potato',
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    duration: '90-110 Days',
    season: 'Kharif/Rabi',
    description: 'Starchy tuber crop. Late blight is the most critical threat during cool, humid periods.',
    market: {
      msp: '₹1,500-₹2,000/quintal',
      variation: '₹1,200-₹2,500',
      peakHarvest: 'Aug-Oct',
      currentPrice: '1,800',
      forecastPrice: '1,950',
      prices: [],
      estimatedInvestment: '₹60,000 - ₹80,000 / Acre',
      estimatedProfit: '₹40,000 - ₹90,000 / Acre'
    },
    optimalYield: {
      temperature: '15-20°C',
      soil: 'Loose sandy loam',
      sunlight: 'Full sun',
      spacing: '60cm x 20cm',
      water: 'Regular',
      fertilizer: '150:100:100 NPK',
      potential: '15-20 Tons/Acre',
      avgYield: '18 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Potato___Early_Blight', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' },
      { disease: 'Potato___Late_Blight', seedling: 'moderate', tillering: 'high', panicle: 'high', ripening: 'high' },
      { disease: 'Potato___Common_Scab', seedling: 'low', tillering: 'moderate', panicle: 'moderate', ripening: 'high' }
    ],
    stages: POTATO_STAGES
  },
  {
    id: 'cotton',
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    duration: '160-180 Days',
    season: 'Kharif',
    description: 'Major fiber crop. Sucking pests and leaf curl virus limit productivity in rainfed areas.',
    market: {
      msp: '₹7,121/quintal',
      variation: '₹6,000-₹8,000',
      peakHarvest: 'Nov-Jan',
      currentPrice: '7,200',
      forecastPrice: '7,400',
      prices: [],
      estimatedInvestment: '₹50,000 - ₹65,000 / Acre',
      estimatedProfit: '₹40,000 - ₹70,000 / Acre'
    },
    optimalYield: {
      temperature: '21-30°C',
      soil: 'Deep black soil',
      sunlight: 'Abundant',
      spacing: '90cm x 60cm',
      water: 'Rainfed/Irrigated',
      fertilizer: '120:60:60 NPK',
      potential: '10-15 Quintals/Acre',
      avgYield: '12 Q/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Cotton___Leaf_Curl', seedling: 'high', tillering: 'high', panicle: 'moderate', ripening: 'low' },
      { disease: 'Cotton___Bacterial_Blight', seedling: 'low', tillering: 'high', panicle: 'high', ripening: 'moderate' }
    ],
    stages: COTTON_STAGES
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    duration: '10-12 Months',
    season: 'Annual',
    description: 'Intensive cash crop. Red rot is a devastating systemic fungal pathogen.',
    market: {
      msp: '₹3,400/tonne',
      variation: 'FRP basis',
      peakHarvest: 'Oct-Apr',
      currentPrice: '3,400',
      forecastPrice: '3,550',
      prices: [],
      estimatedInvestment: '₹85,000 - ₹1,10,000 / Acre',
      estimatedProfit: '₹1,00,000 - ₹1,80,000 / Acre'
    },
    optimalYield: {
      temperature: '20-35°C',
      soil: 'Deep well drained loamy',
      sunlight: 'Abundant',
      spacing: '1.2m rows',
      water: 'High (Frequent)',
      fertilizer: '250:100:125 NPK',
      potential: '40-60 Tons/Acre',
      avgYield: '80 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Sugarcane___Red_Rot', seedling: 'moderate', tillering: 'high', panicle: 'high', ripening: 'high' },
      { disease: 'Sugarcane___Smut', seedling: 'low', tillering: 'high', panicle: 'moderate', ripening: 'low' }
    ],
    stages: SUGARCANE_STAGES
  },
  {
    id: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    duration: '80-110 Days',
    season: 'Kharif/Rabi',
    description: 'Versatile cereal. Fall armyworm and leaf spots are primary biotic constraints.',
    market: {
      msp: '₹2,225/quintal',
      variation: '₹1,600-₹2,000 range',
      peakHarvest: 'Sep-Oct',
      currentPrice: '2,050',
      forecastPrice: '2,150',
      prices: [],
      estimatedInvestment: '₹30,000 - ₹40,000 / Acre',
      estimatedProfit: '₹20,000 - ₹35,000 / Acre'
    },
    optimalYield: {
      temperature: '25-32°C',
      soil: 'Rich loamy soil',
      sunlight: 'Full sun',
      spacing: '60cm x 20cm',
      water: 'Moderate',
      fertilizer: 'High Nitrogen',
      potential: '25-45 Quintals/Acre',
      avgYield: '5.5 T/ha'
    },
    resources: [],
    diseaseMatrix: [
      { disease: 'Maize___Common_Rust', seedling: 'high', tillering: 'high', panicle: 'moderate', ripening: 'moderate' },
      { disease: 'Maize___Gray_Leaf_Spot', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' },
      { disease: 'Maize___Blight', seedling: 'low', tillering: 'moderate', panicle: 'high', ripening: 'high' }
    ],
    stages: MAIZE_STAGES
  }
];

export const PLANTVILLAGE_DB: Record<string, any> = {
  "Rice___Leaf_Blast": {
    en: {
      name: "Rice Blast",
      symptoms: ["Spindle-shaped spots with gray centers", "Neck rot", "Brown lesions on nodes"],
      treatment: ["Spray Tricyclazole", "Avoid excessive nitrogen"],
      prevention: ["Resistant varieties", "Seed treatment"],
      economicImpact: "Yield loss of 30-50% in severe cases.",
      optimalConditions: "25-28°C, 90% humidity"
    },
    kn: {
      name: "ಭತ್ತದ ಕಲಿ ರೋಗ (Rice Blast)",
      symptoms: ["ಹಡಗಿನ ಆಕಾರದ ಬೂದು ಬಣ್ಣದ ಕಲೆಗಳು", "ತೆನೆ ಒಣಗುವಿಕೆ (ನೆಕ್ ರಾಟ್)", "ಗಣ್ಣುಗಳ ಮೇಲೆ ಕಂದು ಬಣ್ಣದ ಗಾಯಗಳು"],
      treatment: ["ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್ ಸಿಂಪಡಿಸಿ", "ಹೆಚ್ಚಿನ ಸಾರಜನಕ ಬಳಕೆ ತಪ್ಪಿಸಿ"],
      prevention: ["ರೋಗ ನಿರೋಧಕ ತಳಿಗಳ ಬಳಕೆ", "ಬೀಜೋಪಚಾರ ಮಾಡುವುದು"],
      economicImpact: "ತೀವ್ರ ಸಂದರ್ಭಗಳಲ್ಲಿ ಶೇಕಡಾ 30-50 ರಷ್ಟು ಇಳುವರಿ ನಷ್ಟ.",
      optimalConditions: "25-28°C ತಾಪಮಾನ, 90% ತೇವಾಂಶ"
    }
  },
  "Rice___Brown_Spot": {
    en: {
      name: "Rice Brown Spot",
      symptoms: ["Oval dark brown spots", "Yellow halo around spots", "Premature drying of leaves"],
      treatment: ["Spray Propiconazole", "Maintain soil fertility"],
      prevention: ["Balanced fertilizer use", "Soil testing"],
      economicImpact: "Yield reduction of 10-25%.",
      optimalConditions: "25-30°C, high humidity"
    },
    kn: {
      name: "ಭತ್ತದ ಕಂದು ಮಚ್ಚೆ ರೋಗ (Rice Brown Spot)",
      symptoms: ["ಅಂಡಾಕಾರದ ದಟ್ಟ ಕಂದು ಬಣ್ಣದ ಕಲೆಗಳು", "ಕಲೆಗಳ ಸುತ್ತ ಹಳದಿ ವಲಯ", "ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಒಣಗುವುದು"],
      treatment: ["ಪ್ರೊಪಿಕೊನಾಜೋಲ್ ಸಿಂಪಡಿಸಿ", "ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಕಾಪಾಡಿಕೊಳ್ಳಿ"],
      prevention: ["ಸಮತೋಲಿತ ರಸಗೊಬ್ಬರ ಬಳಕೆ", "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ"],
      economicImpact: "ಶೇಕಡಾ 10-25 ರಷ್ಟು ಇಳುವರಿ ಕುಂಠಿತ.",
      optimalConditions: "25-30°C, ಹೆಚ್ಚಿನ ತೇವಾಂಶ"
    }
  },
  "Rice___Bacterial_Blight": {
    en: {
      name: "Bacterial Blight",
      symptoms: ["Water-soaked streaks", "Yellowing of leaf margins", "Bacterial ooze"],
      treatment: ["Streptocycline application", "Balanced fertilizer use"],
      prevention: ["Stable water levels", "Destruction of stubble"],
      economicImpact: "Yield loss up to 60%.",
      optimalConditions: "Wind and heavy rain"
    },
    kn: {
      name: "ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಬ್ಲೈಟ್ (Bacterial Blight)",
      symptoms: ["ನೀರಿನಿಂದ ಕೂಡಿದ ಪಟ್ಟಿಗಳು", "ಎಲೆಯ ಅಂಚುಗಳು ಹಳದಿಯಾಗುವುದು", "ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಸ್ರಾವ"],
      treatment: ["ಸ್ಟ್ರೆಪ್ಟೋಸೈಕ್ಲಿನ್ ಬಳಕೆ", "ಸಮತೋಲಿತ ಗೊಬ್ಬರ ಬಳಕೆ"],
      prevention: ["ನೀರಿನ ಮಟ್ಟ ಕಾಪಾಡುವುದು", "ಬೆಳೆ ತ್ಯಾಜ್ಯ ನಾಶ"],
      economicImpact: "ಶೇಕಡಾ 60 ರಷ್ಟು ಇಳುವರಿ ನಷ್ಟ.",
      optimalConditions: "ಗಾಳಿ ಮತ್ತು ಭಾರಿ ಮಳೆ"
    }
  },
  "Maize___Gray_Leaf_Spot": {
    en: {
      name: "Gray Leaf Spot",
      symptoms: ["Rectangular gray spots", "Spots between veins", "Stalk lodging"],
      treatment: ["Strobilurin fungicides", "Deep plowing"],
      prevention: ["Crop rotation (2+ years)", "Resistant varieties"],
      economicImpact: "Severe impact on photosynthesis.",
      optimalConditions: "Warm and humid"
    },
    kn: {
      name: "ಬೂದು ಎಲೆ ಮಚ್ಚೆ ರೋಗ (Gray Leaf Spot)",
      symptoms: ["ಆಯತಾಕಾರದ ಬೂದು ಬಣ್ಣದ ಕಲೆಗಳು", "ಗೆರೆಗಳ ನಡುವಿನ ಕಲೆಗಳು", "ಸಸ್ಯ ಉರುಳುವುದು"],
      treatment: ["ಸೊಬ್ರಿಲುರಿನ್ ಶಿಲೀಂಧ್ರನಾಶಕಗಳು", "ಆಳವಾಗಿ ಉಳುಮೆ ಮಾಡುವುದು"],
      prevention: ["ಬೆಳೆ ಪರಿವರ್ತನೆ (2 ವರ್ಷ+)", "ರೋಗ ನಿರೋಧಕ ತಳಿಗಳು"],
      economicImpact: "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಮೇಲೆ ತೀವ್ರ ಪರಿಣಾಮ.",
      optimalConditions: "ಬೆಚ್ಚನೆಯ ಮತ್ತು ತೇವಾಂಶಭರಿತ"
    }
  },
  "Maize___Blight": {
    en: {
      name: "Turcicum Leaf Blight",
      symptoms: ["Long cigar-shaped lesions", "Gray-green or brown color", "Severe leaf drying"],
      treatment: ["Carbendazim + Mancozeb", "Balanced NPK"],
      prevention: ["Resistant hybrids", "Crop residue destruction"],
      economicImpact: "15-50% yield reduction.",
      optimalConditions: "Cool weather with high dew"
    },
    kn: {
      name: "ತುರ್ಸಿಕಮ್ ಎಲೆ ಒಣಗುವ ರೋಗ (Turcicum Leaf Blight)",
      symptoms: ["ಉದ್ದವಾದ ಸಿಗಾರ್ ಆಕಾರದ ಕಲೆಗಳು", "ಬೂದು-ಹಸಿರು ಅಥವಾ ಕಂದು ಬಣ್ಣ", "ಎಲೆಗಳ ತೀವ್ರ ಒಣಗುವಿಕೆ"],
      treatment: ["ಕಾರ್ಬೆಂಡಾಜಿಮ್ + ಮ್ಯಾಂಕೋಜೆಬ್", "ಸಮತೋಲಿತ ಎನ್.ಪಿ.ಕೆ (NPK)"],
      prevention: ["ರೋಗ ನಿರೋಧಕ ಹೈಬ್ರಿಡ್ ಬಳಕೆ", "ಬೆಳೆ ಅವಶೇಷಗಳ ನಾಶ"],
      economicImpact: "ಶೇಕಡಾ 15-50 ರಷ್ಟು ಇಳುವರಿ ಕಡಿತ.",
      optimalConditions: "ಹೆಚ್ಚಿನ ಮಂಜು ಹೊಂದಿರುವ ತಂಪಾದ ಹವಾಮಾನ"
    }
  },
  "Maize___Common_Rust": {
    en: {
      name: "Common Rust",
      symptoms: ["Small powdery brown pustules", "Both leaf surfaces infected", "Yellowing"],
      treatment: ["Apply Mancozeb", "Proper row spacing"],
      prevention: ["Early planting", "Resistant varieties"],
      economicImpact: "Affects grain filling.",
      optimalConditions: "Cool temperatures"
    },
    kn: {
      name: "ಸಾಮಾನ್ಯ ತುಕ್ಕು ರೋಗ (Common Rust)",
      symptoms: ["ಸಣ್ಣ ಪುಡಿ ಕಂದು ಬಣ್ಣದ ಗುಳ್ಳೆಗಳು", "ಎಲೆಯ ಎರಡೂ ಬದಿಗಳಲ್ಲಿ ಸೋಂಕು", "ಹಳದಿಯಾಗುವುದು"],
      treatment: ["ಮ್ಯಾಂಕೋಜೆಬ್ ಬಳಸಿ", "ಸೂಕ್ತ ಸಾಲು ಅಂತರ"],
      prevention: ["ಮುಂಜಾನೆ ಬಿತ್ತನೆ", "ರೋಗ ನಿರೋಧಕ ತಳಿಗಳು"],
      economicImpact: "ಕಾಳು ತುಂಬುವಿಕೆಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ.",
      optimalConditions: "ತಂಪಾದ ತಾಪಮಾನ"
    }
  },
  "Tomato___Early_Blight": {
    en: {
      name: "Early Blight",
      symptoms: ["Bullseye patterns on lower leaves", "Yellowing halo", "Stem lesions"],
      treatment: ["Spray Chlorothalonil", "Pruning bottom leaves"],
      prevention: ["Mulching", "No overhead watering"],
      economicImpact: "Total leaf loss possible.",
      optimalConditions: "Heavy rains"
    },
    kn: {
      name: "ಆರಂಭಿಕ ಬ್ಲೈಟ್ (Early Blight)",
      symptoms: ["ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ವೃತ್ತಾಕಾರದ ಕಲೆಗಳು", "ಹಳದಿ ವಲಯ", "ಕಾಂಡದ ಗಾಯಗಳು"],
      treatment: ["ಕ್ಲೋರೋಥಲೋನಿಲ್ ಸಿಂಪಡಿಸಿ", "ಕೆಳಗಿನ ಎಲೆಗಳ ಕತ್ತರಿಸುವಿಕೆ"],
      prevention: ["ಹೊದಿಕೆ (Mulching)", "ಮೇಲಿನಿಂದ ನೀರುಣಿಸಬೇಡಿ"],
      economicImpact: "ಸಂಪೂರ್ಣ ಎಲೆ ನಷ್ಟ ಸಾಧ್ಯ.",
      optimalConditions: "ಭಾರಿ ಮಳೆ"
    }
  },
  "Tomato___Late_Blight": {
    en: {
      name: "Late Blight",
      symptoms: ["Dark water-soaked spots", "White fuzzy growth under leaves", "Rapid rot"],
      treatment: ["Apply Copper oxychloride", "Immediate destruction of infected plants"],
      prevention: ["Crop rotation", "Certified seeds"],
      economicImpact: "Destroys whole fields in days.",
      optimalConditions: "Cool and damp"
    },
    kn: {
      name: "ಲೇಟ್ ಬ್ಲೈಟ್ (Late Blight)",
      symptoms: ["ಗಾಢ ಬಣ್ಣದ ನೀರಿನಿಂದ ಕೂಡಿದ ಕಲೆಗಳು", "ಎಲೆಗಳ ಅಡಿಯಲ್ಲಿ ಬಿಳಿ ಶಿಲೀಂಧ್ರ", "ಕ್ಷಿಪ್ರ ಕೊಳೆಯುವಿಕೆ"],
      treatment: ["ಕಾಪರ್ ಆಕ್ಸಿಕ್ಲೋರೈಡ್ ಬಳಸಿ", "ಸೋಂಕಿತ ಸಸ್ಯಗಳ ತಕ್ಷಣದ ನಾಶ"],
      prevention: ["ಬೆಳೆ ಪರಿವರ್ತನೆ", "ದೃಢೀಕೃತ ಬೀಜಗಳು"],
      economicImpact: "ಕೆಲವೇ ದಿನಗಳಲ್ಲಿ ಇಡೀ ಹೊಲವನ್ನು ನಾಶಪಡಿಸುತ್ತದೆ.",
      optimalConditions: "ತಂಪಾದ ಮತ್ತು ತೇವದ ವಾತಾವರಣ"
    }
  },
  "Sugarcane___Red_Rot": {
    en: {
      name: "Red Rot",
      symptoms: ["Red internal pith with white cross bands", "Drooping leaves", "Alcoholic smell"],
      treatment: ["Carbendazim sett treatment", "Long-term rotation"],
      prevention: ["Healthy setts", "Water drainage"],
      economicImpact: "Catastrophic sugar yield loss.",
      optimalConditions: "Waterlogged soil"
    },
    kn: {
      name: "ಕೆಂಪು ಕೊಳೆ ರೋಗ (Red Rot)",
      symptoms: ["ಒಳಭಾಗದಲ್ಲಿ ಬಿಳಿ ಪಟ್ಟಿಗಳೊಂದಿಗೆ ಕೆಂಪು ಬಣ್ಣ", "ಎಲೆಗಳು ಸುರುಳಿ ಸುತ್ತುವುದು", "ಮದ್ಯದ ವಾಸನೆ"],
      treatment: ["ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಸಂಸ್ಕರಣೆ", "ದೀರ್ಘಕಾಲದ ಬೆಳೆ ಪರಿವರ್ತನೆ"],
      prevention: ["ಆರೋಗ್ಯಕರ ಬೀಜಗಳು", "ನೀರು ಹೊರಹೋಗುವ ವ್ಯವಸ್ಥೆ"],
      economicImpact: "ಸಕ್ಕರೆ ಇಳುವರಿಯಲ್ಲಿ ಭಾರಿ ನಷ್ಟ.",
      optimalConditions: "ನೀರು ನಿಂತಿರುವ ಮಣ್ಣು"
    }
  }
};
