'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Download, Heart, Flame, Shield, Globe } from 'lucide-react'
import { triggerConfetti } from '@/lib/utils'
import type { ContentEntry } from '@/lib/types'

interface RoastCardProps {
  content: ContentEntry
  onCopy: () => void
  onDownload: () => void
}

export function RoastCard({ content, onCopy, onDownload }: RoastCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isFrench = content.language === 'fr'

  useEffect(() => {
    setIsVisible(true)
    
    // Déclencher les confettis pour les compliments
    if (content.mode === 'compliment') {
      setTimeout(() => {
        triggerConfetti()
      }, 500)
    }
  }, [content])

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'light':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'spicy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getContextLabel = (context: string) => {
    const contexts = {
      general: isFrench ? 'Général' : 'General',
      gym: 'Gym',
      gaming: 'Gaming',
      studies: isFrench ? 'Études' : 'Studies',
      auto: isFrench ? 'Auto/Moto' : 'Auto/Moto',
      tech: 'Tech',
      lifestyle: 'Lifestyle'
    }
    return contexts[context as keyof typeof contexts] || context
  }

  const getIntensityLabel = (intensity: string) => {
    const intensities = {
      light: isFrench ? 'Léger' : 'Light',
      medium: isFrench ? 'Moyen' : 'Medium',
      spicy: isFrench ? 'Épicé' : 'Spicy'
    }
    return intensities[intensity as keyof typeof intensities] || intensity
  }

  return (
    <Card 
      id="roast-card"
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${content.mode === 'compliment' ? 'border-pink-200 dark:border-pink-800' : 'border-orange-200 dark:border-orange-800'}`}
    >
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header avec badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant="outline" 
                className={`flex items-center space-x-1 ${
                  content.mode === 'compliment' 
                    ? 'border-pink-500 text-pink-500' 
                    : 'border-orange-500 text-orange-500'
                }`}
              >
                {content.mode === 'compliment' ? (
                  <Heart className="h-3 w-3" />
                ) : (
                  <Flame className="h-3 w-3" />
                )}
                <span className="text-xs font-medium">
                  {content.mode === 'compliment' 
                    ? (isFrench ? 'Compliment' : 'Compliment')
                    : (isFrench ? 'Roast' : 'Roast')
                  }
                </span>
              </Badge>

              <Badge 
                variant="outline" 
                className={getIntensityColor(content.intensity)}
              >
                <span className="text-xs font-medium">
                  {getIntensityLabel(content.intensity)}
                </span>
              </Badge>

              <Badge variant="outline" className="text-xs">
                {getContextLabel(content.context)}
              </Badge>

              {content.safeMode && (
                <Badge variant="outline" className="flex items-center space-x-1 text-green-600 border-green-500">
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {isFrench ? 'Sécurisé' : 'Safe'}
                  </span>
                </Badge>
              )}

              <Badge variant="outline" className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {content.language.toUpperCase()}
                </span>
              </Badge>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="text-center space-y-4">
            <div className="text-2xl md:text-3xl font-medium leading-relaxed">
              {content.text}
            </div>
            
            {content.target && content.target !== (isFrench ? 'toi' : 'you') && (
              <div className="text-sm text-muted-foreground">
                {isFrench ? 'Ciblé sur' : 'Targeted at'}: <span className="font-medium">{content.target}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={onCopy}
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>{isFrench ? 'Copier' : 'Copy'}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={onDownload}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>{isFrench ? 'Télécharger' : 'Download'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}




