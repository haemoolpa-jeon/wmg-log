'use client'

type Props = {
  scores: { nose: number; palate: number; finish: number; balance: number }
  size?: number
}

export function RadarChart({ scores, size = 160 }: Props) {
  const center = size / 2
  const radius = size / 2 - 20
  const labels = ['Nose', 'Palate', 'Finish', 'Balance']
  const values = [scores.nose, scores.palate, scores.finish, scores.balance]
  
  // Calculate points for each axis (4 axes, 90 degrees apart)
  const getPoint = (index: number, value: number) => {
    const angle = (index * 90 - 90) * (Math.PI / 180) // Start from top
    const r = (value / 25) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const points = values.map((v, i) => getPoint(i, v))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // Grid lines
  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {gridLevels.map(level => {
        const gridPoints = [0, 1, 2, 3].map(i => getPoint(i, level * 25))
        const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
        return <path key={level} d={gridPath} fill="none" stroke="#e5e7eb" strokeWidth="1" />
      })}

      {/* Axes */}
      {[0, 1, 2, 3].map(i => {
        const end = getPoint(i, 25)
        return <line key={i} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#d1d5db" strokeWidth="1" />
      })}

      {/* Data area */}
      <path d={pathD} fill="rgba(217, 119, 6, 0.3)" stroke="#d97706" strokeWidth="2" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#d97706" />
      ))}

      {/* Labels */}
      {labels.map((label, i) => {
        const labelPoint = getPoint(i, 28)
        const anchor = i === 1 ? 'start' : i === 3 ? 'end' : 'middle'
        const dy = i === 0 ? -5 : i === 2 ? 12 : 4
        return (
          <text
            key={i}
            x={labelPoint.x}
            y={labelPoint.y + dy}
            textAnchor={anchor}
            className="text-[10px] fill-gray-500 font-medium"
          >
            {label}
          </text>
        )
      })}

      {/* Center score */}
      <text x={center} y={center + 4} textAnchor="middle" className="text-lg font-bold fill-amber-600">
        {values.reduce((a, b) => a + b, 0)}
      </text>
    </svg>
  )
}
