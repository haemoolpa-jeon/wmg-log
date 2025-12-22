import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, MapPin, Calendar, Users, Wine } from 'lucide-react'

export default async function BYOBListPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('byob_events')
    .select('*, profiles(username), byob_applications(count)')
    .eq('status', 'open')
    .order('event_date', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">BYOB 모임</h1>
        <Link
          href="/byob/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">모임 만들기</span>
        </Link>
      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map(event => (
            <Link
              key={event.id}
              href={`/byob/${event.id}`}
              className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(event.event_date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  {event.location}
                </p>
                <p className="flex items-center gap-2">
                  <Wine size={14} />
                  {event.bottle_count}병 {event.min_bottle_value > 0 && `(${event.min_bottle_value}만원↑)`}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={14} />
                  {event.byob_applications?.[0]?.count || 0}/{event.max_participants}명
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <span className="text-xs text-gray-400">by {event.profiles?.username || '익명'}</span>
                <span className="font-bold text-amber-600">
                  {event.price === 0 ? '무료' : `${event.price.toLocaleString()}원`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">아직 열린 모임이 없습니다</p>
          <p className="text-sm text-gray-400">첫 BYOB 모임을 만들어보세요!</p>
        </div>
      )}
    </div>
  )
}
