export interface Project {
  id: string;
  name: string;
  region: string;
  dialect: string;
  totalTasks: number;
  completedTasks: number;
  status: 'active' | 'paused' | 'completed';
  coverImage: string;
}

export interface VillageTask {
  id: string;
  villageName: string;
  region: string;
  dialect: string;
  status: 'unclaimed' | 'in_progress' | 'completed' | 'reviewing';
  totalEntries: number;
  completedEntries: number;
  assignee?: string;
  deadline: string;
}

export interface RecordingSession {
  id: string;
  villageName: string;
  speakerName: string;
  speakerAge: number;
  speakerGender: 'male' | 'female';
  date: string;
  duration: number;
  status: 'draft' | 'recording' | 'paused' | 'completed' | 'reviewing';
  entries: number;
  hasConsent: boolean;
  noiseLevel?: 'low' | 'medium' | 'high';
}

export interface DictEntry {
  id: string;
  chinese: string;
  phonetic: string;
  definition: string;
  exampleSentence: string;
  synonyms: string[];
  usageScenario: string;
  dialect: string;
  region: string;
  speakerName: string;
  audioUrl: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  tags: string[];
}

export interface Speaker {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  birthplace: string;
  dialect: string;
  latitude: number;
  longitude: number;
  recordingCount: number;
  avatar: string;
}

export interface ReviewItem {
  id: string;
  entryId: string;
  chinese: string;
  phonetic: string;
  transcription: string;
  audioUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
  reviewer?: string;
  feedback?: string;
  createdAt: string;
}

export interface LearningTopic {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  sampleCount: number;
  category: string;
}

export interface LearningSample {
  id: string;
  topicId: string;
  chinese: string;
  phonetic: string;
  audioUrl: string;
  dialect: string;
  region: string;
}

export interface UserStats {
  totalRecordings: number;
  totalEntries: number;
  totalDuration: number;
  totalReviews: number;
  offlinePackages: number;
  pendingUploads: number;
  contributionRank: number;
}

export interface UploadItem {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
}

export interface OfflinePackage {
  id: string;
  name: string;
  size: string;
  dialect: string;
  downloadDate: string;
  entryCount: number;
}
