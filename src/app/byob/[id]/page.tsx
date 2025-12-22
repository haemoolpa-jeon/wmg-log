'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin, Calendar, Wine, Users, Send } from 'lucide-react'

type Event = {
  id: string
  title: string
  description: string
  location: string
  event_date: string
  bottle_count: number
  min_bottle_value: number
  price: number
  max_participants: number
  status: string
  host_id: string
  profiles: { username: string }
}

type Application = { id: string; user_id: string; status: string; profiles: { username: string } }
type Comment = { id: string; content: string; created_at: string; parent_id: string | null; profiles: { username: string } }

export default function BYOBDetailPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [myApp, setMyApp] = useState<Application | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id || null)

      const { data: ev } = await supabase
        .from('byob_events')
        .select('*, profiles(username)')
        .eq('id', id)
        .single()
      setEvent(ev)

      const { data: apps } = await supabase
        .from('byob_applications')
        .select('*, profiles(username)')
        .eq('event_id', id)
        .neq('status', 'withdrawn')
      setApplications(apps || [])
      setMyApp(apps?.find(a => a.user_id === user?.id) || null)

      const { data: cmts } = await supabase
        .from('byob_comments')
        .select('*, profiles(username)')
        .eq('event_id', id)
        .order('created_at', { ascending: true })
      setComments(cmts || [])

      setLoading(false)
    }
    load()
  }, [id])

  const handleApply = async () => {
    if (!userId) return alert('로그인이 필요합니다')
    const { error } = await supabase.from('byob_applications').insert({ event_id: id, user_id: userId })
    if (!error) {
      const { data } = await supabase.from('byob_applications').select('*, profiles(username)').eq('event_id', id).eq('user_id', userId).single()
      setMyApp(data)
      setApplications(prev => [...prev, data])
    }
  }

  const handleWithdraw = async () => {
    if (!myApp) return
    await supabase.from('byob_applications').update({ status: 'withdrawn' }).eq('id', myApp.id)
    setMyApp(null)
    setApplications(prev => prev.filter(a => a.id !== myApp.id))
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !newComment.trim()) return
    const { data } = await supabase
      .from('byob_comments')
      .insert({ event_id: id, user_id: userId, content: newComment, parent_id: replyTo?.id || null })
      .select('*, profiles(username)')
      .single()
    if (data) {
      setComments(prev => [...prev, data])
      setNewComment('')
      setReplyTo(null)
    }
  }

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (!event) return <div className="text-center py-12">모임을 찾을 수 없습니다</div>

  const isHost = userId === event.host_id
  const isFull = applications.length >= event.max_participants

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/byob" className="inline-flex items-center text-gray-600 mb-4">
        <ChevronLeft size={20} /><span>목록으로</span>
      </Link>

      <div className="bg-white rounded-xl p-6 border mb-6">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
        <div className="space-y-2 text-gray-600 mb-4">
          <p className="flex items-center gap-2"><Calendar size={16} />
            {new Date(event.event_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="flex items-center gap-2"><MapPin size={16} />{event.location}</p>
          <p className="flex items-center gap-2"><Wine size={16} />
            {event.bottle_count}병 {event.min_bottle_value > 0 && <span className="text-amber-600">(합계 {event.min_bottle_value}만원 이상)</span>}
          </p>
          <p className="flex items-center gap-2"><Users size={16} />{applications.length}/{event.max_participants}명</p>
        </div>
        {event.description && <p className="text-gray-700 mb-4">{event.description}</p>}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-400">주최: {event.profiles?.username}</span>
          <span className="text-xl font-bold text-amber-600">
            {event.price === 0 ? '무료' : `${event.price.toLocaleString()}원`}
          </span>
        </div>
      </div>

      {!isHost && (
        <div className="mb-6">
          {myApp ? (
            <button onClick={handleWithdraw} className="w-full py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
              신청 취소
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={isFull}
              className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
            >
              {isFull ? '마감됨' : '참가 신청'}
            </button>
          )}
        </div>
      )}

      {isHost && applications.length > 0 && (
        <div className="bg-white rounded-xl p-4 border mb-6">
          <h2 className="font-bold mb-3">신청자 ({applications.length})</h2>
          <ul className="space-y-2">
            {applications.map(app => (
              <li key={app.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span>{app.profiles?.username}</span>
                <span className="text-xs text-gray-400">{app.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 border">
        <h2 className="font-bold mb-4">댓글 ({comments.length})</h2>
        <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
          {comments.filter(c => !c.parent_id).map(c => (
            <div key={c.id}>
              <div className="text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{c.profiles?.username}</span>
                    <span className="text-gray-400 text-xs ml-2">
                      {new Date(c.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {userId && (
                    <button
                      onClick={() => setReplyTo({ id: c.id, username: c.profiles?.username })}
                      className="text-xs text-gray-400 hover:text-amber-600"
                    >
                      답글
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{c.content}</p>
              </div>
              {/* Replies */}
              {comments.filter(r => r.parent_id === c.id).map(reply => (
                <div key={reply.id} className="ml-6 mt-2 pl-3 border-l-2 border-gray-100 text-sm">
                  <span className="font-medium">{reply.profiles?.username}</span>
                  <span className="text-gray-400 text-xs ml-2">
                    {new Date(reply.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        {userId && (
          <form onSubmit={handleComment} className="space-y-2">
            {replyTo && (
              <div className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded">
                <span className="text-gray-600">@{replyTo.username}에게 답글</span>
                <button type="button" onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-600">취소</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={replyTo ? '답글 작성...' : '댓글 작성...'}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button type="submit" className="p-2 bg-amber-600 text-white rounded-lg">
                <Send size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
