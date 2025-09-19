"use client"

import { useEffect, useState } from "react"
import { Flame, Heart, Sparkles, Zap, Star } from "lucide-react"

interface ParticleBackgroundProps {
  mode: "roast" | "compliment"
}

export function ParticleBackground({ mode }: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    delay: number
    icon: React.ReactNode
  }>>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      const particleCount = 8
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 100
        const y = Math.random() * 100
        const size = Math.random() * 20 + 10
        const delay = Math.random() * 8
        
        let icon
        if (mode === "roast") {
          const icons = [<Flame key="flame" />, <Zap key="zap" />, <Star key="star" />]
          icon = icons[Math.floor(Math.random() * icons.length)]
        } else {
          const icons = [<Heart key="heart" />, <Sparkles key="sparkles" />, <Star key="star" />]
          icon = icons[Math.floor(Math.random() * icons.length)]
        }
        
        newParticles.push({
          id: i,
          x,
          y,
          size,
          delay,
          icon
        })
      }
      
      setParticles(newParticles)
    }

    generateParticles()
    
    // Regenerate particles every 15 seconds
    const interval = setInterval(generateParticles, 15000)
    
    return () => clearInterval(interval)
  }, [mode])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            color: mode === "roast" ? "rgba(220, 38, 38, 0.4)" : "rgba(16, 185, 129, 0.4)"
          }}
        >
          {particle.icon}
        </div>
      ))}
    </div>
  )
}
