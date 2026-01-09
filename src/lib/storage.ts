export type FlavorWithStrength = {
  id: string
  strength: number // 1-5
}

export type BottlingType = 'official' | 'ib' | 'single_cask'

export type Review = {
  id: string
  createdAt: string
  reviewer?: string
  whisky: {
    name: string
    distillery: string
    country?: string
    age?: string
    abv?: string
    cask?: string
    color?: number
    // New optional fields
    bottlingType?: BottlingType
    bottleNumber?: string // e.g., "234/500"
    price?: string
    purchaseDate?: string
    openingDate?: string
  }
  scores: { nose: number; palate: number; finish: number; balance: number }
  notes: { nose: string; palate: string; finish: string; overall?: string }
  flavors: { 
    nose: FlavorWithStrength[]
    palate: FlavorWithStrength[]
    finish: FlavorWithStrength[]
  }
  wouldRebuy?: 'yes' | 'no' | 'maybe'
}

const STORAGE_KEY = 'wmg-reviews'
const DRAFT_KEY = 'wmg-draft'

export const storage = {
  getReviews: (): Review[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveReview: (review: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = storage.getReviews()
    const newReview: Review = {
      ...review,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    reviews.unshift(newReview)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    if (review.reviewer) localStorage.setItem('wmg-reviewer', review.reviewer)
    storage.clearDraft() // Clear draft after save
    return newReview
  },

  deleteReview: (id: string) => {
    const reviews = storage.getReviews().filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  },

  updateReview: (id: string, data: Omit<Review, 'id' | 'createdAt'>): Review | null => {
    const reviews = storage.getReviews()
    const index = reviews.findIndex(r => r.id === id)
    if (index === -1) return null
    const updated: Review = { ...data, id, createdAt: reviews[index].createdAt }
    reviews[index] = updated
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    return updated
  },

  getReview: (id: string): Review | null => {
    return storage.getReviews().find(r => r.id === id) || null
  },

  // Draft functions
  saveDraft: (draft: Partial<Omit<Review, 'id' | 'createdAt'>>) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  },

  getDraft: (): Partial<Omit<Review, 'id' | 'createdAt'>> | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(DRAFT_KEY)
    return data ? JSON.parse(data) : null
  },

  clearDraft: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(DRAFT_KEY)
  },

  // Export/Import
  exportAll: (): string => JSON.stringify(storage.getReviews(), null, 2),

  importAll: (json: string): number => {
    const reviews = JSON.parse(json) as Review[]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    return reviews.length
  },
}

// Share link encoding (compress review data into URL)
export const encodeReview = (review: Omit<Review, 'id' | 'createdAt'>): string => {
  return btoa(encodeURIComponent(JSON.stringify(review)))
}

export const decodeReview = (encoded: string): Omit<Review, 'id' | 'createdAt'> | null => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}
