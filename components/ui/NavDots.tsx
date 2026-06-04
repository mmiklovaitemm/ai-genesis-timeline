'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Epoch, Lang, t } from '@/lib/types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  epochs: Epoch[]
  lang: Lang
}

export default function NavDots({ epochs, lang }: Props) {
  const [active, setActive] = useState<number>(-1) // -1 = hero
  const [hovered, setHovered] = useState<number | null>(null)
  const triggersRef = useRef<ScrollTrigger[]>([])

  useEffect(() => {
    // Hero trigger
    const heroTrigger = ScrollTrigger.create({
      trigger: '[data-section="hero"]',
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => { if (self.isActive) setActive(-1) },
    })

    // Epoch triggers
    triggersRef.current = epochs.map((epoch, i) =>
      ScrollTrigger.create({
        trigger: `[data-section="epoch-${epoch.slug}"]`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => { if (self.isActive) setActive(i) },
      })
    )

    return () => {
      heroTrigger.kill()
      triggersRef.current.forEach((t) => t.kill())
    }
  }, [epochs])

  const scrollTo = (target: string) => {
    const el = document.querySelector(target)
    if (!el) return
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: el, offsetY: 0 },
      ease: 'power3.inOut',
    })
  }

  const dots = [
    { label: 'Intro', color: '#ffffff', key: 'hero', target: '[data-section="hero"]' },
    ...epochs.map((epoch, i) => ({
      label: t(epoch, 'title', lang),
      color: epoch.accent_color,
      key: epoch.slug,
      target: `[data-section="epoch-${epoch.slug}"]`,
      index: i,
    })),
  ]

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3">
      {dots.map((dot, i) => {
        const isActive = i === 0 ? active === -1 : active === i - 1
        const isHovered = hovered === i

        return (
          <button
            key={dot.key}
            onClick={() => scrollTo(dot.target)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-3 group"
            aria-label={dot.label}
          >
            {/* Label */}
            <span
              className="text-[11px] font-mono tracking-wide transition-all duration-200 whitespace-nowrap"
              style={{
                color: isActive || isHovered ? dot.color : 'transparent',
                opacity: isActive || isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
              }}
            >
              {dot.label}
            </span>

            {/* Dot */}
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? '10px' : '6px',
                height: isActive ? '10px' : '6px',
                background: isActive || isHovered ? dot.color : 'rgba(255,255,255,0.2)',
                boxShadow: isActive ? `0 0 8px ${dot.color}` : 'none',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
