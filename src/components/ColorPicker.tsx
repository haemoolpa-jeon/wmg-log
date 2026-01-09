'use client'

import { whiskyColors, Lang } from '@/lib/flavors'

type Props = {
  value: number
  onChange: (value: number) => void
  lang: Lang
}

export function ColorPicker({ value, onChange, lang }: Props) {
  const colorInfo = whiskyColors.find(c => c.value === value)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-inner"
          style={{ backgroundColor: colorInfo?.hex || '#FFA000' }}
        />
        <div>
          <p className="font-medium text-sm">{colorInfo?.name[lang]}</p>
          <p className="text-xs text-gray-400">{value.toFixed(1)}</p>
        </div>
      </div>
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {whiskyColors.map(color => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-5 h-7 flex-shrink-0 rounded transition-all ${
              value === color.value ? 'ring-2 ring-amber-500 ring-offset-1 scale-110' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name[lang]}
          />
        ))}
      </div>
    </div>
  )
}
