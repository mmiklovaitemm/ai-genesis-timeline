'use client'

import { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
}

export default function LangToggle({ lang, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 p-1 text-xs font-medium">
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded-full transition-colors ${
          lang === 'en'
            ? 'bg-white text-black'
            : 'text-white/50 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange('lt')}
        className={`px-3 py-1 rounded-full transition-colors ${
          lang === 'lt'
            ? 'bg-white text-black'
            : 'text-white/50 hover:text-white'
        }`}
      >
        LT
      </button>
    </div>
  )
}
