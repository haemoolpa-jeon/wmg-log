'use client'

import { useState } from 'react'
import { categoryIcons, getFlavorIcon, Lang } from '@/lib/flavors'
import { FlavorWithStrength } from '@/lib/storage'

type FlavorTag = { id: string; name: { ko: string; en: string }; k?: boolean }
type SubCategory = { id: string; name: { ko: string; en: string }; tags: FlavorTag[] }
type FlavorCategory = { category_id: string; name: { ko: string; en: string }; sub_categories: SubCategory[] }

const categoryColors: Record<string, string> = {
  cereal: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  fruity: 'bg-red-50 border-red-200 hover:bg-red-100',
  floral: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
  peaty: 'bg-slate-100 border-slate-300 hover:bg-slate-200',
  winey: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  woody: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
  feinty: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  sulphury: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
}

type Props = {
  categories: FlavorCategory[]
  selected: FlavorWithStrength[]
  onSelect: (flavors: FlavorWithStrength[]) => void
  maxSelect?: number
  lang: Lang
}

export function FlavorWheel({ categories, selected, onSelect, maxSelect = 10, lang }: Props) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const getTagName = (tagId: string): string => {
    for (const cat of categories) {
      for (const sub of cat.sub_categories) {
        const tag = sub.tags.find(t => t.id === tagId)
        if (tag) return tag.name[lang]
      }
    }
    return tagId
  }

  const toggleTag = (tagId: string) => {
    const existing = selected.find(f => f.id === tagId)
    if (existing) {
      onSelect(selected.filter(f => f.id !== tagId))
    } else if (selected.length < maxSelect) {
      onSelect([...selected, { id: tagId, strength: 3 }])
    }
  }

  const updateStrength = (tagId: string, strength: number) => {
    onSelect(selected.map(f => f.id === tagId ? { ...f, strength } : f))
  }

  return (
    <div className="space-y-2">
      {/* Selected flavors with strength slider */}
      {selected.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {selected.map(flavor => (
            <div key={flavor.id} className="flex items-center gap-2 bg-white rounded-lg border p-2">
              <span className="text-lg">{getFlavorIcon(flavor.id)}</span>
              <span className="text-sm font-medium flex-1 min-w-0 truncate">{getTagName(flavor.id)}</span>
              <input
                type="range"
                min={1}
                max={5}
                value={flavor.strength}
                onChange={e => updateStrength(flavor.id, +e.target.value)}
                className="w-16 accent-amber-500"
              />
              <span className="text-xs text-amber-600 w-4">{flavor.strength}</span>
              <button
                onClick={() => toggleTag(flavor.id)}
                className="text-gray-400 hover:text-red-500 text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Category grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {categories.map(cat => (
          <button
            key={cat.category_id}
            onClick={() => setExpandedCategory(expandedCategory === cat.category_id ? null : cat.category_id)}
            className={`p-1.5 rounded-lg border text-center transition-all ${
              expandedCategory === cat.category_id
                ? 'ring-2 ring-amber-400 ' + categoryColors[cat.category_id]
                : categoryColors[cat.category_id]
            }`}
          >
            <div className="text-base">{categoryIcons[cat.category_id]}</div>
            <div className="text-[8px] text-gray-600 truncate">{cat.name[lang]}</div>
          </button>
        ))}
      </div>

      {/* Expanded tags with icons */}
      {expandedCategory && (
        <div className="bg-white rounded-lg border p-2 space-y-2 max-h-48 overflow-y-auto">
          {categories
            .find(c => c.category_id === expandedCategory)
            ?.sub_categories.map(sub => (
              <div key={sub.id}>
                <p className="text-[10px] text-gray-500 mb-1">{sub.name[lang]}</p>
                <div className="flex flex-wrap gap-1">
                  {sub.tags.map(tag => {
                    const isSelected = selected.some(f => f.id === tag.id)
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        disabled={!isSelected && selected.length >= maxSelect}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 disabled:opacity-40'
                        }`}
                      >
                        <span>{getFlavorIcon(tag.id)}</span>
                        <span>{tag.name[lang]}</span>
                        {tag.k && <span className="text-[8px] opacity-60">🇰🇷</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
