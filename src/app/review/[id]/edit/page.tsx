'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FlavorWheel } from '@/components/FlavorWheel'
import { ColorPicker } from '@/components/ColorPicker'
import { ExportCard } from '@/components/ExportCard'
import { flavorData, Lang } from '@/lib/flavors'
import { countries, correctText } from '@/lib/countries'
import { storage, FlavorWithStrength, BottlingType } from '@/lib/storage'
import { domToPng } from 'modern-screenshot'
import { jsPDF } from 'jspdf'
import { ChevronLeft, Globe, Sparkles } from 'lucide-react'

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
  whiskyName: { ko: '위스키 이름', en: 'Whisky Name' },
  distillery: { ko: '증류소', en: 'Distillery' },
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
  optional: { ko: '선택사항', en: 'Optional' },
  official: { ko: '오피셜', en: 'Official' },
  ib: { ko: '인디펜던트', en: 'Independent' },
  singleCask: { ko: '싱글캐스크', en: 'Single Cask' },
  bottleNumber: { ko: '보틀 넘버', en: 'Bottle #' },
  price: { ko: '가격', en: 'Price' },
  purchaseDate: { ko: '구매일', en: 'Purchase Date' },
  openingDate: { ko: '개봉일', en: 'Opening Date' },
  wouldRebuy: { ko: '재구매 의향', en: 'Would Rebuy?' },
  yes: { ko: '예', en: 'Yes' },
  no: { ko: '아니오', en: 'No' },
  maybe: { ko: '글쎄', en: 'Maybe' },
  overall: { ko: '총평', en: 'Overall' },
  overallNote: { ko: '전체적인 인상...', en: 'Overall impression...' },
}

type Whisky = {
  name: string; distillery: string; country: string; age: string; abv: string; cask: string; color: number
  bottlingType?: BottlingType; bottleNumber?: string; price?: string; purchaseDate?: string; openingDate?: string
}

