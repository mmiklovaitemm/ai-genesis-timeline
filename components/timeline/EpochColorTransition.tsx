'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Epoch } from '@/lib/types'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  epochs: Epoch[]
}

export default function EpochColorTransition({ epochs }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    const triggers: ScrollTrigger[] = []

    // Hero — no color
    ScrollTrigger.create({
      trigger: '[data-section="hero"]',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => gsap.to(overlay, { backgroundColor: 'transparent', duration: 0.8 }),
      onEnterBack: () => gsap.to(overlay, { backgroundColor: 'transparent', duration: 0.8 }),
    })

    epochs.forEach((epoch) => {
      const color = epoch.accent_color
      // Convert hex to rgba with low opacity for subtle tint
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      const rgba = `rgba(${r},${g},${b},0.06)`

      const trigger = ScrollTrigger.create({
        trigger: `[data-section="epoch-${epoch.slug}"]`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(overlay, { backgroundColor: rgba, duration: 1, ease: 'power2.out' }),
        onEnterBack: () => gsap.to(overlay, { backgroundColor: rgba, duration: 1, ease: 'power2.out' }),
      })

      triggers.push(trigger)
    })

    return () => triggers.forEach((t) => t.kill())
  }, [epochs])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-0 transition-none"
      style={{ backgroundColor: 'transparent' }}
    />
  )
}
