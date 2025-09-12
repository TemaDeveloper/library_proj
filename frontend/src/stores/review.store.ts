import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ReviewState {
  submittedReviews: Record<string, boolean>;
  markReviewSubmitted: (bookId: number) => void;
  hasSubmittedReview: (bookId: number) => boolean;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      submittedReviews: {},
      markReviewSubmitted: (bookId: number) =>
        set((state) => ({
          submittedReviews: {
            ...state.submittedReviews,
            [bookId]: true,
          },
        })),
      hasSubmittedReview: (bookId: number) => {
        return !!get().submittedReviews[bookId];
      },
    }),
    {
      name: 'review-storage',
    }
  )
);
