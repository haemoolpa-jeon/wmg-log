'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExportCard } from '@/components/ExportCard'
import { Lang } from '@/lib/flavors'
import { decodeReview, storage } from '@/lib/storage'
import { domToPng } from 'modern-screenshot'
import { jsPDF } from 'jspdf'
import { Download, Check } from 'lucide-react'

function SharedReviewContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Lang>('ko')
  const [review, setReview] = useState<ReturnType<typeof decodeReview>>(null)
  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('wmg-lang') as Lang
    if (savedLang) setLang(savedLang)
    
    const data = searchParams.get('d')
    if (data) {
      const decoded = decodeReview(data)
      setReview(decoded)
    }
  }, [searchParams])

  const handleExportPNG = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const dataUrl = await domToPng(cardRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${review?.whisky.name || 'review'}.png`
      link.click()
    } finally { setExporting(false) }
  }

  const handleExportPDF = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const dataUrl = await domToPng(cardRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const img = new window.Image()
      img.src = dataUrl
      await new Promise(resolve => { img.onload = resolve })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = pdf.internal.pageSize.getWidth() - 20
      const h = (img.height * w) / img.width
      pdf.addImage(dataUrl, 'PNG', 10, 10, w, h)
      pdf.save(`${review?.whisky.name || 'review'}.pdf`)
    } finally { setExporting(false) }
  }

  const handleSave = () => {
    if (!review) return
    storage.saveReview(review)
    setSaved(true)
  }

  if (!review) {
    return <div className="p-8 text-center text-gray-500">{lang === 'ko' ? '리뷰를 불러올 수 없습니다' : 'Could not load review'}</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-semibold text-gray-700">{lang === 'ko' ? '공유된 리뷰' : 'Shared Review'}</h1>
      </div>

      <div ref={cardRef}>
        <ExportCard
          whisky={review.whisky}
          scores={review.scores}
          notes={review.notes}
          flavors={review.flavors}
          reviewer={review.reviewer}
          wouldRebuy={review.wouldRebuy}
          date={new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={handleExportPNG} disabled={exporting} className="py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">PNG</button>
        <button onClick={handleExportPDF} disabled={exporting} className="py-3 bg-red-600 text-white rounded-xl disabled:opacity-50">PDF</button>
      </div>
      <button onClick={handleSave} disabled={saved} className="w-full mt-3 py-3 bg-amber-600 text-white rounded-xl disabled:bg-green-600 flex items-center justify-center gap-2">
        {saved ? <><Check size={18} /> {lang === 'ko' ? '저장됨' : 'Saved'}</> : <><Download size={18} /> {lang === 'ko' ? '내 리뷰에 저장' : 'Save to My Reviews'}</>}
      </button>
    </div>
  )
}

export default function SharedReviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <SharedReviewContent />
    </Suspense>
  )
}
