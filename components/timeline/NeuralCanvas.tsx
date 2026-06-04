'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulse: number
  pulseSpeed: number
}

export default function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cvs = canvas
    const ctx = cvs.getContext('2d')!
    let animId: number

    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    const NODE_COUNT = isMobile ? 28 : 65
    const MAX_DIST = isMobile ? 120 : 160

    const resize = () => {
      cvs.width = window.innerWidth
      cvs.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.8,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.015 + Math.random() * 0.025,
    }))

    function draw() {
      ctx.clearRect(0, 0, cvs.width, cvs.height)

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist >= MAX_DIST) continue

          const alpha = (1 - dist / MAX_DIST) * 0.25
          ctx.beginPath()
          ctx.strokeStyle = `rgba(74,144,217,${alpha})`
          ctx.lineWidth = 0.6
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      // Nodes
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        node.pulse += node.pulseSpeed

        if (node.x < 0 || node.x > cvs.width) node.vx *= -1
        if (node.y < 0 || node.y > cvs.height) node.vy *= -1

        const r = node.radius + Math.sin(node.pulse) * 0.6

        // Skip expensive radial gradient on mobile
        if (!isMobile) {
          const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 5)
          grad.addColorStop(0, 'rgba(74,144,217,0.15)')
          grad.addColorStop(1, 'rgba(74,144,217,0)')
          ctx.beginPath()
          ctx.arc(node.x, node.y, r * 5, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(74,144,217,0.9)'
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