export default function EditReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('ko')
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [reviewer, setReviewer] = useState('')
  const [whisky, setWhisky] = useState<Whisky>({ name: '', distillery: '', country: '', age: '', abv: '', cask: '', color: 0.7 })
  const [scores, setScores] = useState({ nose: 20, palate: 20, finish: 20, balance: 20 })
  const [notes, setNotes] = useState({ nose: '', palate: '', finish: '', overall: '' })
  const [flavors, setFlavors] = useState<{ nose: FlavorWithStrength[]; palate: FlavorWithStrength[]; finish: FlavorWithStrength[] }>({ nose: [], palate: [], finish: [] })
  const [wouldRebuy, setWouldRebuy] = useState<'yes' | 'no' | 'maybe' | undefined>()
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
        bottlingType: review.whisky.bottlingType,
        bottleNumber: review.whisky.bottleNumber,
        price: review.whisky.price,
        purchaseDate: review.whisky.purchaseDate,
        openingDate: review.whisky.openingDate,
      })
      setScores(review.scores)
      setNotes({ ...review.notes, overall: review.notes.overall || '' })
      setWouldRebuy(review.wouldRebuy)
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

  const handleCorrect = async (key: 'nose' | 'palate' | 'finish' | 'overall') => {
    const text = key === 'overall' ? notes.overall : notes[key]
    if (!text?.trim() || correcting) return
    setCorrecting(key)
    try {
      const corrected = await correctText(text, lang)
      setNotes(n => ({ ...n, [key]: corrected }))
    } finally { setCorrecting(null) }
  }

  const total = scores.nose + scores.palate + scores.finish + scores.balance

  const handleExportPNG = async () => {
    if (!cardRef.current || exporting) return
    setExporting(true)
    try {
      const dataUrl = await domToPng(cardRef.current, { scale: 2, backgroundColor: '#ffffff' })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${whisky.name || 'review'}.png`
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
      pdf.save(`${whisky.name || 'review'}.pdf`)
    } finally { setExporting(false) }
  }

  const handleSave = () => {
    storage.updateReview(params.id as string, { reviewer, whisky, scores, notes, flavors, wouldRebuy })
    alert(ui.saved[lang])
    router.push('/')
  }

  if (!loaded) return <div className="p-4 text-center text-gray-500">Loading...</div>

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

        <div ref={cardRef}>
          <ExportCard whisky={whisky} scores={scores} notes={notes} flavors={flavors} reviewer={reviewer} wouldRebuy={wouldRebuy}
            date={new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')} lang={lang} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={handleExportPNG} disabled={exporting} className="py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">PNG</button>
          <button onClick={handleExportPDF} disabled={exporting} className="py-3 bg-red-600 text-white rounded-xl disabled:opacity-50">PDF</button>
        </div>
        <button onClick={handleSave} className="w-full mt-3 py-3 bg-amber-600 text-white rounded-xl">{ui.save[lang]}</button>
      </div>
    )
  }

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
        <input type="text" value={reviewer} onChange={e => setReviewer(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
      </section>

      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.whiskyInfo[lang]}</label>
        <div className="space-y-2">
          <input type="text" placeholder={ui.whiskyName[lang] + ' *'} value={whisky.name} onChange={e => setWhisky(w => ({ ...w, name: e.target.value }))} className="w-full px-3 py-2.5 border rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder={ui.distillery[lang]} value={whisky.distillery} onChange={e => setWhisky(w => ({ ...w, distillery: e.target.value }))} className="px-3 py-2.5 border rounded-lg" />
            <select value={whisky.country} onChange={e => setWhisky(w => ({ ...w, country: e.target.value }))} className="px-3 py-2.5 border rounded-lg bg-white">
              <option value="">{ui.selectCountry[lang]}</option>
              {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name[lang]}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" placeholder={ui.age[lang]} value={whisky.age} onChange={e => setWhisky(w => ({ ...w, age: e.target.value }))} className="px-3 py-2.5 border rounded-lg" />
            <input type="text" placeholder={ui.abv[lang]} value={whisky.abv} onChange={e => setWhisky(w => ({ ...w, abv: e.target.value }))} className="px-3 py-2.5 border rounded-lg" />
            <input type="text" placeholder={ui.cask[lang]} value={whisky.cask} onChange={e => setWhisky(w => ({ ...w, cask: e.target.value }))} className="px-3 py-2.5 border rounded-lg" />
          </div>
        </div>
      </section>

      <section className="mb-5 p-3 bg-gray-50 rounded-lg border border-dashed">
        <label className="block text-xs font-medium text-gray-500 mb-2">{ui.optional[lang]}</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            {(['official', 'ib', 'single_cask'] as const).map(t => (
              <button key={t} onClick={() => setWhisky(w => ({ ...w, bottlingType: w.bottlingType === t ? undefined : t }))}
                className={`flex-1 py-2 text-xs rounded-lg border ${whisky.bottlingType === t ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white'}`}>
                {ui[t === 'single_cask' ? 'singleCask' : t][lang]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder={ui.bottleNumber[lang]} value={whisky.bottleNumber || ''} onChange={e => setWhisky(w => ({ ...w, bottleNumber: e.target.value }))} className="px-3 py-2 text-sm border rounded-lg" />
            <input type="text" placeholder={ui.price[lang]} value={whisky.price || ''} onChange={e => setWhisky(w => ({ ...w, price: e.target.value }))} className="px-3 py-2 text-sm border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">{ui.purchaseDate[lang]}</label>
              <input type="date" value={whisky.purchaseDate || ''} onChange={e => setWhisky(w => ({ ...w, purchaseDate: e.target.value }))} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
            <div>
              <label className="text-xs text-gray-500">{ui.openingDate[lang]}</label>
              <input type="date" value={whisky.openingDate || ''} onChange={e => setWhisky(w => ({ ...w, openingDate: e.target.value }))} className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
          </div>
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
            <textarea placeholder={ui[`${key}Note` as keyof typeof ui][lang]} value={notes[key]} onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))} rows={2} className="w-full px-3 py-2 pr-20 border rounded-lg resize-none text-sm" />
            {notes[key].trim() && (
              <button onClick={() => handleCorrect(key)} disabled={correcting === key} className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded disabled:opacity-50">
                <Sparkles size={12} />{correcting === key ? ui.correcting[lang] : ui.aiCorrect[lang]}
              </button>
            )}
          </div>
        </section>
      ))}

      <section className="mb-5 p-3 rounded-lg border bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">📝 {ui.overall[lang]}</label>
        <div className="relative">
          <textarea placeholder={ui.overallNote[lang]} value={notes.overall || ''} onChange={e => setNotes(n => ({ ...n, overall: e.target.value }))} rows={3} className="w-full px-3 py-2 pr-20 border rounded-lg resize-none text-sm" />
          {notes.overall?.trim() && (
            <button onClick={() => handleCorrect('overall')} disabled={correcting === 'overall'} className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded disabled:opacity-50">
              <Sparkles size={12} />{correcting === 'overall' ? ui.correcting[lang] : ui.aiCorrect[lang]}
            </button>
          )}
        </div>
        <div className="mt-3">
          <label className="text-xs text-gray-500 mb-1 block">{ui.wouldRebuy[lang]}</label>
          <div className="flex gap-2">
            {(['yes', 'no', 'maybe'] as const).map(v => (
              <button key={v} onClick={() => setWouldRebuy(wouldRebuy === v ? undefined : v)}
                className={`flex-1 py-2 text-sm rounded-lg border ${wouldRebuy === v ? 'bg-amber-100 border-amber-400 text-amber-700' : 'bg-white'}`}>
                {v === 'yes' ? '👍' : v === 'no' ? '👎' : '🤔'} {ui[v][lang]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <button onClick={() => setStep('preview')} disabled={!whisky.name} className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl disabled:opacity-50">
        {ui.preview[lang]} →
      </button>
    </div>
  )
}
