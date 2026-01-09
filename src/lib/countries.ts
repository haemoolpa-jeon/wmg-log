import { Lang } from './flavors'

export const countries = [
  { code: 'SC', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: { ko: '스코틀랜드', en: 'Scotland' } },
  { code: 'IE', flag: '🇮🇪', name: { ko: '아일랜드', en: 'Ireland' } },
  { code: 'US', flag: '🇺🇸', name: { ko: '미국', en: 'USA' } },
  { code: 'JP', flag: '🇯🇵', name: { ko: '일본', en: 'Japan' } },
  { code: 'CA', flag: '🇨🇦', name: { ko: '캐나다', en: 'Canada' } },
  { code: 'TW', flag: '🇹🇼', name: { ko: '대만', en: 'Taiwan' } },
  { code: 'IN', flag: '🇮🇳', name: { ko: '인도', en: 'India' } },
  { code: 'AU', flag: '🇦🇺', name: { ko: '호주', en: 'Australia' } },
  { code: 'KR', flag: '🇰🇷', name: { ko: '한국', en: 'South Korea' } },
  { code: 'FR', flag: '🇫🇷', name: { ko: '프랑스', en: 'France' } },
  { code: 'DE', flag: '🇩🇪', name: { ko: '독일', en: 'Germany' } },
  { code: 'GB', flag: '🇬🇧', name: { ko: '영국 (기타)', en: 'UK (Other)' } },
  { code: 'NZ', flag: '🇳🇿', name: { ko: '뉴질랜드', en: 'New Zealand' } },
  { code: 'SE', flag: '🇸🇪', name: { ko: '스웨덴', en: 'Sweden' } },
  { code: 'OTHER', flag: '🌍', name: { ko: '기타', en: 'Other' } },
]

export const getCountryName = (code: string, lang: Lang): string => {
  return countries.find(c => c.code === code)?.name[lang] || code
}

export const getCountryFlag = (code: string): string => {
  return countries.find(c => c.code === code)?.flag || '🌍'
}

// LanguageTool free API for text correction
export async function correctText(text: string, lang: Lang): Promise<string> {
  if (!text.trim() || text.length < 3) return text
  
  try {
    const params = new URLSearchParams()
    params.append('text', text)
    params.append('language', lang === 'ko' ? 'ko' : 'en-US')
    
    const response = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    })
    
    if (!response.ok) {
      console.error('LanguageTool API error:', response.status)
      return text
    }
    
    const data = await response.json()
    
    if (!data.matches || data.matches.length === 0) return text
    
    let corrected = text
    // Apply corrections in reverse order to preserve positions
    const matches = [...data.matches].sort((a: any, b: any) => b.offset - a.offset)
    
    for (const match of matches) {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value
        corrected = corrected.slice(0, match.offset) + replacement + corrected.slice(match.offset + match.length)
      }
    }
    
    return corrected
  } catch (err) {
    console.error('Text correction error:', err)
    return text
  }
}
