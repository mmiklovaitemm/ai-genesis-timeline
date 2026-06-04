'use client'

import { useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Epoch, Lang } from '@/lib/types'
import HeroSection from './HeroSection'
import EpochSection from './EpochSection'
import EpochColorTransition from './EpochColorTransition'
import ScoreScreen from './ScoreScreen'
import LangToggle from '@/components/ui/LangToggle'
import NavDots from '@/components/ui/NavDots'

gsap.registerPlugin(ScrollToPlugin)

interface Props {
  epochs: Epoch[]
}

export default function TimelineClient({ epochs }: Props) {
  const [lang, setLang] = useState<Lang>('en')

  return (
    <>
      {/* Fixed UI */}
      <div className="fixed top-6 right-6 z-50">
        <LangToggle lang={lang} onChange={setLang} />
      </div>
      <NavDots epochs={epochs} lang={lang} />

      {/* Global background color transition */}
      <EpochColorTransition epochs={epochs} />

      {/* Content */}
      <HeroSection lang={lang} />
      {epochs.map((epoch, i) => (
        <EpochSection key={epoch.id} epoch={epoch} lang={lang} index={i} />
      ))}

      <ScoreScreen epochs={epochs} lang={lang} />
    </>
  )
}
