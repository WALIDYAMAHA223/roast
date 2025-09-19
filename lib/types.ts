export type Mode = 'roast' | 'compliment'
export type Intensity = 'light' | 'medium' | 'spicy'
export type Context = 'general' | 'gym' | 'gaming' | 'studies' | 'auto' | 'tech' | 'lifestyle'
export type Language = 'fr' | 'en'

export interface GenerationSettings {
  mode: Mode
  intensity: Intensity
  context: Context
  target: string
  safeMode: boolean
  language: Language
}

export interface ContentEntry {
  id: string
  text: string
  mode: Mode
  intensity: Intensity
  context: Context
  target: string
  safeMode: boolean
  language: Language
  timestamp: number
}

export interface Template {
  text: string
  intensity: Intensity
  context?: Context
  safe?: boolean
}

export interface TemplateSet {
  [key: string]: Template[]
}

export interface AnalyticsEvent {
  action: 'generate' | 'copy' | 'download' | 'toggle_mode' | 'toggle_safe' | 'change_intensity' | 'change_context'
  data?: Record<string, any>
  timestamp: number
}




