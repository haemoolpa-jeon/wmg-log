'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { storage, Review, FlavorWithStrength } from '@/lib/storage'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { getCountryFlag, getCountryName } from '@/lib/countries'
import { PenLine, Trash2, Wine, Globe, Search, X } from 'lucide-react'

const ui = {
  appName: { ko: 'Whisky Review', en: 'Whisky Review' },
  newReview: { ko: '새 리뷰', en: 'New' },
  noReviews: { ko: '아직 작성한 리뷰가 없습니다', en: 'No reviews yet' },
  firstReview: { ko: '첫 리뷰 작성하기', en: 'Write your first review' },
  reviews: { ko: '개의 리뷰', en: ' reviews' },
  deleteConfirm: { ko: '삭제하시겠습니까?', en: 'Delete this review?' },
  search: { ko: '검색...', en: 'Search...' },
  sortBy: { ko: '정렬', en: 'Sort' },
  newest: { ko: '최신순', en: 'Newest' },
  oldest: { ko: '오래된순', en: 'Oldest' },
  highScore: { ko: '높은점수', en: 'High Score' },
  lowScore: { ko: '낮은점수', en: 'Low Score' },
  all: { ko: '전체', en: 'All' },
}

type SortOption = 'newest' | 'oldest' | 'highScore' | 'lowScore'

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [lang, setLang] = useState<Lang>('ko')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [countryFilter, setCountryFilter] = useState('')

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
    const all = [...(review.flavors?.nose || []), ...(review.flavors?.palate || []), ...(review.flavors?.finish || [])]
    if (all.length > 0 && typeof all[0] === 'string') {
      return (all as unknown as string[]).map(id => ({ id, strength: 3 }))
    }
    const seen = new Set<string>()
    return (all as FlavorWithStrength[]).filter(f => { if (seen.has(f.id)) return false; seen.add(f.id); return true })
  }

  const countries = useMemo(() => {
    const set = new Set<string>()
    reviews.forEach(r => { if (r.whisky.country) set.add(r.whisky.country) })
    return Array.from(set)
  }, [reviews])

  const filtered = useMemo(() => {
    let result = [...reviews]
    
    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r => 
        r.whisky.name.toLowerCase().includes(q) ||
        r.whisky.distillery.toLowerCase().includes(q) ||
        r.notes.nose.toLowerCase().includes(q) ||
        r.notes.palate.toLowerCase().includes(q) ||
        r.notes.finish.toLowerCase().includes(q)
      )
    }
    
    // Country filter
    if (countryFilter) {
      result = result.filter(r => r.whisky.country === countryFilter)
    }
    
    // Sort
    result.sort((a, b) => {
      const scoreA = a.scores.nose + a.scores.palate + a.scores.finish + a.scores.balance
      const scoreB = b.scores.nose + b.scores.palate + b.scores.finish + b.scores.balance
      switch (sort) {
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'highScore': return scoreB - scoreA
        case 'lowScore': return scoreA - scoreB
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    
    return result
  }, [reviews, search, sort, countryFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-xl text-amber-600">{ui.appName[lang]}</span>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 text-gray-500 hover:text-gray-700">
              <Globe size={18} />
            </button>
            <Link href="/review/new" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">
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
            <Link href="/review/new" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
              <PenLine size={18} /> {ui.firstReview[lang]}
            </Link>
          </div>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={ui.search[lang]} value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                  className="px-3 py-1.5 text-sm border rounded-lg bg-white">
                  <option value="newest">{ui.newest[lang]}</option>
                  <option value="oldest">{ui.oldest[lang]}</option>
                  <option value="highScore">{ui.highScore[lang]}</option>
                  <option value="lowScore">{ui.lowScore[lang]}</option>
                </select>
                {countries.length > 1 && (
                  <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)}
                    className="px-3 py-1.5 text-sm border rounded-lg bg-white">
                    <option value="">{ui.all[lang]}</option>
                    {countries.map(c => <option key={c} value={c}>{getCountryFlag(c)} {getCountryName(c, lang)}</option>)}
                  </select>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">{filtered.length}{ui.reviews[lang]}</p>
            <div className="space-y-3">
              {filtered.map(review => {
                const total = review.scores.nose + review.scores.palate + review.scores.finish + review.scores.balance
                const colorInfo = whiskyColors.find(c => c.value === review.whisky.color)
                const allFlavors = getAllFlavors(review)
                
                return (
                  <Link href={`/review/${review.id}`} key={review.id} className="block bg-white rounded-xl border p-3 hover:border-amber-300 transition-colors">
                    <div className="flex gap-3">
                      {colorInfo && <div className="w-8 h-10 rounded border flex-shrink-0" style={{ backgroundColor: colorInfo.hex }} />}
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
                              <span key={f.id} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px]">{getTagName(f.id, lang)}</span>
                            ))}
                            {allFlavors.length > 4 && <span className="text-[10px] text-gray-400">+{allFlavors.length - 4}</span>}
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                          <span>{new Date(review.createdAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</span>
                          <button onClick={(e) => { e.preventDefault(); handleDelete(review.id) }} className="text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
