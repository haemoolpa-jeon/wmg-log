import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Gift, Users } from 'lucide-react'

export default async function ShareListPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('share_events')
    .select('*, profiles(username), share_applications(count)')
    .in('status', ['open', 'selecting'])
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">위스키 나눔</h1>
        <Link
          href="/share/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">나눔 등록</span>
        </Link>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map(event => (
            <Link
              key={event.id}
              href={`/share/${event.id}`}
              className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                {event.status === 'selecting' && (
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">선정중</span>
                )}
                {event.status === 'open' && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">모집중</span>
                )}
              </div>
              <h3 className="font-bold text-lg mb-2">{event.whisky_name}</h3>
              {event.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">by {event.profiles?.username || '익명'}</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Users size={14} />
                  {event.share_applications?.[0]?.count || 0}명 신청
                </span>
              </div>
              <div className="mt-2 pt-2 border-t text-xs text-gray-400">
                당첨 {event.winner_count}명
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Gift className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">아직 나눔이 없습니다</p>
          <p className="text-sm text-gray-400">첫 나눔을 등록해보세요!</p>
        </div>
      )}
    </div>
  )
}
