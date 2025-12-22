'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBYOBPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    bottle_count: 1,
    min_bottle_value: 0,
    price: 0,
    max_participants: 10,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('로그인이 필요합니다')
      router.push('/auth/login')
      return
    }

    const { error } = await supabase.from('byob_events').insert({
      ...form,
      host_id: user.id,
      event_date: new Date(form.event_date).toISOString(),
    })

    if (error) {
      alert('오류: ' + error.message)
      setLoading(false)
    } else {
      router.push('/byob')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/byob" className="p-2 -ml-2"><ChevronLeft size={24} /></Link>
        <h1 className="text-xl font-bold">BYOB 모임 만들기</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">모임 제목</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">장소</label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="예: 강남역 근처 바"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">날짜 및 시간</label>
          <input
            type="datetime-local"
            value={form.event_date}
            onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">병 수</label>
            <input
              type="number"
              min={1}
              value={form.bottle_count}
              onChange={e => setForm(f => ({ ...f, bottle_count: +e.target.value }))}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">최소 병 합계 (만원)</label>
            <input
              type="number"
              min={0}
              value={form.min_bottle_value}
              onChange={e => setForm(f => ({ ...f, min_bottle_value: +e.target.value }))}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="예: 80"
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 -mt-2">
          예: {form.bottle_count}병 합계 {form.min_bottle_value}만원 이상
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">최대 인원</label>
          <input
            type="number"
            min={2}
            value={form.max_participants}
            onChange={e => setForm(f => ({ ...f, max_participants: +e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">참가비 (원)</label>
          <input
            type="number"
            min={0}
            max={500000}
            step={1000}
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <p className="text-xs text-gray-400 mt-1">0 ~ 500,000원</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? '생성 중...' : '모임 만들기'}
        </button>
      </form>
    </div>
  )
}
