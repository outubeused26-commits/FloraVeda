
export interface CareInstructions {
  water: string;
  sunlight: string;
  temperature: string;
  soil: string;
  fertilizer: string;
  pruning?: string;
}

export interface VastuDetails {
  bestDirections: string[];
  avoidDirections: string[];
  energyType: string;
  placementReason: string;
}

export interface HealthAssessment {
  status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'SICK';
  issues: string[];
  remedy: string; // Brief summary
  detailedDiagnosis: string; // Deeper explanation
  actionableSteps: string[]; // Step-by-step cure/maintenance
  potentialPests: string[]; // List of specific pests if applicable
  confidence: number;
}

export interface PlantInfo {
  isMatch: boolean;
  verificationMessage: string;
  commonName: string;
  scientificName: string;
  shortDescription: string;
  careInstructions: CareInstructions;
  funFact: string;
  toxicity: string;
  vastuTips: string; // Keep for backward compatibility/summary
  vastuDetails: VastuDetails;
  stepByStepGuide: string[];
  healthAssessment: HealthAssessment;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
  isError?: boolean;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
