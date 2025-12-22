'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewSharePage() {
  const [form, setForm] = useState({
    whisky_name: '',
    description: '',
    winner_count: 1,
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

    const { error } = await supabase.from('share_events').insert({
      ...form,
      host_id: user.id,
    })

    if (error) {
      alert('오류: ' + error.message)
      setLoading(false)
    } else {
      router.push('/share')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/share" className="p-2 -ml-2"><ChevronLeft size={24} /></Link>
        <h1 className="text-xl font-bold">나눔 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">위스키 이름</label>
          <input
            type="text"
            value={form.whisky_name}
            onChange={e => setForm(f => ({ ...f, whisky_name: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="예: 글렌피딕 12년"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">설명 (선택)</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg resize-none"
            rows={3}
            placeholder="나눔 조건, 용량 등을 적어주세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">당첨 인원</label>
          <input
            type="number"
            min={1}
            max={10}
            value={form.winner_count}
            onChange={e => setForm(f => ({ ...f, winner_count: +e.target.value }))}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <p className="text-xs text-gray-400 mt-1">선정될 인원 수 (1~10명)</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-800">
          <p className="font-medium mb-1">📌 나눔 규칙</p>
          <p>당첨자는 2주 내에 리뷰를 작성해야 합니다. 미작성 시 향후 BYOB/나눔 참여가 제한됩니다.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? '등록 중...' : '나눔 등록하기'}
        </button>
      </form>
    </div>
  )
}
