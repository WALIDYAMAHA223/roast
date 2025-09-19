'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Copy, RotateCcw, Trash2, Flame, Heart, Shield, Globe } from 'lucide-react'
import { getHistory, searchHistory, clearHistory, copyToClipboard, formatDate, formatDateEn } from '@/lib/utils'
import type { ContentEntry, Language } from '@/lib/types'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  onReuse: (entry: ContentEntry) => void
  language: Language
}

export function HistoryDrawer({ isOpen, onClose, onReuse, language }: HistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [history, setHistory] = useState<ContentEntry[]>([])
  const [filteredHistory, setFilteredHistory] = useState<ContentEntry[]>([])

  const isFrench = language === 'fr'

  useEffect(() => {
    if (isOpen) {
      const historyData = getHistory()
      setHistory(historyData)
      setFilteredHistory(historyData.filter(entry => entry.language === language))
    }
  }, [isOpen, language])

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchHistory(searchQuery, language)
      setFilteredHistory(results)
    } else {
      setFilteredHistory(history.filter(entry => entry.language === language))
    }
  }, [searchQuery, history, language])

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
    // TODO: Afficher une notification de succès
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
    setFilteredHistory([])
  }

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <RotateCcw className="h-5 w-5" />
            <span>{isFrench ? 'Historique' : 'History'}</span>
          </SheetTitle>
          <SheetDescription>
            {isFrench 
              ? 'Retrouvez vos roasts et compliments précédents'
              : 'Find your previous roasts and compliments'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isFrench ? 'Rechercher...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {filteredHistory.length} {isFrench ? 'entrée(s)' : 'entry(ies)'}
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isFrench ? 'Effacer' : 'Clear'}
              </Button>
            )}
          </div>

          {/* Liste des entrées */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <RotateCcw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {searchQuery.trim() 
                    ? (isFrench ? 'Aucun résultat trouvé' : 'No results found')
                    : (isFrench ? 'Aucun historique pour le moment' : 'No history yet')
                  }
                </p>
              </div>
            ) : (
              filteredHistory.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header avec badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`flex items-center space-x-1 ${
                            entry.mode === 'compliment' 
                              ? 'border-pink-500 text-pink-500' 
                              : 'border-orange-500 text-orange-500'
                          }`}
                        >
                          {entry.mode === 'compliment' ? (
                            <Heart className="h-3 w-3" />
                          ) : (
                            <Flame className="h-3 w-3" />
                          )}
                          <span className="text-xs">
                            {entry.mode === 'compliment' 
                              ? (isFrench ? 'Compliment' : 'Compliment')
                              : (isFrench ? 'Roast' : 'Roast')
                            }
                          </span>
                        </Badge>

                        <Badge 
                          variant="outline" 
                          className={getIntensityColor(entry.intensity)}
                        >
                          <span className="text-xs">
                            {getIntensityLabel(entry.intensity)}
                          </span>
                        </Badge>

                        <Badge variant="outline" className="text-xs">
                          {getContextLabel(entry.context)}
                        </Badge>

                        {entry.safeMode && (
                          <Badge variant="outline" className="flex items-center space-x-1 text-green-600 border-green-500">
                            <Shield className="h-3 w-3" />
                            <span className="text-xs">
                              {isFrench ? 'Sécurisé' : 'Safe'}
                            </span>
                          </Badge>
                        )}

                        <Badge variant="outline" className="flex items-center space-x-1">
                          <Globe className="h-3 w-3" />
                          <span className="text-xs">
                            {entry.language.toUpperCase()}
                          </span>
                        </Badge>
                      </div>

                      {/* Contenu */}
                      <div className="text-sm">
                        {entry.text}
                      </div>

                      {/* Métadonnées */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                          {entry.target && entry.target !== (isFrench ? 'toi' : 'you') && (
                            <span>{isFrench ? 'Cible' : 'Target'}: {entry.target}</span>
                          )}
                        </div>
                        <div>
                          {language === 'en' ? formatDateEn(entry.timestamp) : formatDate(entry.timestamp)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReuse(entry)}
                          className="flex-1"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          {isFrench ? 'Réutiliser' : 'Reuse'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(entry.text)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}




