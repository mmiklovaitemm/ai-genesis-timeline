'use client'

import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Epoch, Lang, t } from '@/lib/types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  epochs: Epoch[]
  lang: Lang
}

interface StoredAnswer {
  answer: string
  is_correct: boolean
  correct_option: string
}

interface GlobalStats {
  avg_score: number | null
  total_players: number
  distribution: number[]
}

const SCORE_LABELS = {
  en: ['Keep exploring', 'Good start', 'Getting there', 'Solid knowledge', 'Well done', 'Impressive', 'Expert', 'Perfect'],
  lt: ['Dar pasimokyti', 'Geras pradžia', 'Artėji', 'Solidi žinios', 'Gerai padirbėta', 'Įspūdinga', 'Ekspertas', 'Tobulai'],
}

export default function ScoreScreen({ epochs, lang }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const scoreNumRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({})
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [displayScore, setDisplayScore] = useState(0)

  const isLt = lang === 'lt'

  useEffect(() => {
    // Load answers from localStorage
    const loaded: Record<string, StoredAnswer> = {}
    for (const epoch of epochs) {
      const raw = localStorage.getItem(`quiz_${epoch.slug}`)
      if (raw) loaded[epoch.slug] = JSON.parse(raw)
    }
    setAnswers(loaded)

    fetch('/api/quiz/stats')
      .then((r) => r.json())
      .then(setStats)
  }, [epochs])

  const userScore = Object.values(answers).filter((a) => a.is_correct).length
  const answered = Object.keys(answers).length

  // Percentile: what % of players scored <= userScore
  const percentile = stats && stats.total_players > 0
    ? Math.round(
        (stats.distribution.slice(0, userScore + 1).reduce((a, b) => a + b, 0) / stats.total_players) * 100
      )
    : null

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const isMobile = window.matchMedia('(max-width: 1023px)').matches

      if (isMobile) {
        // Mobile: simple fade-in, no pin
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
        )
        gsap.fromTo(scoreNumRef.current,
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
        )
        if (dotsRef.current?.children) {
          gsap.fromTo(Array.from(dotsRef.current.children),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.08, stagger: 0.06, delay: 0.4,
              scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
          )
        }
        return
      }

      // Desktop: pin + scrub
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          scrub: 1,
        },
      })

      tl.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
      tl.fromTo(dotsRef.current?.children ?? [], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08, stagger: 0.06 }, 0.2)
      tl.fromTo(scoreNumRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.1)
    },
    { scope: sectionRef }
  )

  // Count-up animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        let start = 0
        const end = userScore
        const step = () => {
          start++
          setDisplayScore(start)
          if (start < end) setTimeout(step, 120)
        }
        if (end > 0) setTimeout(step, 600)
        observer.disconnect()
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [userScore])

  const label = SCORE_LABELS[isLt ? 'lt' : 'en'][userScore] ?? ''

  return (
    <section
      ref={sectionRef}
      data-section="score"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Subtle radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      <div ref={contentRef} className="relative z-10 text-center px-8 max-w-2xl mx-auto opacity-0">
        {/* Header */}
        <p className="font-mono text-xs tracking-[0.3em] text-white/30 uppercase mb-8">
          {isLt ? 'Rezultatai' : 'Your Results'}
        </p>

        {/* Score */}
        <div ref={scoreNumRef} className="mb-6 opacity-0">
          <span className="text-[8rem] md:text-[11rem] font-black leading-none tabular-nums"
            style={{ color: '#A78BFA' }}>
            {displayScore}
          </span>
          <span className="text-[3rem] md:text-[5rem] font-black text-white/20">/7</span>
        </div>

        {/* Label */}
        <p className="text-xl md:text-2xl font-semibold text-white/70 mb-10">{label}</p>

        {/* Epoch dots — correct/wrong */}
        <div ref={dotsRef} className="flex items-center justify-center gap-3 mb-10">
          {epochs.map((epoch) => {
            const ans = answers[epoch.slug]
            const state = !ans ? 'unanswered' : ans.is_correct ? 'correct' : 'wrong'
            return (
              <div key={epoch.slug} className="flex flex-col items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full transition-all"
                  title={t(epoch, 'title', lang)}
                  style={{
                    background: state === 'correct'
                      ? epoch.accent_color
                      : state === 'wrong'
                      ? '#EF444460'
                      : 'rgba(255,255,255,0.1)',
                    boxShadow: state === 'correct' ? `0 0 10px ${epoch.accent_color}80` : 'none',
                  }}
                />
                <span className="text-[9px] font-mono text-white/20 max-w-[48px] text-center leading-tight">
                  {epoch.year_start}
                </span>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-sm">
          {answered < 7 && (
            <span className="text-white/30 font-mono text-xs">
              {answered}/7 {isLt ? 'atsakyta' : 'answered'}
            </span>
          )}
          {stats && stats.total_players > 1 && percentile !== null && (
            <span className="text-white/40 font-mono text-xs">
              {isLt
                ? `Geriau nei ${percentile}% žaidėjų`
                : `Better than ${percentile}% of players`}
            </span>
          )}
          {stats && stats.avg_score !== null && (
            <span className="text-white/25 font-mono text-xs">
              {isLt ? `Vidurkis: ${stats.avg_score}/7` : `Avg: ${stats.avg_score}/7`}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
