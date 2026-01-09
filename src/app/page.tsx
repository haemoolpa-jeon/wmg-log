'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { storage, Review, FlavorWithStrength } from '@/lib/storage'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { getCountryFlag } from '@/lib/countries'
import { PenLine, Trash2, Wine, Globe } from 'lucide-react'

const ui = {
  appName: { ko: 'Whisky Review', en: 'Whisky Review' },
  newReview: { ko: '새 리뷰', en: 'New' },
  noReviews: { ko: '아직 작성한 리뷰가 없습니다', en: 'No reviews yet' },
  firstReview: { ko: '첫 리뷰 작성하기', en: 'Write your first review' },
  reviews: { ko: '개의 리뷰', en: ' reviews' },
  deleteConfirm: { ko: '삭제하시겠습니까?', en: 'Delete this review?' },
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [lang, setLang] = useState<Lang>('ko')

  useEffect(() => {
    setReviews(storage.getReviews())
    const saved = localStorage.getItem('wmg-lang') as Lang
    if (saved) setLang(saved)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'ko' ? 'en' : 'ko'
    setLang(newLang)
    localStorage.setItem('wmg-lang', newLang)
  }

  const handleDelete = (id: string) => {
    if (confirm(ui.deleteConfirm[lang])) {
      storage.deleteReview(id)
      setReviews(storage.getReviews())
    }
  }

  const getAllFlavors = (review: Review): FlavorWithStrength[] => {
    // Handle both old (string[]) and new (FlavorWithStrength[]) formats
    const nose = review.flavors?.nose || []
    const palate = review.flavors?.palate || []
    const finish = review.flavors?.finish || []
    
    const all = [...nose, ...palate, ...finish]
    
    // If old format (strings), convert
    if (all.length > 0 && typeof all[0] === 'string') {
      return (all as unknown as string[]).map(id => ({ id, strength: 3 }))
    }
    
    // Remove duplicates by id
    const seen = new Set<string>()
    return (all as FlavorWithStrength[]).filter(f => {
      if (seen.has(f.id)) return false
      seen.add(f.id)
      return true
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-xl text-amber-600">{ui.appName[lang]}</span>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 text-gray-500 hover:text-gray-700">
              <Globe size={18} />
            </button>
            <Link
              href="/review/new"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
            >
              <PenLine size={14} /> {ui.newReview[lang]}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <Wine size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">{ui.noReviews[lang]}</p>
            <Link
              href="/review/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700"
            >
              <PenLine size={18} /> {ui.firstReview[lang]}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">{reviews.length}{ui.reviews[lang]}</p>
            {reviews.map(review => {
              const total = review.scores.nose + review.scores.palate + review.scores.finish + review.scores.balance
              const colorInfo = whiskyColors.find(c => c.value === review.whisky.color)
              const allFlavors = getAllFlavors(review)
              
              return (
                <div key={review.id} className="bg-white rounded-xl border p-3">
                  <div className="flex gap-3">
                    {colorInfo && (
                      <div
                        className="w-8 h-10 rounded border flex-shrink-0"
                        style={{ backgroundColor: colorInfo.hex }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">
                            {review.whisky.country && <span className="mr-1">{getCountryFlag(review.whisky.country)}</span>}
                            {review.whisky.name}
                          </h3>
                          <p className="text-xs text-gray-500">{review.whisky.distillery}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-xl font-bold text-amber-600">{total}</div>
                        </div>
                      </div>

                      {allFlavors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {allFlavors.slice(0, 4).map(f => (
                            <span key={f.id} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px]">
                              {getTagName(f.id, lang)}
                            </span>
                          ))}
                          {allFlavors.length > 4 && (
                            <span className="text-[10px] text-gray-400">+{allFlavors.length - 4}</span>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                        <span>{new Date(review.createdAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</span>
                        <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
