'use client';
import { Home, Search, Wine, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { icon: Home, label: '홈', href: '/' },
    { icon: Search, label: '검색', href: '/search' },
    { icon: Wine, label: '내 술장', href: '/cellar' },
    { icon: User, label: '프로필', href: '/profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto border-x shadow-2xl relative">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b h-14 flex items-center px-4 justify-between">
        <span className="font-bold text-xl text-amber-600">WhiskyLog</span>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 pb-20 p-4">{children}</main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 z-50 w-full max-w-md bg-white border-t h-16 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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
          );
        })}
      </nav>
    </div>
  );
}
