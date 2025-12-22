'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Wine } from 'lucide-react'
import Link from 'next/link'

type Whisky = {
  id: string
  name: string
  name_kr: string | null
  distillery: string | null
  region: string | null
  country: string
  type: string | null
  abv: number | null
  age: number | null
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Whisky[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = useMemo(() => createClient(), [])

  // Debug: check if env vars are loaded
  useEffect(() => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from('whiskies')
        .select('*')
        .or(`name.ilike.%${query}%,name_kr.ilike.%${query}%,distillery.ilike.%${query}%`)
        .limit(20)
      console.log('Search results:', data, error)
      setResults(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, supabase])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">위스키 검색</h1>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="위스키 이름, 증류소로 검색..."
          className="w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg"
        />
      </div>

      {/* Results */}
      {loading ? (
        <p className="text-center text-gray-500 py-8">검색 중...</p>
      ) : results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(whisky => (
            <Link
              key={whisky.id}
              href={`/whisky/${whisky.id}`}
              className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wine className="text-amber-600" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{whisky.name}</h3>
                  {whisky.name_kr && (
                    <p className="text-sm text-gray-500 truncate">{whisky.name_kr}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {whisky.distillery && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{whisky.distillery}</span>
                    )}
                    {whisky.age && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        {whisky.age}년
                      </span>
                    )}
                    {whisky.abv && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{whisky.abv}%</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="text-center py-12">
          <Wine className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">검색 결과가 없습니다</p>
          <p className="text-sm text-gray-400 mt-1">다른 키워드로 검색해보세요</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">위스키를 검색해보세요</p>
          <p className="text-sm text-gray-400 mt-1">이름, 증류소 등으로 검색할 수 있습니다</p>
        </div>
      )}
    </div>
  )
}
