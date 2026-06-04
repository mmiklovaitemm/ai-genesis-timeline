'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NeuralCanvas from './NeuralCanvas'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  lang: 'en' | 'lt'
}

export default function HeroSection({ lang }: Props) {
  const isLt = lang === 'lt'
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollPromptRef = useRef<HTMLDivElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const isMobile = window.matchMedia('(max-width: 1023px)').matches

      // Entry animation — same on all devices
      const tl = gsap.timeline({ delay: 0.3 })
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }
      )
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
        '-=0.8'
      )
      tl.fromTo(scrollPromptRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7 },
        '-=0.3'
      )

      if (isMobile) {
        // Mobile: simple fade-out on scroll, no 3D transforms
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=50%',
            scrub: 1,
          },
          opacity: 0,
          y: -20,
          ease: 'none',
        })
        return
      }

      // Desktop: cinematic scale + z tunnel effect
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=70%',
          scrub: 1.2,
        },
        scale: 1.2,
        opacity: 0,
        z: 120,
        transformPerspective: 900,
        ease: 'none',
      })

      gsap.to(canvasWrapRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=90%',
          scrub: 1,
        },
        opacity: 0,
        ease: 'none',
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      data-section="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div ref={canvasWrapRef} className="absolute inset-0">
        <NeuralCanvas />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" />

      <div ref={contentRef} className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <p className="font-mono text-xs tracking-[0.35em] text-[#4A90D9] uppercase mb-6 md:mb-8">
          {isLt ? '1950 — Dabar' : '1950 — Present'}
        </p>

        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 opacity-0"
        >
          AI
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90D9] via-[#8B5CF6] to-[#4A90D9] bg-size-200 animate-gradient">
            Genesis
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-white/40 text-sm md:text-base lg:text-lg max-w-xs sm:max-w-sm mx-auto leading-relaxed mb-12 md:mb-20 opacity-0"
        >
          {isLt
            ? 'Dirbtinio intelekto istorija — nuo pirmosios svajonės iki šių dienų'
            : 'The history of artificial intelligence — from the first dream to the present moment'}
        </p>

        <div
          ref={scrollPromptRef}
          className="flex flex-col items-center gap-3 text-white/25 text-[11px] font-mono tracking-widest uppercase opacity-0"
        >
          <span>{isLt ? 'Slinkti žemyn' : 'Scroll to begin'}</span>
          <div className="w-px h-10 md:h-14 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
