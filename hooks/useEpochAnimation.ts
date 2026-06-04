'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useEpochAnimation(accentColor: string) {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const yearsRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const quizRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      // Pin the section while animating content
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
        },
      })

      // Headline flies in from left
      tl.fromTo(
        headlineRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0
      )

      // Years fade in with scale
      tl.fromTo(
        yearsRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 },
        0.1
      )

      // Description lines appear
      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.25
      )

      // Comments block slides up
      tl.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.5
      )

      // Quiz slides in from right
      tl.fromTo(
        quizRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0.35
      )
    },
    { scope: sectionRef, dependencies: [accentColor] }
  )

  return { sectionRef, headlineRef, yearsRef, descRef, contentRef, quizRef }
}
