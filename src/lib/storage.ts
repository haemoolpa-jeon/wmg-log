export type FlavorWithStrength = {
  id: string
  strength: number // 1-5
}

export type Review = {
  id: string
  createdAt: string
  whisky: {
    name: string
    distillery: string
    country?: string
    age?: string
    abv?: string
    color?: number
  }
  scores: { nose: number; palate: number; finish: number; balance: number }
  notes: { nose: string; palate: string; finish: string }
  flavors: { 
    nose: FlavorWithStrength[]
    palate: FlavorWithStrength[]
    finish: FlavorWithStrength[]
  }
}

const STORAGE_KEY = 'wmg-reviews'

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
    return newReview
  },

  deleteReview: (id: string) => {
    const reviews = storage.getReviews().filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  },
}
