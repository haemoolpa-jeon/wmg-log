'use client'

import { forwardRef } from 'react'
import { FlavorRadar } from './FlavorRadar'
import { getTagName, whiskyColors, Lang } from '@/lib/flavors'
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
    card: { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    header: { backgroundColor: '#f8f4e8', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid #e5e7eb' },
    infoSection: { backgroundColor: '#fefcf6', padding: '16px 20px', borderBottom: '1px solid #e5e7eb' },
    colorBox: { width: '52px', height: '68px', borderRadius: '10px', border: '3px solid #ffffff', flexShrink: 0, backgroundColor: colorInfo?.hex || '#FFB300', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    scoreSection: { padding: '14px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' },
    contentSection: { padding: '16px 20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' },
    footer: { padding: '14px 20px', backgroundColor: '#fafafa', fontSize: '13px', color: '#9ca3af' },
  }

  return (
    <div ref={ref} style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '500' }}>📅 {date}</span>
      </div>

      {/* Whisky Info */}
      <div style={styles.infoSection}>
        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={styles.colorBox} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontWeight: '600', color: '#1f2937', margin: 0, fontSize: '17px' }}>
                  {whisky.country && <span style={{ marginRight: '6px', fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', color: '#6b7280' }}>{whisky.country}</span>}
                  {whisky.name}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0' }}>{whisky.distillery}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                  {whisky.age && <span>{whisky.age}{lang === 'ko' ? '년' : 'Y'}</span>}
                  {whisky.abv && <span>{whisky.abv}%</span>}
                  {whisky.cask && <span>{whisky.cask}</span>}
                  <span>{colorInfo?.name[lang]}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#d97706', lineHeight: '1' }}>{total}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>/100</div>
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
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#f59e0b' }}>{scores[key]}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels[key][lang]}</div>
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
            <h3 style={{ fontWeight: '600', color: '#374151', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels[key][lang]}</h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {flavorList.length > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <FlavorRadar flavors={flavorList} lang={lang} size={120} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {flavorList.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {flavorList.map(f => getTagName(typeof f === 'string' ? f : f.id, lang)).join(' / ')}
                  </p>
                )}
                {notes[key] && <p style={{ fontSize: '13px', color: '#4b5563', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.6' }}>{notes[key]}</p>}
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
