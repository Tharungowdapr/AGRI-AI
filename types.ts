export interface UserPreferences {
  language: string;
  cluster: string;
  notifications: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  audio?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
}

export interface FeedbackEntry {
  id: string;
  userId: string;
  userName: string;
  type: 'diagnosis' | 'chat';
  rating: number;
  comment: string;
  timestamp: number;
  context?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin'; // Added role
  password?: string;
  photoURL: string;
  preferences: UserPreferences;
  history: AnalysisRecord[];
  chatHistory?: ChatSession[];
}

export interface CropStage {
  stage: string;
  days: string;
  temp: string;
  waterLevel: string;
  nutrientNeeds: string;
  keyTasks: string;
  majorDiseases: string[];
  yieldImpact: string;
  economicLoss: string;
  investment: string;
  completed?: boolean;
}

export interface MarketPricePoint {
  month: string;
  price: number;
}

export interface DiseaseMatrixRow {
  disease: string;
  seedling: 'low' | 'moderate' | 'high';
  tillering: 'low' | 'moderate' | 'high';
  panicle: 'low' | 'moderate' | 'high';
  ripening: 'low' | 'moderate' | 'high';
}

export interface OptimalYield {
  temperature: string;
  soil: string;
  sunlight: string;
  spacing: string;
  water: string;
  fertilizer: string;
  potential: string;
  avgYield: string;
}

export interface ExtensionResource {
  name: string;
  url: string;
}

export interface CropData {
  id: string;
  name: string;
  scientificName: string;
  duration: string;
  season: string;
  stages: CropStage[];
  market: {
    msp: string;
    variation: string;
    peakHarvest: string;
    currentPrice: string;
    forecastPrice: string;
    prices: MarketPricePoint[];
    estimatedInvestment?: string;
    estimatedProfit?: string;
  };
  description: string;
  optimalYield: OptimalYield;
  resources: ExtensionResource[];
  diseaseMatrix: DiseaseMatrixRow[];
}

export interface DiseaseInfo {
  name: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  economicImpact: string;
  optimalConditions: string;
}

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  imageUrl: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  details: DiseaseInfo;
}

export interface CropLog {
  id: string;
  date: string;
  stage: string;
  observations: string;
  photoUrl?: string;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface UserCropProfile {
  id: string;
  userId: string;
  cropType: string;
  variety: string;
  plantingDate: string;
  acreage: string;
  soilType: string;
  location: string;
  season: string;
  soilHealth?: {
    ph: number;
    nitrogen: 'Low' | 'Medium' | 'High';
    phosphorus: 'Low' | 'Medium' | 'High';
    potassium: 'Low' | 'Medium' | 'High';
  };
  logs: CropLog[];
  growthPlan?: {
    stages: {
      name: string;
      timeframe: string;
      tasks: string[];
      recommendations: {
        watering: string;
        fertilization: string;
        diseaseCheck: string;
      };
      completed: boolean;
    }[];
  };
}