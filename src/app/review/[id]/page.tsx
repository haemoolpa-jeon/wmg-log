'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ExportCard } from '@/components/ExportCard'
import { Lang } from '@/lib/flavors'
import { storage, Review, encodeReview } from '@/lib/storage'
import { domToPng } from 'modern-screenshot'
import { jsPDF } from 'jspdf'
import { ChevronLeft, Trash2, Globe, Pencil, Share2, Check } from 'lucide-react'

export default function ViewReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [lang, setLang] = useState<Lang>('ko')
  const [exporting, setExporting] = useState(false)
  const [showCopied, setShowCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('wmg-lang') as Lang
    if (savedLang) setLang(savedLang)
    const found = storage.getReview(params.id as string)
    if (found) setReview(found)
  }, [params.id])

  const toggleLang = () => {
    const newLang = lang === 'ko' ? 'en' : 'ko'
    setLang(newLang)
    localStorage.setItem('wmg-lang', newLang)
  }

  const handleDelete = () => {
    if (confirm(lang === 'ko' ? '삭제하시겠습니까?' : 'Delete this review?')) {
      storage.deleteReview(params.id as string)
      router.push('/')
    }
  }

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

  const handleShare = async () => {
    if (!review) return
    const { id, createdAt, ...data } = review
    const encoded = encodeReview(data)
    const url = `${window.location.origin}/review/shared?d=${encoded}`
    await navigator.clipboard.writeText(url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  if (!review) return <div className="p-4 text-center text-gray-500">Loading...</div>

  const convertFlavors = (f: any[]) => {
    if (!f || f.length === 0) return []
    if (typeof f[0] === 'string') return f.map((id: string) => ({ id, strength: 3 }))
    return f
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.push('/')} className="flex items-center gap-1 text-gray-600">
          <ChevronLeft size={20} /> {lang === 'ko' ? '목록' : 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="flex items-center gap-1 text-gray-500 text-sm border px-2 py-1 rounded">
            <Globe size={14} /> {lang.toUpperCase()}
          </button>
          <button onClick={handleDelete} className="text-red-500 p-2"><Trash2 size={18} /></button>
        </div>
      </div>

      <div ref={cardRef}>
        <ExportCard
          whisky={review.whisky}
          scores={review.scores}
          notes={review.notes}
          flavors={{
            nose: convertFlavors(review.flavors?.nose || []),
            palate: convertFlavors(review.flavors?.palate || []),
            finish: convertFlavors(review.flavors?.finish || []),
          }}
          reviewer={review.reviewer}
          wouldRebuy={review.wouldRebuy}
          date={new Date(review.createdAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}
          lang={lang}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={handleExportPNG} disabled={exporting} className="py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">PNG</button>
        <button onClick={handleExportPDF} disabled={exporting} className="py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">PDF</button>
      </div>
      <button onClick={handleShare} className="w-full mt-3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2">
        {showCopied ? <><Check size={18} /> {lang === 'ko' ? '복사됨!' : 'Copied!'}</> : <><Share2 size={18} /> {lang === 'ko' ? '공유 링크' : 'Share Link'}</>}
      </button>
      <button onClick={() => router.push(`/review/${params.id}/edit`)} className="w-full mt-3 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2">
        <Pencil size={18} /> {lang === 'ko' ? '수정' : 'Edit'}
      </button>
    </div>
  )
}
