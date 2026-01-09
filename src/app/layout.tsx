import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WmG Review',
  description: 'Whisky tasting notes & review cards',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
