'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { LogOut, User as UserIcon } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ username: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">로딩 중...</div>
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <UserIcon className="mx-auto text-gray-300 mb-4" size={64} />
        <h1 className="text-xl font-bold mb-2">로그인이 필요합니다</h1>
        <p className="text-gray-500 mb-6">리뷰를 작성하고 내 술장을 관리하세요</p>
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="block w-full py-3 border border-amber-600 text-amber-600 font-semibold rounded-lg hover:bg-amber-50"
          >
            회원가입
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl p-6 border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <UserIcon className="text-amber-600" size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{profile?.username || '사용자'}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
      >
        <LogOut size={18} />
        로그아웃
      </button>
    </div>
  )
}
