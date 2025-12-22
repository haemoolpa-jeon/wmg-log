'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Gift, Users, Shuffle, Check } from 'lucide-react'

type Event = {
  id: string
  whisky_name: string
  description: string
  winner_count: number
  status: string
  host_id: string
  profiles: { username: string }
}

type Application = {
  id: string
  user_id: string
  selected: boolean
  review_submitted: boolean
  profiles: { username: string }
}

export default function ShareDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [myApp, setMyApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user?.id || null)

    const { data: ev } = await supabase
      .from('share_events')
      .select('*, profiles(username)')
      .eq('id', id)
      .single()
    setEvent(ev)

    const { data: apps } = await supabase
      .from('share_applications')
      .select('*, profiles(username)')
      .eq('event_id', id)
    setApplications(apps || [])
    setMyApp(apps?.find(a => a.user_id === user?.id) || null)

    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleApply = async () => {
    if (!userId) return alert('로그인이 필요합니다')
    
    // Check if banned
    const { data: ban } = await supabase
      .from('event_bans')
      .select('*')
      .eq('user_id', userId)
      .gt('banned_until', new Date().toISOString())
      .single()
    
    if (ban) return alert('나눔 참여가 제한된 상태입니다.')

    const { error } = await supabase.from('share_applications').insert({ event_id: id, user_id: userId })
    if (!error) load()
  }

  const handleWithdraw = async () => {
    if (!myApp) return
    await supabase.from('share_applications').delete().eq('id', myApp.id)
    setMyApp(null)
    setApplications(prev => prev.filter(a => a.id !== myApp.id))
  }

  const handleSelectUser = async (appId: string) => {
    await supabase.from('share_applications').update({ selected: true }).eq('id', appId)
    load()
  }

  const handleRandomDraw = async () => {
    if (!event) return
    const unselected = applications.filter(a => !a.selected)
    const remaining = event.winner_count - applications.filter(a => a.selected).length
    
    if (remaining <= 0) return alert('이미 모든 당첨자가 선정되었습니다')
    if (unselected.length === 0) return alert('선정할 신청자가 없습니다')

    const shuffled = [...unselected].sort(() => Math.random() - 0.5)
    const winners = shuffled.slice(0, Math.min(remaining, unselected.length))

    for (const w of winners) {
      await supabase.from('share_applications').update({ selected: true }).eq('id', w.id)
    }

    // Set review deadline (2 weeks)
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 14)
    await supabase.from('share_events').update({ 
      status: 'completed',
      review_deadline: deadline.toISOString()
    }).eq('id', id)

    load()
    alert(`${winners.length}명이 당첨되었습니다!`)
  }

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (!event) return <div className="text-center py-12">나눔을 찾을 수 없습니다</div>

  const isHost = userId === event.host_id
  const selectedCount = applications.filter(a => a.selected).length
  const isCompleted = event.status === 'completed'

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/share" className="inline-flex items-center text-gray-600 mb-4">
        <ChevronLeft size={20} /><span>목록으로</span>
      </Link>

      <div className="bg-white rounded-xl p-6 border mb-6">
        <div className="flex items-center gap-2 mb-2">
          {event.status === 'completed' && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">완료</span>
          )}
          {event.status === 'open' && (
            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">모집중</span>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">{event.whisky_name}</h1>
        {event.description && <p className="text-gray-600 mb-4">{event.description}</p>}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-400">by {event.profiles?.username}</span>
          <span className="flex items-center gap-1 text-amber-600">
            <Gift size={16} />
            당첨 {selectedCount}/{event.winner_count}명
          </span>
        </div>
      </div>

      {/* Apply/Withdraw for non-hosts */}
      {!isHost && !isCompleted && (
        <div className="mb-6">
          {myApp ? (
            <div>
              {myApp.selected ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 font-semibold">🎉 당첨되었습니다!</p>
                  <p className="text-sm text-green-600 mt-1">2주 내에 리뷰를 작성해주세요</p>
                </div>
              ) : (
                <button onClick={handleWithdraw} className="w-full py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  신청 취소
                </button>
              )}
            </div>
          ) : (
            <button onClick={handleApply} className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              나눔 신청
            </button>
          )}
        </div>
      )}

      {/* Host controls */}
      {isHost && (
        <div className="bg-white rounded-xl p-4 border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">신청자 ({applications.length}명)</h2>
            {!isCompleted && applications.length > 0 && (
              <button
                onClick={handleRandomDraw}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
              >
                <Shuffle size={16} />
                랜덤 추첨
              </button>
            )}
          </div>
          
          {applications.length > 0 ? (
            <ul className="space-y-2">
              {applications.map(app => (
                <li key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {app.selected && <Check size={16} className="text-green-500" />}
                    <span className={app.selected ? 'font-medium' : ''}>{app.profiles?.username}</span>
                  </div>
                  {!app.selected && !isCompleted && (
                    <button
                      onClick={() => handleSelectUser(app.id)}
                      className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                    >
                      선정
                    </button>
                  )}
                  {app.selected && (
                    <span className="text-xs text-green-600">당첨</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">아직 신청자가 없습니다</p>
          )}
        </div>
      )}

      {/* Show winners for non-hosts */}
      {!isHost && isCompleted && (
        <div className="bg-white rounded-xl p-4 border">
          <h2 className="font-bold mb-3">당첨자</h2>
          <ul className="space-y-2">
            {applications.filter(a => a.selected).map(app => (
              <li key={app.id} className="flex items-center gap-2 py-2">
                <Check size={16} className="text-green-500" />
                <span>{app.profiles?.username}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
