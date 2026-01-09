'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ExportCard } from '@/components/ExportCard'
import { whiskyColors, Lang } from '@/lib/flavors'
import { storage, Review } from '@/lib/storage'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Image, FileText, ChevronLeft, Trash2, Globe, Pencil } from 'lucide-react'

export default function ViewReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [lang, setLang] = useState<Lang>('ko')
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('wmg-lang') as Lang
    if (savedLang) setLang(savedLang)
    
    const reviews = storage.getReviews()
    const found = reviews.find(r => r.id === params.id)
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
      // Clone the card to a temporary container without Tailwind styles
      const clone = cardRef.current.cloneNode(true) as HTMLElement
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.appendChild(clone)
      document.body.appendChild(container)
      
      const canvas = await html2canvas(clone, { 
        scale: 2, 
        backgroundColor: '#fffbeb',
        useCORS: true,
        logging: false,
        removeContainer: true,
      })
      
      document.body.removeChild(container)
      
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${review?.whisky.name || 'review'}.png`
      link.click()
    } catch (e) {
      console.warn('Export error:', e)
    } finally {
      setExporting(false)
    }
  }

  const handleExportPDF = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const clone = cardRef.current.cloneNode(true) as HTMLElement
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.appendChild(clone)
      document.body.appendChild(container)
      
      const canvas = await html2canvas(clone, { 
        scale: 2, 
        backgroundColor: '#fffbeb',
        useCORS: true,
        logging: false,
        removeContainer: true,
      })
      
      document.body.removeChild(container)
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = pdf.internal.pageSize.getWidth() - 20
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 10, 10, w, h)
      pdf.save(`${review?.whisky.name || 'review'}.pdf`)
    } catch (e) {
      console.warn('Export error:', e)
    } finally {
      setExporting(false)
    }
  }

  if (!review) {
    return <div style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
  }

  // Convert old flavor format
  const convertFlavors = (f: any[]) => {
    if (!f || f.length === 0) return []
    if (typeof f[0] === 'string') return f.map((id: string) => ({ id, strength: 3 }))
    return f
  }

  const flavors = {
    nose: convertFlavors(review.flavors?.nose || []),
    palate: convertFlavors(review.flavors?.palate || []),
    finish: convertFlavors(review.flavors?.finish || []),
  }

  return (
    <div style={{ maxWidth: '672px', margin: '0 auto', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          <ChevronLeft size={20} /> {lang === 'ko' ? '목록' : 'Back'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '14px', border: '1px solid #d1d5db', padding: '4px 8px', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>
            <Globe size={14} /> {lang.toUpperCase()}
          </button>
          <button onClick={handleDelete} style={{ color: '#ef4444', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Review Card */}
      <ExportCard
        ref={cardRef}
        whisky={review.whisky}
        scores={review.scores}
        notes={review.notes}
        flavors={flavors}
        reviewer={review.reviewer}
        date={new Date(review.createdAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}
        lang={lang}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
        <button 
          onClick={handleExportPNG} 
          disabled={exporting}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: exporting ? '#93c5fd' : '#2563eb', color: 'white', borderRadius: '12px', border: 'none', cursor: exporting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500' }}
        >
          <Image size={18} /> PNG
        </button>
        <button 
          onClick={handleExportPDF} 
          disabled={exporting}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: exporting ? '#fca5a5' : '#dc2626', color: 'white', borderRadius: '12px', border: 'none', cursor: exporting ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500' }}
        >
          <FileText size={18} /> PDF
        </button>
        <button 
          onClick={() => router.push(`/review/${params.id}/edit`)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#d97706', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
        >
          <Pencil size={18} /> {lang === 'ko' ? '수정' : 'Edit'}
        </button>
      </div>
    </div>
  )
}
