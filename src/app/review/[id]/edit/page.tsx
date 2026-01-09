'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FlavorWheel } from '@/components/FlavorWheel'
import { ColorPicker } from '@/components/ColorPicker'
import { FlavorRadar } from '@/components/FlavorRadar'
import { flavorData, getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { countries, getCountryFlag, correctText } from '@/lib/countries'
import { storage, FlavorWithStrength } from '@/lib/storage'
import { domToPng } from 'modern-screenshot'
import { jsPDF } from 'jspdf'
import { Download, Image, FileText, ChevronLeft, Globe, Sparkles } from 'lucide-react'

const labels = {
  nose: { ko: '노즈', en: 'Nose' },
  palate: { ko: '팔레트', en: 'Palate' },
  finish: { ko: '피니시', en: 'Finish' },
  balance: { ko: '밸런스', en: 'Balance' },
}

const ui = {
  editReview: { ko: '리뷰 수정', en: 'Edit Review' },
  whiskyInfo: { ko: '위스키 정보', en: 'Whisky Info' },
  reviewer: { ko: '리뷰어', en: 'Reviewer' },
  reviewerPlaceholder: { ko: '이름 또는 닉네임', en: 'Name or nickname' },
  whiskyName: { ko: '위스키 이름', en: 'Whisky Name' },
  distillery: { ko: '증류소', en: 'Distillery' },
  country: { ko: '국가', en: 'Country' },
  selectCountry: { ko: '국가 선택', en: 'Select Country' },
  age: { ko: '숙성 연수', en: 'Age' },
  abv: { ko: '도수 (%)', en: 'ABV (%)' },
  cask: { ko: '캐스크', en: 'Cask' },
  color: { ko: '색상', en: 'Color' },
  score: { ko: '점수', en: 'Score' },
  preview: { ko: '미리보기', en: 'Preview' },
  edit: { ko: '수정', en: 'Edit' },
  save: { ko: '저장', en: 'Save' },
  saved: { ko: '저장되었습니다!', en: 'Saved!' },
  noseNote: { ko: '향에 대한 노트...', en: 'Aroma notes...' },
  palateNote: { ko: '맛에 대한 노트...', en: 'Taste notes...' },
  finishNote: { ko: '여운에 대한 노트...', en: 'Finish notes...' },
  aiCorrect: { ko: 'AI 교정', en: 'AI Fix' },
  correcting: { ko: '교정 중...', en: 'Fixing...' },
  back: { ko: '목록', en: 'Back' },
}

export default function EditReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('ko')
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [reviewer, setReviewer] = useState('')
  const [whisky, setWhisky] = useState({ name: '', distillery: '', country: '', age: '', abv: '', cask: '', color: 0.7 })
  const [scores, setScores] = useState({ nose: 20, palate: 20, finish: 20, balance: 20 })
  const [notes, setNotes] = useState({ nose: '', palate: '', finish: '' })
  const [flavors, setFlavors] = useState<{ nose: FlavorWithStrength[]; palate: FlavorWithStrength[]; finish: FlavorWithStrength[] }>({ 
    nose: [], palate: [], finish: [] 
  })
  const [exporting, setExporting] = useState(false)
  const [correcting, setCorrecting] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('wmg-lang') as Lang
    if (savedLang) setLang(savedLang)
    
    const review = storage.getReview(params.id as string)
    if (review) {
      setReviewer(review.reviewer || '')
      setWhisky({
        name: review.whisky.name,
        distillery: review.whisky.distillery,
        country: review.whisky.country || '',
        age: review.whisky.age || '',
        abv: review.whisky.abv || '',
        cask: review.whisky.cask || '',
        color: review.whisky.color || 0.7,
      })
      setScores(review.scores)
      setNotes(review.notes)
      // Handle old format (string[]) vs new format (FlavorWithStrength[])
      const convertFlavors = (f: any[]): FlavorWithStrength[] => {
        if (!f || f.length === 0) return []
        if (typeof f[0] === 'string') return f.map(id => ({ id, strength: 3 }))
        return f
      }
      setFlavors({
        nose: convertFlavors(review.flavors?.nose || []),
        palate: convertFlavors(review.flavors?.palate || []),
        finish: convertFlavors(review.flavors?.finish || []),
      })
      setLoaded(true)
    }
  }, [params.id])

  const toggleLang = () => {
    const newLang = lang === 'ko' ? 'en' : 'ko'
    setLang(newLang)
    localStorage.setItem('wmg-lang', newLang)
  }

  const handleCorrect = async (key: 'nose' | 'palate' | 'finish') => {
    if (!notes[key].trim() || correcting) return
    setCorrecting(key)
    try {
      const corrected = await correctText(notes[key], lang)
      setNotes(n => ({ ...n, [key]: corrected }))
    } finally {
      setCorrecting(null)
    }
  }

  const total = scores.nose + scores.palate + scores.finish + scores.balance
  const colorInfo = whiskyColors.find(c => c.value === whisky.color)

  const handleExportPNG = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const dataUrl = await domToPng(cardRef.current, { scale: 2, backgroundColor: '#fffbeb' })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${whisky.name || 'review'}.png`
      link.click()
    } catch (e) { console.warn(e) } 
    finally { setExporting(false) }
  }

  const handleExportPDF = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const dataUrl = await domToPng(cardRef.current, { scale: 2, backgroundColor: '#fffbeb' })
      const img = new window.Image()
      img.src = dataUrl
      await new Promise(resolve => { img.onload = resolve })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = pdf.internal.pageSize.getWidth() - 20
      const h = (img.height * w) / img.width
      pdf.addImage(dataUrl, 'PNG', 10, 10, w, h)
      pdf.save(`${whisky.name || 'review'}.pdf`)
    } catch (e) { console.warn(e) } 
    finally { setExporting(false) }
  }

  const handleSave = () => {
    storage.updateReview(params.id as string, { reviewer, whisky, scores, notes, flavors })
    alert(ui.saved[lang])
    router.push('/')
  }

  if (!loaded) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>
  }

  // Preview Card
  if (step === 'preview') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setStep('form')} className="flex items-center gap-1 text-gray-600">
            <ChevronLeft size={20} /> {ui.edit[lang]}
          </button>
          <button onClick={toggleLang} className="flex items-center gap-1 text-gray-500 text-sm border px-2 py-1 rounded">
            <Globe size={14} /> {lang.toUpperCase()}
          </button>
        </div>

        <div ref={cardRef} style={{ backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#fef3c7', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fcd34d' }}>
            <span style={{ fontSize: '20px' }}>🥃</span>
            <span style={{ fontSize: '14px', color: '#b45309' }}>📅 {new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</span>
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
          {(['nose', 'palate', 'finish'] as const).map(key => (
            (flavors[key].length > 0 || notes[key]) && (
              <div key={key} style={{ padding: '16px', borderBottom: '1px solid #fcd34d', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>{labels[key][lang]}</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {flavors[key].length > 0 && <div style={{ flexShrink: 0 }}><FlavorRadar flavors={flavors[key]} lang={lang} size={130} /></div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {flavors[key].length > 0 && <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>{flavors[key].map(f => getTagName(f.id, lang)).join(' / ')}</p>}
                    {notes[key] && <p style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>{notes[key]}</p>}
                  </div>
                </div>
              </div>
            )
          ))}
          {reviewer && <div style={{ padding: '12px 16px', backgroundColor: '#fef9e7', fontSize: '12px', color: '#6b7280' }}>by {reviewer}</div>}
        </div>

        <div style={{ marginTop: '16px' }} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={handleExportPNG} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
            <Image size={18} /> PNG
          </button>
          <button onClick={handleExportPDF} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">
            <FileText size={18} /> PDF
          </button>
        </div>
        <button onClick={handleSave} className="w-full py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700">
          <Download size={18} className="inline mr-2" /> {ui.save[lang]}
        </button>
      </div>
    )
  }

  // Form
  return (
    <div className="max-w-2xl mx-auto p-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push('/')} className="flex items-center gap-1 text-gray-600">
          <ChevronLeft size={20} /> {ui.back[lang]}
        </button>
        <h1 className="text-xl font-bold">{ui.editReview[lang]}</h1>
        <button onClick={toggleLang} className="flex items-center gap-1 text-gray-500 text-sm border px-2 py-1 rounded">
          <Globe size={14} /> {lang === 'ko' ? 'EN' : '한국어'}
        </button>
      </div>

      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.reviewer[lang]}</label>
        <input type="text" placeholder={ui.reviewerPlaceholder[lang]} value={reviewer} onChange={e => setReviewer(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
      </section>

      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.whiskyInfo[lang]}</label>
        <div className="space-y-2">
          <input type="text" placeholder={ui.whiskyName[lang] + ' *'} value={whisky.name} onChange={e => setWhisky(w => ({ ...w, name: e.target.value }))} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder={ui.distillery[lang]} value={whisky.distillery} onChange={e => setWhisky(w => ({ ...w, distillery: e.target.value }))} className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
            <select value={whisky.country} onChange={e => setWhisky(w => ({ ...w, country: e.target.value }))} className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="">{ui.selectCountry[lang]}</option>
              {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name[lang]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder={ui.age[lang]} value={whisky.age} onChange={e => setWhisky(w => ({ ...w, age: e.target.value }))} className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
            <input type="text" placeholder={ui.abv[lang]} value={whisky.abv} onChange={e => setWhisky(w => ({ ...w, abv: e.target.value }))} className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
          </div>
          <input type="text" placeholder={ui.cask[lang] + ' (ex: Sherry, Bourbon, Port...)'} value={whisky.cask} onChange={e => setWhisky(w => ({ ...w, cask: e.target.value }))} className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500" />
        </div>
      </section>

      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.color[lang]}</label>
        <ColorPicker value={whisky.color} onChange={v => setWhisky(w => ({ ...w, color: v }))} lang={lang} />
      </section>

      <section className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{ui.score[lang]}</label>
          <span className="text-xl font-bold text-amber-600">{total}/100</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
            <div key={key} className="bg-white p-3 rounded-lg border">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{labels[key][lang]}</span>
                <span className="text-amber-600 font-semibold text-sm">{scores[key]}</span>
              </div>
              <input type="range" min={0} max={25} value={scores[key]} onChange={e => setScores(s => ({ ...s, [key]: +e.target.value }))} className="w-full accent-amber-600 h-2" />
            </div>
          ))}
        </div>
      </section>

      {(['nose', 'palate', 'finish'] as const).map((key, i) => (
        <section key={key} className={`mb-4 p-3 rounded-lg border ${i === 0 ? 'bg-red-50/50 border-red-100' : i === 1 ? 'bg-amber-50/50 border-amber-100' : 'bg-orange-50/50 border-orange-100'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">{i === 0 ? '👃' : i === 1 ? '👅' : '✨'} {labels[key][lang]}</label>
          <FlavorWheel categories={flavorData} selected={flavors[key]} onSelect={f => setFlavors(prev => ({ ...prev, [key]: f }))} maxSelect={10} lang={lang} />
          <div className="relative mt-2">
            <textarea placeholder={ui[`${key}Note` as keyof typeof ui][lang]} value={notes[key]} onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))} rows={2} className="w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm" />
            {notes[key].trim() && (
              <button onClick={() => handleCorrect(key)} disabled={correcting === key} className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50">
                <Sparkles size={12} />{correcting === key ? ui.correcting[lang] : ui.aiCorrect[lang]}
              </button>
            )}
          </div>
        </section>
      ))}

      <button onClick={() => setStep('preview')} disabled={!whisky.name} className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50">
        {ui.preview[lang]} →
      </button>
    </div>
  )
}
