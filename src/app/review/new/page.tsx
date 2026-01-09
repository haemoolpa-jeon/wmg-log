'use client'

import { useState, useRef, useEffect } from 'react'
import { FlavorWheel } from '@/components/FlavorWheel'
import { ColorPicker } from '@/components/ColorPicker'
import { FlavorRadar } from '@/components/FlavorRadar'
import { flavorData, getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { countries, getCountryFlag, correctText } from '@/lib/countries'
import { storage, FlavorWithStrength } from '@/lib/storage'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Download, Image, FileText, ChevronLeft, RotateCcw, Globe, Sparkles } from 'lucide-react'

const labels = {
  nose: { ko: '노즈', en: 'Nose' },
  palate: { ko: '팔레트', en: 'Palate' },
  finish: { ko: '피니시', en: 'Finish' },
  balance: { ko: '밸런스', en: 'Balance' },
}

const ui = {
  writeReview: { ko: '리뷰 작성', en: 'Write Review' },
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
  rating: { ko: '평점', en: 'Rating' },
  preview: { ko: '미리보기', en: 'Preview' },
  edit: { ko: '수정', en: 'Edit' },
  newReview: { ko: '새로 작성', en: 'New' },
  saveLocal: { ko: '로컬에 저장', en: 'Save' },
  saved: { ko: '저장되었습니다!', en: 'Saved!' },
  noseNote: { ko: '향에 대한 노트...', en: 'Aroma notes...' },
  palateNote: { ko: '맛에 대한 노트...', en: 'Taste notes...' },
  finishNote: { ko: '여운에 대한 노트...', en: 'Finish notes...' },
  aiCorrect: { ko: 'AI 교정', en: 'AI Fix' },
  correcting: { ko: '교정 중...', en: 'Fixing...' },
}

