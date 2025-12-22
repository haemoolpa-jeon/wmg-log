'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FlavorSelector } from '@/components/FlavorSelector'
import { ChevronLeft, Search } from 'lucide-react'
import Link from 'next/link'

type Whisky = { id: string; name: string; name_kr: string | null; distillery: string | null }
type FlavorTag = { id: string; name: string; name_kr: string; category: string; color: string }

const scoreCategories = [
  { key: 'nose', label: 'Nose', label_kr: '향 (노즈)' },
  { key: 'palate', label: 'Palate', label_kr: '맛 (팔레트)' },
  { key: 'finish', label: 'Finish', label_kr: '피니시' },
  { key: 'balance', label: 'Balance', label_kr: '밸런스' },
]

export default function NewReviewPage() {
  const [whiskySearch, setWhiskySearch] = useState('')
  const [whiskies, setWhiskies] = useState<Whisky[]>([])
  const [selectedWhisky, setSelectedWhisky] = useState<Whisky | null>(null)
  const [scores, setScores] = useState({ nose: 20, palate: 20, finish: 20, balance: 20 })
  const [notes, setNotes] = useState({ nose: '', palate: '', finish: '' })
  const [flavorTags, setFlavorTags] = useState<FlavorTag[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const supabase = createClient()
  const totalScore = scores.nose + scores.palate + scores.finish + scores.balance

  useEffect(() => {
    supabase.from('flavor_tags').select('*').then(({ data }) => {
      if (data) setFlavorTags(data)
    })
  }, [])

  useEffect(() => {
    if (whiskySearch.length < 2) return setWhiskies([])
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('whiskies')
        .select('id, name, name_kr, distillery')
        .or(`name.ilike.%${whiskySearch}%,name_kr.ilike.%${whiskySearch}%`)
        .limit(5)
      setWhiskies(data || [])
    }, 300)
    return () => clearTimeout(timer)
  }, [whiskySearch])

  const handleSubmit = async () => {
    if (!selectedWhisky) return alert('위스키를 선택해주세요')
    setSaving(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('로그인이 필요합니다')

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        whisky_id: selectedWhisky.id,
        rating: totalScore / 20,
        nose: notes.nose,
        palate: notes.palate,
        finish: notes.finish,
      })
      .select()
      .single()

    if (error || !review) {
      setSaving(false)
      return alert('저장 실패: ' + error?.message)
    }

    if (selectedFlavors.length > 0) {
      await supabase.from('review_flavors').insert(
        selectedFlavors.map(fid => ({ review_id: review.id, flavor_tag_id: fid }))
      )
    }

    alert('리뷰가 저장되었습니다!')
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="lg:hidden p-2 -ml-2">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">리뷰 작성</h1>
      </div>

      {/* Whisky Search */}
      <section className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">위스키 선택</label>
        {selectedWhisky ? (
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div>
              <p className="font-semibold">{selectedWhisky.name}</p>
              {selectedWhisky.distillery && (
                <p className="text-sm text-gray-500">{selectedWhisky.distillery}</p>
              )}
            </div>
            <button onClick={() => setSelectedWhisky(null)} className="text-sm text-amber-600">
              변경
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={whiskySearch}
              onChange={e => setWhiskySearch(e.target.value)}
              placeholder="위스키 이름으로 검색..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {whiskies.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                {whiskies.map(w => (
                  <li
                    key={w.id}
                    onClick={() => { setSelectedWhisky(w); setWhiskySearch(''); setWhiskies([]) }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <p className="font-medium">{w.name}</p>
                    {w.distillery && <p className="text-sm text-gray-500">{w.distillery}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* 4x25 Scoring */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-700">점수 (4×25 시스템)</label>
          <span className="text-2xl font-bold text-amber-600">{totalScore}/100</span>
        </div>
        <div className="space-y-4">
          {scoreCategories.map(cat => (
            <div key={cat.key} className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{cat.label_kr}</span>
                <span className="text-amber-600 font-semibold">
                  {scores[cat.key as keyof typeof scores]}/25
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={scores[cat.key as keyof typeof scores]}
                onChange={e => setScores(s => ({ ...s, [cat.key]: +e.target.value }))}
                className="w-full accent-amber-600"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tasting Notes */}
      <section className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">테이스팅 노트</label>
        <div className="space-y-4">
          {(['nose', 'palate', 'finish'] as const).map(key => (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">
                {scoreCategories.find(c => c.key === key)?.label_kr}
              </label>
              <textarea
                value={notes[key]}
                onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))}
                placeholder={`${scoreCategories.find(c => c.key === key)?.label_kr}에서 느껴지는 향과 맛을 적어주세요...`}
                rows={2}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Flavor Tags */}
      <section className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">풍미 태그</label>
        <FlavorSelector
          tags={flavorTags}
          selected={selectedFlavors}
          onSelect={setSelectedFlavors}
          maxSelect={5}
        />
      </section>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={saving || !selectedWhisky}
        className="w-full py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? '저장 중...' : '리뷰 저장하기'}
      </button>
    </div>
  )
}
