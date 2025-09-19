'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Target, 
  Zap, 
  Shield, 
  History, 
  Copy, 
  Download,
  Flame,
  Heart
} from 'lucide-react'
import type { GenerationSettings, Mode, Intensity, Context, Language } from '@/lib/types'

interface ControlsPanelProps {
  settings: GenerationSettings
  onSettingsChange: (settings: GenerationSettings) => void
  onGenerate: (mode?: Mode) => void
  onOpenHistory: () => void
  onCopy: () => void
  onDownload: () => void
  hasContent: boolean
}

export function ControlsPanel({
  settings,
  onSettingsChange,
  onGenerate,
  onOpenHistory,
  onCopy,
  onDownload,
  hasContent
}: ControlsPanelProps) {
  const isFrench = settings.language === 'fr'

  const intensityOptions = [
    { value: 'light', label: isFrench ? 'Léger' : 'Light', icon: '🟢' },
    { value: 'medium', label: isFrench ? 'Moyen' : 'Medium', icon: '🟡' },
    { value: 'spicy', label: isFrench ? 'Épicé' : 'Spicy', icon: '🔴' }
  ]

  const contextOptions = [
    { value: 'general', label: isFrench ? 'Général' : 'General' },
    { value: 'gym', label: isFrench ? 'Gym' : 'Gym' },
    { value: 'gaming', label: isFrench ? 'Gaming' : 'Gaming' },
    { value: 'studies', label: isFrench ? 'Études' : 'Studies' },
    { value: 'auto', label: isFrench ? 'Auto/Moto' : 'Auto/Moto' },
    { value: 'tech', label: isFrench ? 'Tech' : 'Tech' },
    { value: 'lifestyle', label: isFrench ? 'Lifestyle' : 'Lifestyle' }
  ]

  const handleSettingChange = (key: keyof GenerationSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>{isFrench ? 'Contrôles' : 'Controls'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {settings.mode === 'roast' ? (
              <Flame className="h-5 w-5 text-orange-500" />
            ) : (
              <Heart className="h-5 w-5 text-pink-500" />
            )}
            <span className="font-medium">
              {isFrench ? 'Mode' : 'Mode'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={settings.mode === 'roast' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSettingChange('mode', 'roast')}
            >
              <Flame className="mr-1 h-4 w-4" />
              {isFrench ? 'Roast' : 'Roast'}
            </Button>
            <Button
              variant={settings.mode === 'compliment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSettingChange('mode', 'compliment')}
            >
              <Heart className="mr-1 h-4 w-4" />
              {isFrench ? 'Compliment' : 'Compliment'}
            </Button>
          </div>
        </div>

        {/* Target Input */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Target className="h-4 w-4" />
            <span>{isFrench ? 'Cible' : 'Target'}</span>
          </label>
          <Input
            placeholder={isFrench ? 'Ton prénom ou pseudo...' : 'Your name or nickname...'}
            value={settings.target}
            onChange={(e) => handleSettingChange('target', e.target.value)}
          />
        </div>

        {/* Context Select */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>{isFrench ? 'Contexte' : 'Context'}</span>
          </label>
          <Select
            value={settings.context}
            onValueChange={(value: Context) => handleSettingChange('context', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contextOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Intensity Select */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>{isFrench ? 'Intensité' : 'Intensity'}</span>
          </label>
          <Select
            value={settings.intensity}
            onValueChange={(value: Intensity) => handleSettingChange('intensity', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {intensityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center space-x-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Safe Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              {isFrench ? 'Mode Sécurisé' : 'Safe Mode'}
            </span>
            <Badge variant="secondary" className="text-xs">
              {isFrench ? 'Recommandé' : 'Recommended'}
            </Badge>
          </div>
          <Switch
            checked={settings.safeMode}
            onCheckedChange={(checked) => handleSettingChange('safeMode', checked)}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onGenerate()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Zap className="mr-2 h-4 w-4" />
            {isFrench ? 'Générer' : 'Generate'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onOpenHistory}
          >
            <History className="mr-2 h-4 w-4" />
            {isFrench ? 'Historique' : 'History'}
          </Button>
        </div>

        {/* Secondary Actions */}
        {hasContent && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onCopy}
            >
              <Copy className="mr-2 h-4 w-4" />
              {isFrench ? 'Copier' : 'Copy'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              {isFrench ? 'Télécharger' : 'Download'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}




