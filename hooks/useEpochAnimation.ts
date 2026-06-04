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

      const isMobile = window.matchMedia('(max-width: 1023px)').matches

      if (isMobile) {
        // Mobile: simple fade-in on scroll, no pin, no scrub
        const items = [
          { el: yearsRef.current,    y: 0,  delay: 0 },
          { el: headlineRef.current, y: 24, delay: 0.08 },
          { el: descRef.current,     y: 20, delay: 0.16 },
          { el: contentRef.current,  y: 20, delay: 0.22 },
          { el: quizRef.current,     y: 20, delay: 0.28 },
        ]

        items.forEach(({ el, y, delay }) => {
          if (!el) return
          gsap.fromTo(
            el,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              delay,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              },
            }
          )
        })
        return
      }

      // Desktop: full pin + scrub
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

      tl.fromTo(headlineRef.current, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 0)
      tl.fromTo(yearsRef.current,    { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, 0.1)
      tl.fromTo(descRef.current,     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.25)
      tl.fromTo(contentRef.current,  { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.5)
      tl.fromTo(quizRef.current,     { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4 }, 0.35)
    },
    { scope: sectionRef, dependencies: [accentColor] }
  )

  return { sectionRef, headlineRef, yearsRef, descRef, contentRef, quizRef }
}
