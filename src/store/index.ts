import { create } from 'zustand';
import type { RecordingSession, DictEntry, ReviewItem, QuizRecord } from '@/types';
import { mockRecordingSessions, mockEntries, mockReviewItems } from '@/data/mockData';

interface AppState {
  recordings: RecordingSession[];
  entries: DictEntry[];
  reviews: ReviewItem[];
  quizRecords: QuizRecord[];
  activeRecordingId: string | null;

  addRecording: (session: RecordingSession) => void;
  updateRecording: (id: string, updates: Partial<RecordingSession>) => void;
  setActiveRecordingId: (id: string | null) => void;

  addEntry: (entry: DictEntry) => void;
  updateEntry: (id: string, updates: Partial<DictEntry>) => void;

  approveReview: (id: string) => void;
  rejectReview: (id: string, feedback: string) => void;
  editReviewTranscription: (id: string, newTranscription: string) => void;

  addQuizRecord: (record: QuizRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  recordings: [...mockRecordingSessions],
  entries: [...mockEntries],
  reviews: mockReviewItems.map(r => ({
    ...r,
    previousTranscription: undefined as string | undefined,
  })),
  quizRecords: [],
  activeRecordingId: null,

  addRecording: (session) => set((state) => ({
    recordings: [session, ...state.recordings],
  })),

  updateRecording: (id, updates) => set((state) => ({
    recordings: state.recordings.map(r =>
      r.id === id ? { ...r, ...updates } : r
    ),
  })),

  setActiveRecordingId: (id) => set({ activeRecordingId: id }),

  addEntry: (entry) => set((state) => ({
    entries: [entry, ...state.entries],
  })),

  updateEntry: (id, updates) => set((state) => ({
    entries: state.entries.map(e =>
      e.id === id ? { ...e, ...updates } : e
    ),
  })),

  approveReview: (id) => set((state) => ({
    reviews: state.reviews.map(r =>
      r.id === id ? { ...r, status: 'approved' as const, version: r.version + 1, reviewer: '当前审核员' } : r
    ),
  })),

  rejectReview: (id, feedback) => set((state) => ({
    reviews: state.reviews.map(r =>
      r.id === id ? { ...r, status: 'rejected' as const, feedback, reviewer: '当前审核员' } : r
    ),
  })),

  editReviewTranscription: (id, newTranscription) => set((state) => ({
    reviews: state.reviews.map(r =>
      r.id === id
        ? {
            ...r,
            previousTranscription: r.transcription,
            transcription: newTranscription,
            version: r.version + 1,
          }
        : r
    ),
  })),

  addQuizRecord: (record) => set((state) => ({
    quizRecords: [record, ...state.quizRecords],
  })),
}));
