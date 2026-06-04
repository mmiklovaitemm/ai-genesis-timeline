'use client'

import { Epoch, Lang, t } from '@/lib/types'
import { useEpochAnimation } from '@/hooks/useEpochAnimation'
import QuizBlock from '@/components/interactive/QuizBlock'
import CommentsBlock from '@/components/interactive/CommentsBlock'

interface Props {
  epoch: Epoch
  lang: Lang
  index: number
}

export default function EpochSection({ epoch, lang, index }: Props) {
  const { sectionRef, headlineRef, yearsRef, descRef, contentRef, quizRef } =
    useEpochAnimation(epoch.accent_color)

  const yearLabel = epoch.year_end
    ? `${epoch.year_start} – ${epoch.year_end}`
    : `${epoch.year_start} –`

  return (
    <section
      ref={sectionRef}
      data-section={`epoch-${epoch.slug}`}
      className="epoch-section flex items-center justify-center"
      style={{ '--accent': epoch.accent_color } as React.CSSProperties}
    >
      {/* Background glow */}
      <div className="epoch-glow" />


      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-6xl px-6 md:px-12 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

        {/* LEFT — narrative + comments */}
        <div className="flex flex-col justify-center">
          <div
            ref={yearsRef}
            className="font-mono text-xs md:text-sm tracking-widest mb-4 opacity-0"
            style={{ color: epoch.accent_color }}
          >
            {yearLabel}
          </div>

          <h2
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 md:mb-6 opacity-0 leading-tight"
          >
            {t(epoch, 'title', lang)}
          </h2>

          <p
            ref={descRef}
            className="text-sm md:text-base lg:text-lg text-white/60 leading-relaxed opacity-0 mb-6"
          >
            {t(epoch, 'description', lang)}
          </p>

          <div ref={contentRef} className="opacity-0">
            <CommentsBlock
              epochSlug={epoch.slug}
              accentColor={epoch.accent_color}
              lang={lang}
            />
          </div>
        </div>

        {/* RIGHT — quiz only */}
        <div ref={quizRef}>
          <QuizBlock
            epochSlug={epoch.slug}
            accentColor={epoch.accent_color}
            lang={lang}
          />
        </div>
      </div>

    </section>
  )
}
