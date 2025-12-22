export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      whiskies: {
        Row: {
          id: string
          name: string
          name_kr: string | null
          distillery: string | null
          region: string | null
          country: string
          type: string | null
          abv: number | null
          age: number | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_kr?: string | null
          distillery?: string | null
          region?: string | null
          country?: string
          type?: string | null
          abv?: number | null
          age?: number | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_kr?: string | null
          distillery?: string | null
          region?: string | null
          country?: string
          type?: string | null
          abv?: number | null
          age?: number | null
          image_url?: string | null
          created_at?: string
        }
      }
      flavor_tags: {
        Row: {
          id: string
          name: string
          name_kr: string
          category: string
          color: string | null
        }
        Insert: {
          id?: string
          name: string
          name_kr: string
          category: string
          color?: string | null
        }
        Update: {
          id?: string
          name?: string
          name_kr?: string
          category?: string
          color?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          whisky_id: string
          rating: number | null
          nose: string | null
          palate: string | null
          finish: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          whisky_id: string
          rating?: number | null
          nose?: string | null
          palate?: string | null
          finish?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          whisky_id?: string
          rating?: number | null
          nose?: string | null
          palate?: string | null
          finish?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      review_flavors: {
        Row: {
          review_id: string
          flavor_tag_id: string
          intensity: number
        }
        Insert: {
          review_id: string
          flavor_tag_id: string
          intensity?: number
        }
        Update: {
          review_id?: string
          flavor_tag_id?: string
          intensity?: number
        }
      }
      cellar: {
        Row: {
          id: string
          user_id: string
          whisky_id: string
          status: 'owned' | 'wishlist' | 'finished'
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          whisky_id: string
          status?: 'owned' | 'wishlist' | 'finished'
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          whisky_id?: string
          status?: 'owned' | 'wishlist' | 'finished'
          added_at?: string
        }
      }
    }
  }
}
