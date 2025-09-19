'use client'

import { Heart, Code, Palette } from 'lucide-react'
import type { Language } from '@/lib/types'

interface FooterProps {
  language: Language
}

export function Footer({ language }: FooterProps) {
  const isFrench = language === 'fr'

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm">
              {isFrench 
                ? 'Fait avec' 
                : 'Made with'
              } ❤️ + v0 + shadcn/ui
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Code className="h-4 w-4" />
              <span>Next.js 14</span>
            </div>
            <div className="flex items-center space-x-1">
              <Palette className="h-4 w-4" />
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>
            {isFrench 
              ? 'Roasts fun, jamais haineux. Respectez les autres et amusez-vous bien !'
              : 'Fun roasts, never hateful. Respect others and have fun!'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}




