export interface GenerationConfig {
  photoType: 'keluarga' | 'personal' | 'profesional' | 'anak-anak';
  poseStyle: string;
  customPoseStyle?: string;
  backgroundStyle: string;
  customBackgroundStyle?: string;
  extraInstructions: string;
  ageCategory?: string;
  gender?: 'perempuan' | 'laki-laki' | 'campuran';
  clothingMaterial?: string;
  ethnicity?: string;
  aspectRatio: 'portrait' | 'square' | 'landscape' | 'story';
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}

export interface ResultItem {
  id: number;
  status: 'empty' | 'generating' | 'completed' | 'error' | 'upscaling';
  data?: GeneratedImage;
  errorMessage?: string;
  upscaledImageUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  config: GenerationConfig;
  prompt: string;
}

export interface SourceImages {
  main: File | null;
  reference: File | null;
}