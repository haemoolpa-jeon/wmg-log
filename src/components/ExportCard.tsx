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

export const ExportCard = forwardRef<HTMLDivElement, Props>(({ whisky, scores, notes, flavors, reviewer, date, lang }, ref) => {
  const total = scores.nose + scores.palate + scores.finish + scores.balance
  const colorInfo = whiskyColors.find(c => c.value === whisky.color)
  const bgColor = colorInfo?.hex || '#D4A574'

  return (
    <div ref={ref} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Header with whisky color background */}
      <div style={{ backgroundColor: bgColor, padding: '20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {whisky.country && <span style={{ fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '4px' }}>{whisky.country}</span>}
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{date}</span>
            </div>
            <h1 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{whisky.name}</h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{whisky.distillery}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', opacity: 0.85 }}>
              {whisky.age && <span>{whisky.age}{lang === 'ko' ? '년' : 'Y'}</span>}
              {whisky.abv && <span>{whisky.abv}%</span>}
              {whisky.cask && <span>{whisky.cask}</span>}
              {colorInfo && <span>{colorInfo.name[lang]}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '8px 16px' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', lineHeight: '1' }}>{total}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>/100</div>
          </div>
        </div>
      </div>

      {/* Scores bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
        {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
          <div key={key} style={{ padding: '12px 8px', textAlign: 'center', borderRight: key !== 'balance' ? '1px solid #e5e7eb' : 'none' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#d97706' }}>{scores[key]}</div>
            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>{labels[key][lang]}</div>
          </div>
        ))}
      </div>

      {/* N/P/F Sections */}
      {(['nose', 'palate', 'finish'] as const).map(key => {
        const flavorList = flavors[key] || []
        if (flavorList.length === 0 && !notes[key]) return null
        return (
          <div key={key} style={{ padding: '14px 16px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>{labels[key][lang]}</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {flavorList.length > 0 && (
                <div style={{ flexShrink: 0 }}><FlavorRadar flavors={flavorList} lang={lang} size={100} /></div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {flavorList.length > 0 && (
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flavorList.map(f => getTagName(f.id, lang)).join(' / ')}
                  </p>
                )}
                {notes[key] && <p style={{ fontSize: '13px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.5' }}>{notes[key]}</p>}
              </div>
            </div>
          </div>
        )
      })}

      {/* Footer */}
      {reviewer && <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', fontSize: '12px', color: '#9ca3af' }}>by {reviewer}</div>}
    </div>
  )
})

ExportCard.displayName = 'ExportCard'
