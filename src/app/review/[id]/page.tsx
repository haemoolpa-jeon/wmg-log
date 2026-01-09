'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FlavorRadar } from '@/components/FlavorRadar'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { getCountryFlag } from '@/lib/countries'
import { storage, Review } from '@/lib/storage'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Image, FileText, ChevronLeft, Trash2, Globe } from 'lucide-react'

const labels = {
  nose: { ko: '노즈', en: 'Nose' },
  palate: { ko: '팔레트', en: 'Palate' },
  finish: { ko: '피니시', en: 'Finish' },
  balance: { ko: '밸런스', en: 'Balance' },
}

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
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2, 
        backgroundColor: '#fffbeb',
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `${review?.whisky.name || 'review'}.png`
      link.href = canvas.toDataURL('image/png')
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
      const canvas = await html2canvas(cardRef.current, { 
        scale: 2, 
        backgroundColor: '#fffbeb',
        useCORS: true,
        logging: false,
      })
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
    return <div className="p-4 text-center text-gray-500">Loading...</div>
  }

  const { whisky, scores, notes, flavors, reviewer } = review
  const total = scores.nose + scores.palate + scores.finish + scores.balance
  const colorInfo = whiskyColors.find(c => c.value === whisky.color)

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
          <button onClick={handleDelete} className="text-red-500 p-2">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Review Card */}
      <div ref={cardRef} style={{ backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#fef3c7', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fcd34d' }}>
          <span style={{ fontSize: '20px' }}>🥃</span>
          <span style={{ fontSize: '14px', color: '#b45309' }}>📅 {new Date(review.createdAt).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</span>
        </div>

        <div style={{ backgroundColor: '#fef9e7', padding: '12px 16px', borderBottom: '1px solid #fcd34d' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '48px', height: '64px', borderRadius: '8px', border: '2px solid #fcd34d', flexShrink: 0, backgroundColor: colorInfo?.hex }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#111827', margin: 0 }}>
                    {whisky.country && <span style={{ marginRight: '4px' }}>{getCountryFlag(whisky.country)}</span>}
                    {whisky.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '2px 0' }}>{whisky.distillery}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {whisky.age && <span>{whisky.age}{lang === 'ko' ? '년' : 'Y'}</span>}
                    {whisky.abv && <span>{whisky.abv}%</span>}
                    {whisky.cask && <span>{whisky.cask}</span>}
                    <span>{colorInfo?.name[lang]}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#b45309' }}>{total}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>/100</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px', borderBottom: '1px solid #fcd34d', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
            {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
              <div key={key}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706' }}>{scores[key]}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{labels[key][lang]}</div>
              </div>
            ))}
          </div>
        </div>

        {(['nose', 'palate', 'finish'] as const).map(key => {
          const flavorList = Array.isArray(flavors[key]) ? flavors[key] : []
          return (flavorList.length > 0 || notes[key]) && (
            <div key={key} style={{ padding: '16px', borderBottom: '1px solid #fcd34d', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>{labels[key][lang]}</h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                {flavorList.length > 0 && (
                  <div style={{ flexShrink: 0 }}>
                    <FlavorRadar flavors={flavorList} lang={lang} size={130} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {flavorList.length > 0 && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {flavorList.map(f => getTagName(typeof f === 'string' ? f : f.id, lang)).join(' / ')}
                    </p>
                  )}
                  {notes[key] && <p style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{notes[key]}</p>}
                </div>
              </div>
            </div>
          )
        })}

        {reviewer && (
          <div style={{ padding: '12px 16px', backgroundColor: '#fef9e7', fontSize: '12px', color: '#6b7280' }}>
            by {reviewer}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={handleExportPNG} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
          <Image size={18} /> PNG
        </button>
        <button onClick={handleExportPDF} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">
          <FileText size={18} /> PDF
        </button>
      </div>
    </div>
  )
}
