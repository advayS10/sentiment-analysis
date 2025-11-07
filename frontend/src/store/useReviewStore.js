import { create } from "zustand"

export const useReviewStore = create((set) => ({
  reviews: [],
  setReviews: (data) => set({ reviews: data }),
  clearReviews: () => set({ reviews: [] }),
}))
