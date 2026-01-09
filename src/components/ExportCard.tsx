'use client'

import { forwardRef } from 'react'
import { FlavorRadar } from './FlavorRadar'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
import { getCountryFlag } from '@/lib/countries'
import { FlavorWithStrength } from '@/lib/storage'

type Props = {
  whisky: {
    name: string
    distillery: string
    country?: string
    age?: string
    abv?: string
    cask?: string
    color?: number
  }
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

  // All styles inline to avoid Tailwind's lab() colors
  const styles = {
    card: { backgroundColor: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', overflow: 'hidden', fontFamily: 'system-ui, sans-serif' },
    header: { backgroundColor: '#fef3c7', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #fcd34d' },
    infoSection: { backgroundColor: '#fef9e7', padding: '12px 16px', borderBottom: '1px solid #fcd34d' },
    colorBox: { width: '48px', height: '64px', borderRadius: '8px', border: '2px solid #fcd34d', flexShrink: 0, backgroundColor: colorInfo?.hex || '#FFB300' },
    scoreSection: { padding: '12px 16px', borderBottom: '1px solid #fcd34d', backgroundColor: '#ffffff' },
    contentSection: { padding: '16px', borderBottom: '1px solid #fcd34d', backgroundColor: '#ffffff' },
    footer: { padding: '12px 16px', backgroundColor: '#fef9e7', fontSize: '12px', color: '#6b7280' },
  }

  return (
    <div ref={ref} style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontSize: '20px' }}>🥃</span>
        <span style={{ fontSize: '14px', color: '#b45309' }}>📅 {date}</span>
      </div>

      {/* Whisky Info */}
      <div style={styles.infoSection}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={styles.colorBox} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: 'bold', color: '#111827', margin: 0, fontSize: '16px' }}>
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
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#b45309' }}>{total}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={styles.scoreSection}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
          {(['nose', 'palate', 'finish', 'balance'] as const).map(key => (
            <div key={key}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#d97706' }}>{scores[key]}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>{labels[key][lang]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* N/P/F Sections */}
      {(['nose', 'palate', 'finish'] as const).map(key => {
        const flavorList = flavors[key] || []
        if (flavorList.length === 0 && !notes[key]) return null
        return (
          <div key={key} style={styles.contentSection}>
            <h3 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0', fontSize: '15px' }}>{labels[key][lang]}</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {flavorList.length > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <FlavorRadar flavors={flavorList} lang={lang} size={130} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {flavorList.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', margin: '0 0 8px 0' }}>
                    {flavorList.map(f => getTagName(typeof f === 'string' ? f : f.id, lang)).join(' / ')}
                  </p>
                )}
                {notes[key] && <p style={{ fontSize: '14px', color: '#374151', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.5' }}>{notes[key]}</p>}
              </div>
            </div>
          </div>
        )
      })}

      {/* Footer */}
      {reviewer && <div style={styles.footer}>by {reviewer}</div>}
    </div>
  )
})

ExportCard.displayName = 'ExportCard'
