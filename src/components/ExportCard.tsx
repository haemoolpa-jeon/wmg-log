'use client'

import { forwardRef } from 'react'
import { FlavorRadar } from './FlavorRadar'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { FlavorWithStrength } from '@/lib/storage'

type Props = {
  whisky: { name: string; distillery: string; country?: string; age?: string; abv?: string; cask?: string; color?: number }
  scores: { nose: number; palate: number; finish: number; balance: number }
  notes: { nose: string; palate: string; finish: string }
  flavors: { nose: FlavorWithStrength[]; palate: FlavorWithStrength[]; finish: FlavorWithStrength[] }
  reviewer?: string
  date: string
  lang: Lang
}

const labels = {
  nose: { ko: '노즈', en: 'Nose' },
  palate: { ko: '팔레트', en: 'Palate' },
  finish: { ko: '피니시', en: 'Finish' },
  balance: { ko: '밸런스', en: 'Balance' },
}

// ISO country code to flag image URL (using flagcdn.com)
const getFlagUrl = (code: string) => {
  const map: Record<string, string> = { SC: 'gb-sct', IE: 'ie', US: 'us', JP: 'jp', CA: 'ca', TW: 'tw', IN: 'in', AU: 'au', KR: 'kr', FR: 'fr', DE: 'de', GB: 'gb', NZ: 'nz', SE: 'se' }
  const iso = map[code] || code.toLowerCase()
  return `https://flagcdn.com/w40/${iso}.png`
}

export const ExportCard = forwardRef<HTMLDivElement, Props>(({ whisky, scores, notes, flavors, reviewer, date, lang }, ref) => {
  const total = scores.nose + scores.palate + scores.finish + scores.balance
  const colorInfo = whiskyColors.find(c => c.value === whisky.color)
  const bgColor = colorInfo?.hex || '#D4A574'

  return (
    <div ref={ref} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '600px' }}>
      {/* Header */}
      <div style={{ backgroundColor: bgColor, padding: '32px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {whisky.country && <img src={getFlagUrl(whisky.country)} alt="" style={{ height: '20px', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />}
              <span style={{ fontSize: '15px', opacity: 0.85 }}>{date}</span>
            </div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{whisky.name}</h1>
            <p style={{ margin: 0, fontSize: '20px', opacity: 0.9 }}>{whisky.distillery}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '16px', opacity: 0.85 }}>
              {whisky.age && <span>{whisky.age}{lang === 'ko' ? '년' : 'Y'}</span>}
              {whisky.abv && <span>{whisky.abv}%</span>}
              {whisky.cask && <span>{whisky.cask}</span>}
              {colorInfo && <span>{colorInfo.value.toFixed(1)} {colorInfo.name[lang]}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '14px 24px' }}>
            <div style={{ fontSize: '52px', fontWeight: '700', lineHeight: '1' }}>{total}</div>
            <div style={{ fontSize: '15px', opacity: 0.8 }}>/100</div>
          </div>
        </div>
      </div>

      {/* Scores bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
          <div key={key} style={{ padding: '18px 12px', textAlign: 'center', borderRight: key !== 'balance' ? '1px solid #e5e7eb' : 'none' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{scores[key]}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>{labels[key][lang]}</div>
          </div>
        ))}
      </div>

      {/* N/P/F Sections */}
      {(['nose', 'palate', 'finish'] as const).map(key => {
        const flavorList = flavors[key] || []
        if (flavorList.length === 0 && !notes[key]) return null
        return (
          <div key={key} style={{ padding: '20px 28px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>{labels[key][lang]}</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              {flavorList.length > 0 && (
                <div style={{ flexShrink: 0 }}><FlavorRadar flavors={flavorList} lang={lang} size={140} /></div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {flavorList.length > 0 && (
                  <p style={{ fontSize: '14px', color: '#9ca3af', margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flavorList.map(f => getTagName(f.id, lang)).join(' / ')}
                  </p>
                )}
                {notes[key] && <p style={{ fontSize: '17px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.7' }}>{notes[key]}</p>}
              </div>
            </div>
          </div>
        )
      })}

      {/* Footer */}
      {reviewer && <div style={{ padding: '18px 28px', backgroundColor: '#fafafa', fontSize: '16px', color: '#9ca3af' }}>by {reviewer}</div>}
    </div>
  )
})

ExportCard.displayName = 'ExportCard'
