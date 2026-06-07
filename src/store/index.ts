import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RecordingSession, DictEntry, ReviewItem, QuizRecord, OfflinePackage } from '@/types';
import { mockRecordingSessions, mockEntries, mockReviewItems, mockOfflinePackages } from '@/data/mockData';

interface AppState {
  recordings: RecordingSession[];
  entries: DictEntry[];
  reviews: ReviewItem[];
  quizRecords: QuizRecord[];
  offlinePackages: OfflinePackage[];
  activeRecordingId: string | null;

  addRecording: (session: RecordingSession) => void;
  updateRecording: (id: string, updates: Partial<RecordingSession>) => void;
  setActiveRecordingId: (id: string | null) => void;

  addEntry: (entry: DictEntry) => void;
  updateEntry: (id: string, updates: Partial<DictEntry>) => void;

  approveReview: (id: string) => void;
  rejectReview: (id: string, feedback: string) => void;
  editReviewTranscription: (id: string, newTranscription: string) => void;
  markReviewResolved: (id: string) => void;

  addQuizRecord: (record: QuizRecord) => void;

  linkEntryToSession: (sessionId: string, entryId: string) => void;

  deleteOfflinePackage: (id: string) => void;
  updateOfflinePackage: (id: string) => void;
  importData: (data: {
    recordings?: RecordingSession[];
    entries?: DictEntry[];
    reviews?: ReviewItem[];
    quizRecords?: QuizRecord[];
  }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      recordings: [...mockRecordingSessions],
      entries: [...mockEntries],
      reviews: mockReviewItems.map(r => ({
        ...r,
        previousTranscription: undefined as string | undefined,
        resolved: false,
      })),
      quizRecords: [],
      offlinePackages: [...mockOfflinePackages],
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

      markReviewResolved: (id) => set((state) => ({
        reviews: state.reviews.map(r =>
          r.id === id ? { ...r, resolved: true } : r
        ),
      })),

      addQuizRecord: (record) => set((state) => ({
        quizRecords: [record, ...state.quizRecords],
      })),

      linkEntryToSession: (sessionId, entryId) => set((state) => ({
        recordings: state.recordings.map(r =>
          r.id === sessionId ? { ...r, entries: r.entries + 1 } : r
        ),
        entries: state.entries.map(e =>
          e.id === entryId ? { ...e, sessionId } : e
        ),
      })),

      deleteOfflinePackage: (id) => set((state) => ({
        offlinePackages: state.offlinePackages.filter(p => p.id !== id),
      })),

      updateOfflinePackage: (id) => set((state) => ({
        offlinePackages: state.offlinePackages.map(p =>
          p.id === id ? { ...p, lastUpdated: new Date().toISOString().split('T')[0] } : p
        ),
      })),

      importData: (data) => set((state) => {
        const existingRecIds = new Set(state.recordings.map(r => r.id));
        const existingEntryIds = new Set(state.entries.map(e => e.id));
        const existingReviewIds = new Set(state.reviews.map(r => r.id));
        const existingQuizIds = new Set(state.quizRecords.map(q => q.id));

        const newRecordings = (data.recordings || []).filter(r => !existingRecIds.has(r.id));
        const newEntries = (data.entries || []).filter(e => !existingEntryIds.has(e.id));
        const newReviews = (data.reviews || []).filter(r => !existingReviewIds.has(r.id));
        const newQuizRecords = (data.quizRecords || []).filter(q => !existingQuizIds.has(q.id));

        return {
          recordings: [...newRecordings, ...state.recordings],
          entries: [...newEntries, ...state.entries],
          reviews: [...newReviews, ...state.reviews],
          quizRecords: [...newQuizRecords, ...state.quizRecords],
        };
      }),
    }),
    {
      name: 'dialect-recorder-store',
      partialize: (state) => ({
        recordings: state.recordings,
        entries: state.entries,
        reviews: state.reviews,
        quizRecords: state.quizRecords,
        offlinePackages: state.offlinePackages,
      }),
    }
  )
);
