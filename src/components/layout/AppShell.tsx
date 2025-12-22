'use client'

import { Home, Search, Wine, User, PenLine, Users, Gift } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: Home, label: '홈', href: '/' },
  { icon: Search, label: '검색', href: '/search' },
  { icon: Users, label: 'BYOB', href: '/byob' },
  { icon: Gift, label: '나눔', href: '/share' },
  { icon: Wine, label: '내 술장', href: '/cellar' },
  { icon: User, label: '프로필', href: '/profile' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PC Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r flex-col z-50">
        <div className="p-6 border-b">
          <span className="font-bold text-2xl text-amber-600">WmG Log</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-amber-50 text-amber-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t">
          <Link
            href="/review/new"
            className="flex items-center justify-center gap-2 w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <PenLine size={18} />
            <span>리뷰 작성</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur border-b h-14 flex items-center px-4 justify-between">
          <span className="font-bold text-xl text-amber-600">WmG Log</span>
          <Link href="/review/new" className="p-2 text-amber-600">
            <PenLine size={22} />
          </Link>
        </header>

        {/* PC header */}
        <header className="hidden lg:flex sticky top-0 z-40 bg-white/90 backdrop-blur border-b h-16 items-center px-8">
          <h1 className="text-lg font-semibold text-gray-800">
            {navItems.find(n => n.href === pathname)?.label || 'WhiskyLog'}
          </h1>
        </header>

        {/* Content */}
        <main className="pb-20 lg:pb-8 p-4 lg:p-8 max-w-5xl mx-auto">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 z-50 w-full bg-white border-t h-16 flex justify-around items-center">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center w-full">
              <item.icon
                size={24}
                className={isActive ? 'text-amber-600' : 'text-gray-400'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] mt-1 ${isActive ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
