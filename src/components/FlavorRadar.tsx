'use client'

import { getTagName, Lang } from '@/lib/flavors'
import { FlavorWithStrength } from '@/lib/storage'

type Props = {
  flavors: FlavorWithStrength[]
  lang: Lang
  size?: number
}

export function FlavorRadar({ flavors, lang, size = 140 }: Props) {
  if (flavors.length === 0) return null
  
  const center = size / 2
  const radius = size / 2 - 25
  const count = Math.min(flavors.length, 10)
  
  const getPoint = (index: number, strength: number) => {
    const angle = (index * (360 / count) - 90) * (Math.PI / 180)
    const r = (strength / 5) * radius // strength 1-5 maps to radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const points = flavors.slice(0, count).map((f, i) => getPoint(i, f.strength))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {[0.2, 0.4, 0.6, 0.8, 1].map(level => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={radius * level}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {flavors.slice(0, count).map((_, i) => {
        const end = getPoint(i, 5)
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth="1" />
      })}

      {/* Data area */}
      <path d={pathD} fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="2" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill="#ef4444" />
      ))}

      {/* Labels */}
      {flavors.slice(0, count).map((f, i) => {
        const labelPoint = getPoint(i, 6.2)
        return (
          <text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '8px', fill: '#6b7280' }}
          >
            {getTagName(f.id, lang)}
          </text>
        )
      })}
    </svg>
  )
}
