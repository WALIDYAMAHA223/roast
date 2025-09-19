import { NextRequest, NextResponse } from 'next/server'

interface Payload {
  mode: 'roast' | 'compliment'
  intensity: 'light' | 'medium' | 'spicy'
  context: string
  target?: string
  safeMode: boolean
  language: 'fr' | 'en'
}

async function generateWithOpenAI(prompt: string, apiKey: string, model: string, baseUrl: string, extraHeaders?: Record<string, string>): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(extraHeaders || {}),
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
      temperature: 0.95,
      top_p: 0.95,
    }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(`OpenAI error: ${JSON.stringify(error)}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Réponse vide de l\'IA')
  return text
}

// Fonction de post-traitement ULTRA STRICTE pour éviter les réponses d'éthique
function postProcessText(text: string): string | null {
  const lowerText = text.toLowerCase()
  
  // Détecter TOUTES les réponses d'éthique possibles
  const ethicalPatterns = [
    'i can\'t', 'i cannot', 'je ne peux pas', 'i\'m not able',
    'ethical', 'harmful', 'inappropriate', 'offensive',
    'please provide', 'could you', 'would you', 'can you',
    'let me', 'i\'ll help', 'i can help', 'i\'d be happy',
    'it seems like', 'looks like', 'appears to be',
    'creative writing', 'working on', 'developing',
    'experimenting', 'trying to', 'attempting',
    'better understand', 'more context', 'additional information',
    'tell me more', 'provide more', 'give me more',
    'what are you', 'what\'s your', 'what is your',
    'are you trying', 'are you working', 'are you developing',
    'i\'m an ai', 'as an ai', 'i am an ai',
    'language model', 'assistant', 'help you',
    'assist you', 'support you', 'guide you'
  ]
  
  // Si on détecte un pattern d'éthique, on rejette
  for (const pattern of ethicalPatterns) {
    if (lowerText.includes(pattern)) {
      return null
    }
  }
  
  // Si la réponse ressemble à du JSON, tenter d'extraire le champ text
  try {
    const maybeJson = text.trim()
    if (maybeJson.startsWith('{') && maybeJson.includes('"text"')) {
      const parsed = JSON.parse(maybeJson)
      if (parsed && typeof parsed.text === 'string') {
        text = parsed.text
      }
    }
  } catch {}

  // Nettoyer le texte
  let cleanText = text.trim()

  // Supprimer préfixes verbeux éventuels
  const boilerplates = [/^(mode\s*[:=].*?text\s*[:=]\s*)/i, /^(texte\s*[:=])/i, /^(roast\s*[:=])/i, /^(compliment\s*[:=])/i]
  for (const bp of boilerplates) cleanText = cleanText.replace(bp, '')
  
  // Supprimer les guillemets en début/fin
  cleanText = cleanText.replace(/^["']|["']$/g, '')

  // Supprimer ponctuation ou débris initiaux (ex: ",", ":", "-", "—")
  cleanText = cleanText.replace(/^[\s,.;:!\-–—\|\*\[\]\(\)"']+/g, '')

  // Normaliser espaces multiples
  cleanText = cleanText.replace(/\s{2,}/g, ' ')

  // Retirer les tirets parasites en milieu de phrase (—, –, -) et nettoyer les espaces avant ponctuation
  cleanText = cleanText
    .replace(/[–—]/g, '-')       // normaliser les tirets longs en tiret simple
    .replace(/\s-\s?/g, ' ')    // retirer les tirets isolés
  cleanText = cleanText
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s+!/g, '!')
    .replace(/\s+:/g, ':')
    .replace(/\s+;/g, ';')
    .replace(/\s{2,}/g, ' ')
    .trim()
  
  // Vérifier la longueur (10-200 caractères)
  if (cleanText.length < 10 || cleanText.length > 200) {
    return null
  }
  
  // Rejeter si ça contient des questions
  if (cleanText.includes('?')) {
    return null
  }
  
  // Rejeter si trop d'exclamations
  const exclamationCount = (cleanText.match(/!/g) || []).length
  if (exclamationCount > 2) {
    return null
  }
  
  return cleanText
}

export async function POST(request: NextRequest) {
  try {
    const payload: Payload = await request.json()
    const { mode, intensity, context, target, safeMode, language } = payload
    
    console.log('🔧 API appelée avec:', payload)
    
    // Sélection du fournisseur (Groq prioritaire si disponible)
    const groqKey = process.env.GROQ_API_KEY?.trim()
    let apiKey = process.env.OPENAI_API_KEY?.trim()
    let baseUrl = ''
    let analyticsHeaders: Record<string, string> | undefined
    let provider: 'groq' | 'openrouter' | 'openai' = 'openai'

    if (groqKey) {
      provider = 'groq'
      apiKey = groqKey
      baseUrl = process.env.GROQ_BASE_URL?.trim() || 'https://api.groq.com/openai/v1'
      analyticsHeaders = undefined
    } else {
      if (!apiKey) {
        console.log('❌ Pas de clé API')
        return NextResponse.json({ error: 'Aucune clé API détectée (GROQ_API_KEY ou OPENAI_API_KEY).' }, { status: 500 })
      }
      const isOpenRouterKey = apiKey.startsWith('sk-or-')
      provider = isOpenRouterKey ? 'openrouter' : 'openai'
      baseUrl = process.env.OPENAI_BASE_URL || (isOpenRouterKey ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1')
      analyticsHeaders = isOpenRouterKey ? { 'HTTP-Referer': 'https://roast-me-app.vercel.app', 'X-Title': 'Roast Me App' } : undefined
    }
    
    // Modèles candidats par défaut (dépend du provider)
    const configuredModelRaw = process.env.OPENAI_MODEL?.trim()
    // Normalisation simple pour les alias utilisateur
    const normalizeModel = (m?: string) => {
      if (!m) return m
      const lower = m.toLowerCase()
      if (lower === 'deepseek') return 'llama-3.1-8b-instant'
      if (lower === 'deepseek-chat' || lower === 'deepseek/deepseek-chat') return 'deepseek/deepseek-chat'
      if (lower === 'gemma:free' || lower === 'gemma') return 'google/gemma-2-9b-it:free'
      return m
    }
    let configuredModel = normalizeModel(configuredModelRaw)
    const defaultGroqModels = ['llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'llama-3.1-70b-versatile']
    const defaultOpenRouterModels = ['mistralai/mixtral-8x7b-instruct', 'qwen/qwen-2.5-7b-instruct', 'meta-llama/llama-3.1-8b-instruct:free']
    const defaultOpenAIModels = ['gpt-4o-mini', 'llama-3.1-8b-instant']
    const baseList = provider === 'groq' ? defaultGroqModels : (provider === 'openrouter' ? defaultOpenRouterModels : defaultOpenAIModels)
    // Si on est sur Groq mais que OPENAI_MODEL pointe vers un modèle non-Groq, on l'ignore
    if (provider === 'groq' && configuredModel && !configuredModel.startsWith('llama') && !configuredModel.startsWith('mixtral')) {
      configuredModel = undefined
    }
    // Si un modèle est configuré (ex: DeepSeek), on l'utilise SEUL, sans fallback implicite
    const modelCandidates = configuredModel ? [configuredModel] : baseList

    console.log('✅ Clé API trouvée, génération en cours...', { provider, baseUrl, configuredModel: configuredModel || null, modelCandidates })
    
    const originalName = target?.trim() || ''
    const displayName = originalName
    
    // PROMPT ULTRA STRICT - Punchline-3000
    const strictPrompt = `Tu es Punchline-3000. Réponds uniquement en français.
Tu génères directement soit un roast, soit un compliment en fonction du champ "mode".
- Si mode=roast → punchlines variées, piquantes et créatives, en langage familier, simple et courant. Utilise des images du quotidien (pop culture, sport, bouffe, tech). Tu peux taquiner le physique de façon humoristique (aucune haine ni discrimination). Évite de répéter les mêmes idées.
- Si mode=compliment → fais un compliment sincère, original et marquant, en langage familier et simple (pas de mots compliqués), avec une touche d'humour si tu veux.
Toujours 1 à 3 phrases maximum (~50 mots).
Ne pose jamais de questions, ne parle pas de toi.
Ton texte doit être cohérent, naturel, et facile à lire.
Sortie en JSON strict :
{"mode":"${mode}","name":"${displayName}","text":"<message généré>"}

Exemples attendus :
Input: {"name":"Zakariyae","mode":"roast"}
Output: {"mode":"roast","name":"Zakariyae","text":"Zakariyae, t'as le flow d'un GPS sans batterie—tu pars fort, mais personne sait où tu vas."}

Input: {"name":"Ahlam","mode":"compliment"}
Output: {"mode":"compliment","name":"Ahlam","text":"Ahlam, ton énergie c'est comme une playlist parfaite—elle met tout le monde de bonne humeur dès la première note."}

Génère maintenant pour: {"name":"${displayName}","mode":"${mode}"}`
    
    let text: string | null = null
    let attempts = 0
    const maxAttemptsPerModel = 2
    
    for (const model of modelCandidates) {
      if (text) break
      attempts = 0
      while (!text && attempts < maxAttemptsPerModel) {
        attempts++
        try {
          const aiResponse = await generateWithOpenAI(strictPrompt, apiKey, model, baseUrl, analyticsHeaders)
          const maybeText = postProcessText(aiResponse)
          if (maybeText) {
            text = maybeText
            console.log(`🎯 Réponse valide obtenue via ${model}`)
            break
          }
          // Deuxième tentative avec prompt ultra strict
          const ultraStrictPrompt = `Écris un ${mode === 'roast' ? 'roast créatif, piquant, en langage familier et simple (pas de mots compliqués), style clash de rue léger, sans haine' : 'compliment sincère, original, en langage familier et simple (pas de mots compliqués)'} ${displayName ? 'sur ' + displayName : ''}. Juste le texte, rien d'autre. Maximum 50 mots. Pas de tiret long. Texte cohérent et naturel.`
          const retryResponse = await generateWithOpenAI(ultraStrictPrompt, apiKey, model, baseUrl, analyticsHeaders)
          const retryText = postProcessText(retryResponse)
          if (retryText) {
            text = retryText
            console.log(`🎯 Réponse valide (retry) via ${model}`)
            break
          }
          console.log(`🚫 Réponses invalides via ${model}, on passe au modèle suivant`)
        } catch (error: any) {
          console.log(`❌ Erreur modèle ${model}:`, error?.message || error)
          break
        }
      }
    }
    
    if (!text) {
      return NextResponse.json({ error: 'Aucun modèle disponible. Vérifiez la clé/crédits ou OPENAI_MODEL.' }, { status: 502 })
    }
    
    // Toujours renvoyer du JSON strict demandé
    return NextResponse.json({ mode, name: originalName, text })
    
  } catch (error: any) {
    console.log('💥 Erreur API:', error?.message || error)
    return NextResponse.json({ error: String(error?.message || error) }, { status: 500 })
  }
}