export default function NewReviewPage() {
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
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedLang = localStorage.getItem('wmg-lang') as Lang
    if (savedLang) setLang(savedLang)
    const savedReviewer = localStorage.getItem('wmg-reviewer')
    if (savedReviewer) setReviewer(savedReviewer)
  }, [])

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
    if (!cardRef.current) return
    setExporting(true)
    const canvas = await html2canvas(cardRef.current, { 
      scale: 2, 
      backgroundColor: '#fffbeb',
      useCORS: true,
      logging: false,
    })
    const link = document.createElement('a')
    link.download = `${whisky.name || 'review'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    setExporting(false)
  }

  const handleExportPDF = async () => {
    if (!cardRef.current) return
    setExporting(true)
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
    pdf.save(`${whisky.name || 'review'}.pdf`)
    setExporting(false)
  }

  const handleSave = () => {
    storage.saveReview({ reviewer, whisky, scores, notes, flavors })
    alert(ui.saved[lang])
  }

  const reset = () => {
    setWhisky({ name: '', distillery: '', country: '', age: '', abv: '', cask: '', color: 0.7 })
    setScores({ nose: 20, palate: 20, finish: 20, balance: 20 })
    setNotes({ nose: '', palate: '', finish: '' })
    setFlavors({ nose: [], palate: [], finish: [] })
    setStep('form')
  }

  // Preview Card
  if (step === 'preview') {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setStep('form')} className="flex items-center gap-1 text-gray-600">
            <ChevronLeft size={20} /> {ui.edit[lang]}
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="flex items-center gap-1 text-gray-500 text-sm border px-2 py-1 rounded">
              <Globe size={14} /> {lang.toUpperCase()}
            </button>
            <button onClick={reset} className="flex items-center gap-1 text-gray-500 text-sm">
              <RotateCcw size={14} /> {ui.newReview[lang]}
            </button>
          </div>
        </div>

        {/* Export Card - using inline styles for html2canvas compatibility */}
        <div ref={cardRef} style={{ backgroundColor: '#fffbeb' }} className="rounded-xl border border-amber-200 overflow-hidden mb-4">
          <div style={{ backgroundColor: '#fef3c7' }} className="px-4 py-3 flex items-center justify-between border-b border-amber-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥃</span>
              <span className="font-bold" style={{ color: '#92400e' }}>WmG</span>
            </div>
            <div className="text-sm" style={{ color: '#b45309' }}>📅 {new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US')}</div>
          </div>

          {/* Whisky Info with Color */}
          <div style={{ backgroundColor: '#fef9e7' }} className="px-4 py-3 border-b border-amber-200">
            <div className="flex gap-3">
              <div 
                className="w-12 h-16 rounded-lg flex-shrink-0"
                style={{ backgroundColor: colorInfo?.hex, border: '2px solid #fcd34d' }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold" style={{ color: '#111827' }}>
                      {whisky.country && <span className="mr-1">{getCountryFlag(whisky.country)}</span>}
                      {whisky.name}
                    </p>
                    <p className="text-sm" style={{ color: '#4b5563' }}>{whisky.distillery}</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-1" style={{ color: '#6b7280' }}>
                      {whisky.age && <span>{whisky.age}{lang === 'ko' ? '년' : 'Y'}</span>}
                      {whisky.abv && <span>{whisky.abv}%</span>}
                      {whisky.cask && <span>{whisky.cask}</span>}
                      <span>{colorInfo?.name[lang]}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: '#b45309' }}>{total}</div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scores */}
          <div className="px-4 py-3 border-b border-amber-200" style={{ backgroundColor: '#ffffff' }}>
            <div className="grid grid-cols-4 gap-2 text-center">
              {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
                <div key={key}>
                  <div className="text-lg font-bold" style={{ color: '#d97706' }}>{scores[key]}</div>
                  <div className="text-[10px]" style={{ color: '#6b7280' }}>{labels[key][lang]}</div>
                </div>
              ))}
            </div>
          </div>

          {(['nose', 'palate', 'finish'] as const).map(key => (
            (flavors[key].length > 0 || notes[key]) && (
              <div key={key} className="px-4 py-4 border-b border-amber-200" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold" style={{ color: '#1f2937' }}>{labels[key][lang]}</h3>
                </div>
                <div className="flex gap-4">
                  {flavors[key].length > 0 && (
                    <div className="flex-shrink-0">
                      <FlavorRadar flavors={flavors[key]} lang={lang} size={130} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {flavors[key].length > 0 && (
                      <p className="text-xs mb-2" style={{ color: '#6b7280' }}>
                        {flavors[key].map(f => getTagName(f.id, lang)).join(' / ')}
                      </p>
                    )}
                    {notes[key] && <p className="text-sm whitespace-pre-wrap" style={{ color: '#374151' }}>{notes[key]}</p>}
                  </div>
                </div>
              </div>
            )
          ))}

          {/* Footer with reviewer */}
          <div className="px-4 py-3 flex items-center justify-between text-xs" style={{ backgroundColor: '#fef9e7', color: '#6b7280' }}>
            {reviewer && <span>by {reviewer}</span>}
            <span className="ml-auto">WmG Review</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <button onClick={handleExportPNG} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">
            <Image size={18} /> PNG
          </button>
          <button onClick={handleExportPDF} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50">
            <FileText size={18} /> PDF
          </button>
        </div>
        <button onClick={handleSave} className="w-full py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700">
          <Download size={18} className="inline mr-2" /> {ui.saveLocal[lang]}
        </button>
      </div>
    )
  }

  // Form
  return (
    <div className="max-w-2xl mx-auto p-4 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">{ui.writeReview[lang]}</h1>
        <button onClick={toggleLang} className="flex items-center gap-1 text-gray-500 text-sm border px-2 py-1 rounded">
          <Globe size={14} /> {lang === 'ko' ? 'EN' : '한국어'}
        </button>
      </div>

      {/* Reviewer */}
      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.reviewer[lang]}</label>
        <input
          type="text"
          placeholder={ui.reviewerPlaceholder[lang]}
          value={reviewer}
          onChange={e => setReviewer(e.target.value)}
          className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </section>

      {/* Whisky Info */}
      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.whiskyInfo[lang]}</label>
        <div className="space-y-2">
          <input
            type="text"
            placeholder={ui.whiskyName[lang] + ' *'}
            value={whisky.name}
            onChange={e => setWhisky(w => ({ ...w, name: e.target.value }))}
            className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={ui.distillery[lang]}
              value={whisky.distillery}
              onChange={e => setWhisky(w => ({ ...w, distillery: e.target.value }))}
              className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={whisky.country}
              onChange={e => setWhisky(w => ({ ...w, country: e.target.value }))}
              className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="">{ui.selectCountry[lang]}</option>
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name[lang]}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={ui.age[lang]}
              value={whisky.age}
              onChange={e => setWhisky(w => ({ ...w, age: e.target.value }))}
              className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder={ui.abv[lang]}
              value={whisky.abv}
              onChange={e => setWhisky(w => ({ ...w, abv: e.target.value }))}
              className="px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <input
            type="text"
            placeholder={ui.cask[lang] + ' (ex: Sherry, Bourbon, Port...)'}
            value={whisky.cask}
            onChange={e => setWhisky(w => ({ ...w, cask: e.target.value }))}
            className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </section>

      {/* Color */}
      <section className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">{ui.color[lang]}</label>
        <ColorPicker value={whisky.color} onChange={v => setWhisky(w => ({ ...w, color: v }))} lang={lang} />
      </section>

      {/* Scores */}
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
              <input
                type="range"
                min={0}
                max={25}
                value={scores[key]}
                onChange={e => setScores(s => ({ ...s, [key]: +e.target.value }))}
                className="w-full accent-amber-600 h-2"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tasting sections */}
      {(['nose', 'palate', 'finish'] as const).map((key, i) => (
        <section key={key} className={`mb-4 p-3 rounded-lg border ${
          i === 0 ? 'bg-red-50/50 border-red-100' : i === 1 ? 'bg-amber-50/50 border-amber-100' : 'bg-orange-50/50 border-orange-100'
        }`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {i === 0 ? '👃' : i === 1 ? '👅' : '✨'} {labels[key][lang]}
          </label>
          <FlavorWheel
            categories={flavorData}
            selected={flavors[key]}
            onSelect={f => setFlavors(prev => ({ ...prev, [key]: f }))}
            maxSelect={10}
            lang={lang}
          />
          <div className="relative mt-2">
            <textarea
              placeholder={ui[`${key}Note` as keyof typeof ui][lang]}
              value={notes[key]}
              onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm"
            />
            {notes[key].trim() && (
              <button
                onClick={() => handleCorrect(key)}
                disabled={correcting === key}
                className="absolute right-2 top-2 flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
              >
                <Sparkles size={12} />
                {correcting === key ? ui.correcting[lang] : ui.aiCorrect[lang]}
              </button>
            )}
          </div>
        </section>
      ))}

      <button
        onClick={() => setStep('preview')}
        disabled={!whisky.name}
        className="w-full py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50"
      >
        {ui.preview[lang]} →
      </button>
    </div>
  )
}
