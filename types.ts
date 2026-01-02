
export interface NewsVersion {
  newspaper: string;
  headline: string;
  subHeadline: string;
  body: string;
  epigraph: string;
  imageUrl?: string;
}

export interface EducationalAnalysis {
  voiceUsage: string;
  lexicalComparison: string;
  intentionality: string;
}

export interface AnalysisResponse {
  baseFact: string;
  sensationalist: NewsVersion;
  officialist: NewsVersion;
  oppositional: NewsVersion;
  educationalAnalysis: EducationalAnalysis;
}

export type AppStatus = 'idle' | 'loading' | 'success' | 'error';
