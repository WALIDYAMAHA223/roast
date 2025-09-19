'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Heart, Sparkles } from 'lucide-react'
import type { Language } from '@/lib/types'

interface HeroProps {
  onGenerateRoast: () => void
  onGenerateCompliment: () => void
  language: Language
}

export function Hero({ onGenerateRoast, onGenerateCompliment, language }: HeroProps) {
  const isFrench = language === 'fr'

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            {isFrench ? 'Roast Me / Compliment Me' : 'Roast Me / Compliment Me'}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {isFrench 
              ? 'Un site fun qui roast l\'utilisateur ou lui fait un compliment, avec un design soigné'
              : 'A fun site that roasts the user or gives them a compliment, with a polished design'
            }
          </p>
          <p className="text-lg text-muted-foreground/80">
            {isFrench ? 'Roasts fun, jamais haineux.' : 'Fun roasts, never hateful.'}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-500">
                  <Flame className="h-5 w-5" />
                  <span className="font-semibold">
                    {isFrench ? 'Mode Roast' : 'Roast Mode'}
                  </span>
                </div>
                <div className="w-px h-6 bg-border"></div>
                <div className="flex items-center space-x-2 text-pink-500">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">
                    {isFrench ? 'Mode Compliment' : 'Compliment Mode'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={onGenerateRoast}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <Flame className="mr-2 h-5 w-5" />
                  {isFrench ? 'Générer un roast' : 'Generate a roast'}
                </Button>
                
                <Button 
                  onClick={onGenerateCompliment}
                  variant="outline"
                  size="lg"
                  className="border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  {isFrench ? 'Passer en Compliment' : 'Switch to Compliment'}
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>
                  {isFrench 
                    ? 'Raccourcis clavier : R (roast), C (compliment), S (historique)'
                    : 'Keyboard shortcuts: R (roast), C (compliment), S (history)'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}




