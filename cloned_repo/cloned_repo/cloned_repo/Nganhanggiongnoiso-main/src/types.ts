/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'researcher';
  region?: string;
  createdAt: string;
}

export interface AudioSample {
  id: string;
  title: string;
  region: 'Huế' | 'Nam Bộ' | 'Bắc Bộ' | 'Quảng Nam' | 'Nghệ Tĩnh' | string;
  province: string;
  speakerAgeGroup: 'Dưới 18' | '18-30' | '31-50' | 'Trên 50' | string;
  speakerGender: 'Nam' | 'Nữ' | string;
  speakerName?: string;
  topic: string;
  audioUrl: string; // fallback or synthesised paths
  duration: string; // e.g. "00:14", "00:11"
  transcriptAi: string;
  transcriptVerified: string;
  standardVietnameseTranslation: string;
  dialectWords: string[]; // words like ['mô', 'răng', 'rứa']
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  likes: number;
  plays: number;
  createdAt: string;
  audioQuality?: {
    volume: 'Tốt' | 'Thấp' | 'Quá lớn';
    noise: 'Thấp' | 'Trung bình' | 'Ồn';
    duration: number; // in seconds
    score: number; // Quality percentage e.g. 95
  };
}

export interface DialectWord {
  id: string;
  word: string;
  region: 'Huế' | 'Nam Bộ' | 'Bắc Bộ' | 'Quảng Nam' | 'Nghệ Tĩnh' | string;
  meaning: string;
  exampleSentence: string;
  standardTranslation: string;
  audioExampleUrl?: string;
  culturalNote: string;
  popularityScore: number;
}

export interface Contribution {
  id: string;
  title: string;
  region: string;
  province: string;
  ageGroup: string;
  gender: string;
  topic: string;
  rawText?: string;
  consentGiven: boolean;
  audioUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review';
  createdAt: string;
  aiFeedback?: {
    predictedRegion: string;
    transcriptDraft: string;
    wordsFound: string[];
    audioQuality: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  referenceAudioId?: string;
  wordReference?: string;
}

export interface MapRegion {
  id: string;
  regionName: string;
  provinces: string[];
  sampleCount: number;
  wordCount: number;
  commonWords: string[];
  culturalTags: string[];
  coordinates: { x: number; y: number }; // Percentage coordinate on our interactive visual SVG
  stats: {
    maleCount: number;
    femaleCount: number;
    under18: number;
    from18to30: number;
    from31to50: number;
    above50: number;
  };
}

export interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  contributions: number;
  badges: string[];
  avatarUrl: string;
}
