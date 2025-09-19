"use client"

import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const glitch = () => {
    setIsGlitching(true)
    let iterations = 0
    const maxIterations = 10

    const interval = setInterval(() => {
      setGlitchText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return text[index]
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join(""),
      )

      if (iterations >= text.length) {
        clearInterval(interval)
        setGlitchText(text)
        setIsGlitching(false)
      }

      iterations += 1 / 3
    }, 30)
  }

  useEffect(() => {
    setGlitchText(text)
    setIsGlitching(false)

    const timer = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance every 3 seconds
        glitch()
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [text])

  return (
    <span
      className={`${className} ${isGlitching ? "animate-pulse" : ""}`}
      style={{
        textShadow: isGlitching ? "0.05em 0 0 #ff0000, -0.05em -0.025em 0 #00ff00, 0.025em 0.05em 0 #0000ff" : "none",
      }}
    >
      {glitchText}
    </span>
  )
}


