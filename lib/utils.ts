import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ContentEntry, GenerationSettings, Mode, Intensity, Context, Language } from './types'
import { roastsFr, roastsEn, contextTemplatesFr, contextTemplatesEn } from './roasts'
import { complimentsFr, complimentsEn, contextComplimentsFr, contextComplimentsEn } from './compliments'
import { filterContent, getSafeFallback } from './filters'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Génère un contenu (roast ou compliment) basé sur les paramètres
 */
export function generateContent(settings: GenerationSettings): ContentEntry {
  const { mode, intensity, context, target, safeMode, language } = settings
  
  // Récupérer les templates selon la langue
  const templates = language === 'en' 
    ? (mode === 'roast' ? roastsEn : complimentsEn)
    : (mode === 'roast' ? roastsFr : complimentsEn)
  
  const contextTemplates = language === 'en'
    ? (mode === 'roast' ? contextTemplatesEn : contextComplimentsEn)
    : (mode === 'roast' ? contextTemplatesFr : contextComplimentsFr)
  
  // Essayer d'abord les templates de contexte spécifique
  let availableTemplates = contextTemplates[context] || []
  
  // Si pas de templates de contexte, utiliser les templates généraux
  if (availableTemplates.length === 0) {
    availableTemplates = templates[intensity] || []
  }
  
  // Filtrer par intensité si nécessaire
  if (availableTemplates.length === 0) {
    availableTemplates = templates[intensity] || []
  }
  
  // Si toujours pas de templates, utiliser les templates légers
  if (availableTemplates.length === 0) {
    availableTemplates = templates.light || []
  }
  
  // Filtrer par mode sécurisé si nécessaire
  if (safeMode) {
    availableTemplates = availableTemplates.filter(template => template.safe !== false)
  }
  
  // Sélectionner un template aléatoire
  const randomIndex = Math.floor(Math.random() * availableTemplates.length)
  const selectedTemplate = availableTemplates[randomIndex]
  
  // Remplacer {{target}} par la cible ou "toi"
  const targetText = target.trim() || (language === 'en' ? 'you' : 'toi')
  let contentText = selectedTemplate.text.replace(/\{\{target\}\}/g, targetText)
  
  // Appliquer les filtres de sécurité
  const filterResult = filterContent(contentText, mode, safeMode)
  
  if (!filterResult.isSafe) {
    // Utiliser un fallback sûr
    contentText = getSafeFallback(mode, intensity, language)
  }
  
  // Créer l'entrée de contenu
  const contentEntry: ContentEntry = {
    id: generateId(),
    text: contentText,
    mode,
    intensity,
    context,
    target: targetText,
    safeMode,
    language,
    timestamp: Date.now()
  }
  
  // Sauvegarder dans l'historique
  saveToHistory(contentEntry)
  
  return contentEntry
}

/**
 * Génère un ID unique
 */
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

/**
 * Sauvegarde une entrée dans l'historique localStorage
 */
export function saveToHistory(entry: ContentEntry): void {
  try {
    const history = getHistory()
    const newHistory = [entry, ...history].slice(0, 50) // Garder seulement les 50 derniers
    localStorage.setItem('roast-me-history', JSON.stringify(newHistory))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'historique:', error)
  }
}

/**
 * Récupère l'historique depuis localStorage
 */
export function getHistory(): ContentEntry[] {
  try {
    const history = localStorage.getItem('roast-me-history')
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error)
    return []
  }
}

/**
 * Efface l'historique
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem('roast-me-history')
  } catch (error) {
    console.error('Erreur lors de l\'effacement de l\'historique:', error)
  }
}

/**
 * Recherche dans l'historique
 */
export function searchHistory(query: string, language: Language): ContentEntry[] {
  const history = getHistory()
  const lowerQuery = query.toLowerCase()
  
  return history.filter(entry => 
    entry.language === language && (
      entry.text.toLowerCase().includes(lowerQuery) ||
      entry.target.toLowerCase().includes(lowerQuery) ||
      entry.mode.toLowerCase().includes(lowerQuery) ||
      entry.context.toLowerCase().includes(lowerQuery)
    )
  )
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Il y a moins d\'une heure'
  } else if (diffInHours < 24) {
    return `Il y a ${Math.floor(diffInHours)} heure${Math.floor(diffInHours) > 1 ? 's' : ''}`
  } else if (diffInHours < 48) {
    return 'Hier'
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Formate une date pour l'affichage en anglais
 */
export function formatDateEn(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 1) {
    return 'Less than an hour ago'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''} ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

/**
 * Copie du texte dans le presse-papiers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    return false
  }
}

/**
 * Télécharge une image depuis un canvas
 */
export function downloadImage(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

/**
 * Génère des confettis pour les compliments
 */
export function triggerConfetti(): void {
  if (typeof window !== 'undefined') {
    import('canvas-confetti').then(confetti => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    })
  }
}

/**
 * Tente de générer une punchline via l'API /api/roast (OpenAI côté serveur)
 * Retourne null si l'appel échoue (on utilisera alors le fallback local)
 */
export async function generateViaAI(payload: {
  mode: 'roast' | 'compliment'
  intensity?: 'light' | 'medium' | 'spicy'
  context?: 'general' | 'gym' | 'gaming' | 'studies' | 'auto' | 'tech' | 'lifestyle'
  target?: string
  safeMode?: boolean
  language?: 'fr' | 'en'
}): Promise<string | null> {
  try {
    const res = await fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data?.text && typeof data.text === 'string') ? data.text : null
  } catch (e) {
    return null
  }
}
