'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type FlavorTag = {
  id: string
  name: string
  name_kr: string
  category: string
  color: string
}

type Props = {
  tags: FlavorTag[]
  selected: string[]
  onSelect: (ids: string[]) => void
  maxSelect?: number
}

const categories = [
  { name: 'Fruity', name_kr: '과일' },
  { name: 'Floral', name_kr: '꽃' },
  { name: 'Spicy', name_kr: '스파이시' },
  { name: 'Sweet', name_kr: '달콤' },
  { name: 'Smoky', name_kr: '스모키' },
  { name: 'Woody', name_kr: '우디' },
  { name: 'Nutty', name_kr: '견과류' },
  { name: 'Maritime', name_kr: '해양' },
]

export function FlavorSelector({ tags, selected, onSelect, maxSelect = 5 }: Props) {
  const [activeCategory, setActiveCategory] = useState(categories[0].name)

  const toggleTag = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter(s => s !== id))
    } else if (selected.length < maxSelect) {
      onSelect([...selected, id])
    }
  }

  const filteredTags = tags.filter(t => t.category === activeCategory)

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat.name
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600'
            }`}
          >
            {cat.name_kr}
          </button>
        ))}
      </div>

      {/* Flavor chips */}
      <div className="flex flex-wrap gap-2">
        {filteredTags.map(tag => {
          const isSelected = selected.includes(tag.id)
          return (
            <motion.button
              key={tag.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-neutral-900'
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name_kr}
            </motion.button>
          )
        })}
      </div>

      {/* Selection count */}
      <p className="text-sm text-neutral-500">
        {selected.length}/{maxSelect} 선택됨
      </p>
    </div>
  )
}
