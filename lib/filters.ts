import type { Mode, Intensity } from './types'

// Liste des mots interdits (à étendre selon les besoins)
const BLOCKED_WORDS = [
  // Insultes directes
  'idiot', 'stupide', 'con', 'connard', 'connasse', 'putain', 'merde',
  'imbécile', 'crétin', 'abruti', 'débile', 'nul', 'nulle',
  
  // Termes discriminatoires
  'gay', 'lesbienne', 'trans', 'noir', 'blanc', 'arabe', 'juif', 'musulman',
  'handicapé', 'mongol', 'autiste', 'débile', 'taré', 'cinglé',
  
  // Termes de harcèlement
  'suicide', 'mort', 'tue', 'violence', 'haine', 'déteste',
  
  // Termes anglais
  'fuck', 'shit', 'bitch', 'asshole', 'dumb', 'stupid', 'gay', 'retard'
]

// Regex pour détecter les patterns problématiques
const PROBLEMATIC_PATTERNS = [
  /\b(?:tu es|t'es|vous êtes)\s+(?:un|une)\s+(?:connard|connasse|idiot|imbécile)\b/i,
  /\b(?:va|allez)\s+(?:te|vous)\s+(?:faire|foutre|mettre)\b/i,
  /\b(?:je|j')\s+(?:te|vous)\s+(?:déteste|hais|haïs)\b/i,
  /\b(?:tu|vous)\s+(?:devrais|devez)\s+(?:mourir|crever|disparaître)\b/i,
]

/**
 * Vérifie si un texte contient du contenu inapproprié
 */
export function isContentInappropriate(text: string): boolean {
  const lowerText = text.toLowerCase()
  
  // Vérifier les mots bloqués
  for (const word of BLOCKED_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return true
    }
  }
  
  // Vérifier les patterns problématiques
  for (const pattern of PROBLEMATIC_PATTERNS) {
    if (pattern.test(text)) {
      return true
    }
  }
  
  return false
}

/**
 * Filtre le contenu selon le mode et les paramètres de sécurité
 */
export function filterContent(
  text: string, 
  mode: Mode, 
  safeMode: boolean
): { isSafe: boolean; filteredText?: string } {
  // En mode compliment, aucun contenu négatif fort
  if (mode === 'compliment') {
    const hasNegativeWords = BLOCKED_WORDS.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    )
    
    if (hasNegativeWords) {
      return { isSafe: false }
    }
  }
  
  // En mode safe, vérifier le contenu inapproprié
  if (safeMode && isContentInappropriate(text)) {
    return { isSafe: false }
  }
  
  return { isSafe: true }
}

/**
 * Génère un texte de fallback sûr
 */
export function getSafeFallback(mode: Mode, intensity: Intensity, language: string): string {
  const fallbacks = {
    fr: {
      roast: {
        light: "Désolé, je n'ai pas trouvé de roast approprié pour le moment.",
        medium: "Hmm, laissez-moi réfléchir à quelque chose de plus approprié...",
        spicy: "Je vais garder mes roasts pour un moment plus approprié."
      },
      compliment: {
        light: "Vous êtes une personne formidable !",
        medium: "Votre positivité est inspirante !",
        spicy: "Vous êtes absolument incroyable !"
      }
    },
    en: {
      roast: {
        light: "Sorry, I couldn't find an appropriate roast right now.",
        medium: "Hmm, let me think of something more appropriate...",
        spicy: "I'll keep my roasts for a more appropriate time."
      },
      compliment: {
        light: "You are an amazing person!",
        medium: "Your positivity is inspiring!",
        spicy: "You are absolutely incredible!"
      }
    }
  }
  
  return fallbacks[language as keyof typeof fallbacks]?.[mode]?.[intensity] || 
         fallbacks.fr[mode][intensity]
}




