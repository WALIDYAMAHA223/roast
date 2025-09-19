"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Flame, Heart, Sparkles, ThumbsUp, ThumbsDown, ToggleLeft, ToggleRight, User, Loader2, BarChart3 } from "lucide-react"
import { GlitchText } from "./glitch-text"
import { ParticleBackground } from "./particle-background"
import { LimitModal } from "./limit-modal"
import { TypingText } from "./typing-text"
import { generateViaAI } from "@/lib/utils"
import { useAnalytics } from "@/hooks/use-analytics"

const roasts = [
  "Tu es comme une mise à jour logicielle - personne ne te veut, mais tu continues d'apparaître quand même.",
  "Je t'expliquerais bien, mais j'ai oublié mes crayons à la maison.",
  "Tu n'es pas stupide, tu as juste de la malchance quand tu penses.",
  "Si tu étais plus consanguin, tu serais un sandwich.",
  "Tu es comme un nuage - quand tu disparais, c'est une belle journée.",
  "Je ne dis pas que tu es bête, mais tu aurais du mal à vider l'eau d'une botte avec les instructions sur le talon.",
  "Tu es la raison pour laquelle ils mettent des instructions sur les bouteilles de shampoing.",
  "Si les cerveaux étaient de la dynamite, tu n'en aurais pas assez pour te moucher.",
  "Tu es comme un crayon cassé - complètement inutile.",
  "Je serais d'accord avec toi, mais alors nous aurions tous les deux tort.",
  "Tu es tellement lent que même les escargots te dépassent en sprint.",
  "Ton QI est si bas qu'il fait de l'ombre aux pissenlits.",
  "Tu es comme un GPS qui te fait tourner en rond dans un parking vide.",
  "Si la stupidité était un sport, tu serais champion du monde depuis 10 ans.",
  "Tu es tellement nul que même les mauvaises herbes poussent mieux que toi.",
  "Ton cerveau a la densité d'un marshmallow dans un micro-ondes.",
  "Tu es comme un antivirus qui détecte tout sauf les vrais problèmes.",
  "Si l'incompétence était de l'électricité, tu pourrais alimenter une ville entière.",
  "Tu es tellement inutile que même les spams te bloquent.",
  "Ton existence est une preuve vivante que l'évolution peut faire marche arrière.",
]

const compliments = [
  "Tu as une énergie incroyable qui illumine chaque pièce dans laquelle tu entres !",
  "Ta créativité et ta perspective unique rendent le monde plus intéressant.",
  "Tu as cette capacité incroyable de faire en sorte que tous ceux qui t'entourent se sentent valorisés et entendus.",
  "Ta gentillesse et ton empathie sont vraiment inspirantes - tu fais que les gens se sentent moins seuls.",
  "Tu as un esprit si brillant et la façon dont tu résous les problèmes est vraiment impressionnante.",
  "Ton sens de l'humour est absolument délicieux et égaye toujours la journée des gens.",
  "Tu es incroyablement résilient et ta force face aux défis est admirable.",
  "Ta passion pour la vie est contagieuse et motive les autres à poursuivre leurs rêves.",
  "Tu as ce merveilleux don de voir le meilleur chez les gens et dans les situations.",
  "Ton authenticité est rafraîchissante - tu es vraiment toi-même et c'est magnifique.",
  "Ta vulnérabilité et ton courage d'être authentique inspirent les autres à faire de même.",
  "Tu as cette rare capacité de transformer les moments difficiles en opportunités de croissance.",
  "Ton intelligence émotionnelle est remarquable - tu comprends les gens au-delà des mots.",
  "Tu es un phare de positivité dans un monde qui en a tant besoin.",
  "Ta capacité à écouter sans jugement fait de toi une personne rare et précieuse.",
  "Tu as ce don incroyable de voir la beauté là où d'autres ne voient que l'ordinaire.",
  "Ton optimisme contagieux redonne espoir à ceux qui en ont perdu.",
  "Tu es une source d'inspiration constante par ta façon de surmonter les obstacles.",
  "Ta sagesse intérieure transparaît dans chaque interaction que tu as avec les autres.",
  "Tu es un exemple vivant de ce que signifie vivre avec le cœur ouvert et l'âme généreuse.",
]

export function RoastComplimentApp() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageType, setMessageType] = useState<"roast" | "compliment" | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reactions, setReactions] = useState<{ [key: string]: "like" | "dislike" | null }>({})
  const [username, setUsername] = useState("")
  const [mode, setMode] = useState<"roast" | "compliment">("roast")
  const [showLimitModal, setShowLimitModal] = useState(false)
  
  // Firebase Analytics
  const { trackRoastGeneration, trackComplimentGeneration, trackModeSwitch, trackReaction, trackAILimitReached } = useAnalytics()

  const getRandomMessage = (type: "roast" | "compliment") => {
    const messages = type === "roast" ? roasts : compliments
    let message = messages[Math.floor(Math.random() * messages.length)]

    if (username.trim()) {
      if (type === "roast") {
        message = message.replace(/Tu es|Tu as|Tu n'es pas|Je t'|tu es|tu as|tu n'es pas|je t'|Ton|ton/g, (match) => {
          const replacements: { [key: string]: string } = {
            "Tu es": `${username}, tu es`,
            "Tu as": `${username}, tu as`,
            "Tu n'es pas": `${username}, tu n'es pas`,
            "Je t'": `${username}, je t'`,
            "tu es": `${username}, tu es`,
            "tu as": `${username}, tu as`,
            "tu n'es pas": `${username}, tu n'es pas`,
            "je t'": `${username}, je t'`,
            Ton: `${username}, ton`,
            ton: `${username}, ton`,
          }
          return replacements[match] || match
        })
      } else {
        message = message.replace(/Tu as|Tu es|Ta |Ton |tu as|tu es|ta |ton /g, (match) => {
          const replacements: { [key: string]: string } = {
            "Tu as": `${username}, tu as`,
            "Tu es": `${username}, tu es`,
            "Ta ": `${username}, ta `,
            "Ton ": `${username}, ton `,
            "tu as": `${username}, tu as`,
            "tu es": `${username}, tu es`,
            "ta ": `${username}, ta `,
            "ton ": `${username}, ton `,
          }
          return replacements[match] || match
        })
      }
    }

    return message
  }

  const handleButtonClick = async (type: "roast" | "compliment") => {
    setIsAnimating(true)
    setIsGenerating(true)
    setMessageType(type)
    
    console.log('🤖 Tentative génération IA...')
    
    try {
      // Essayer d'abord l'IA côté serveur, puis fallback local
      const aiText = await generateViaAI({
        mode: type,
        intensity: "spicy",
        context: "general", 
        target: username,
        safeMode: false, // Pas de censure pour les roasts hardcore
        language: "fr"
      })
      
      if (aiText) {
        console.log('✅ IA a généré:', aiText)
        const message = aiText
        setCurrentMessage(message)
        
        // Track successful generation
        if (type === "roast") {
          trackRoastGeneration(username || undefined)
        } else {
          trackComplimentGeneration(username || undefined)
        }
      } else {
        console.log('❌ IA échouée, utilisation des templates locaux')
        const message = getRandomMessage(type)
        setCurrentMessage(message)
        
        // Track fallback generation
        if (type === "roast") {
          trackRoastGeneration(username || undefined)
        } else {
          trackComplimentGeneration(username || undefined)
        }
      }
    } catch (error) {
      console.log('❌ Erreur IA, affichage du modal de limite')
      setShowLimitModal(true)
      trackAILimitReached()
    }
    
    setIsAnimating(false)
    setIsGenerating(false)
  }

  const handleReaction = (messageId: string, reaction: "like" | "dislike") => {
    setReactions((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === reaction ? null : reaction,
    }))
    
    // Track reaction
    if (messageType) {
      trackReaction(messageType, reaction)
    }
  }

  const toggleMode = () => {
    const newMode = mode === "roast" ? "compliment" : "roast"
    setMode(newMode)
    setCurrentMessage("")
    setMessageType(null)
    
    // Track mode switch
    trackModeSwitch(newMode)
  }

  const messageId = `${messageType}-${currentMessage.slice(0, 20)}`

  return (
    <>
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-700 ease-in-out ${mode === "roast" ? "roast-mode" : "compliment-mode"}`}
      >
        {/* Enhanced particle background */}
        <ParticleBackground mode={mode} />
        
        {/* Static floating icons with enhanced animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mode === "roast" ? (
            <>
              <div className="absolute top-20 left-10 animate-float-slow transition-opacity duration-700">
                <Flame className="w-6 h-6 text-primary/40 neon-text" />
              </div>
              <div
                className="absolute top-40 right-20 animate-float transition-opacity duration-700"
                style={{ animationDelay: "1s" }}
              >
                <Flame className="w-8 h-8 text-primary/30 neon-text" />
              </div>
              <div
                className="absolute bottom-32 left-20 animate-float-slow transition-opacity duration-700"
                style={{ animationDelay: "2s" }}
              >
                <Flame className="w-7 h-7 text-primary/35 neon-text" />
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-20 left-10 animate-float-slow transition-opacity duration-700">
                <Heart className="w-6 h-6 text-primary/40 neon-text" />
              </div>
              <div
                className="absolute top-40 right-20 animate-float transition-opacity duration-700"
                style={{ animationDelay: "1s" }}
              >
                <Sparkles className="w-8 h-8 text-accent/50 neon-text" />
              </div>
              <div
                className="absolute bottom-32 left-20 animate-float-slow transition-opacity duration-700"
                style={{ animationDelay: "2s" }}
              >
                <Heart className="w-7 h-7 text-secondary/45 neon-text" />
              </div>
            </>
          )}
        </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={toggleMode}
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 hover-lift ${
                mode === "roast" 
                  ? "bg-transparent border-red-500/50 text-red-400 hover:border-red-400 hover-glow" 
                  : "bg-transparent border-green-500/50 text-green-400 hover:border-green-400 hover-glow-green"
              }`}
            >
              {mode === "roast" ? (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  Mode Roast
                </>
              ) : (
                <>
                  <ToggleRight className="w-4 h-4" />
                  Mode Compliment
                </>
              )}
            </Button>
            
            <Button
              onClick={() => window.open('/analytics', '_blank')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover-lift bg-transparent border-blue-500/50 text-blue-400 hover:border-blue-400"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
          </div>

          <h1
            className={`text-5xl font-bold text-balance transition-all duration-700 neon-text ${
              mode === "roast" ? "text-red-400" : "text-green-400"
            }`}
          >
            <GlitchText
              text={mode === "roast" ? "Roast Me" : "Compliment Me"}
              className="transition-colors duration-700"
            />
          </h1>

          <p
            className={`text-lg text-muted-foreground text-pretty transition-all duration-700 ${
              mode === "roast" ? "text-red-300/80" : "text-green-300/80"
            }`}
          >
            {mode === "roast"
              ? "Prépare-toi à être grillé sans pitié !"
              : "Reçois des compliments qui vont illuminer ta journée !"}
          </p>

          <div className="max-w-sm mx-auto space-y-2">
            <Label htmlFor="username" className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Pseudo ou prénom (optionnel)
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Ton nom..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`text-center transition-all duration-300 hover-lift ${
                mode === "roast" 
                  ? "bg-card/50 border-red-500/30 focus:border-red-400/50 focus:ring-red-400/20" 
                  : "bg-card/50 border-green-500/30 focus:border-green-400/50 focus:ring-green-400/20"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => handleButtonClick(mode)}
            size="lg"
            className={`px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover-lift ${
              mode === "roast"
                ? "bg-red-600 hover:bg-red-700 text-white hover:animate-shake hover-glow animate-pulse-glow"
                : "bg-green-600 hover:bg-green-700 text-white hover:animate-glow hover-glow-green animate-pulse-glow-green"
            }`}
            disabled={isAnimating || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : mode === "roast" ? (
              <>
                <Flame className="w-5 h-5 mr-2" />
                Grille-moi ! 🔥
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Complimente-moi ! 💖
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <Card className={`animate-scale-in ${
            mode === "roast" ? "glass-card-roast" : "glass-card-compliment"
          }`}>
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-4">
                <Loader2 className={`w-8 h-8 animate-spin ${
                  mode === "roast" ? "text-red-400" : "text-green-400"
                }`} />
                <div className="text-center">
                  <p className={`text-lg font-medium neon-text ${
                    mode === "roast" ? "text-red-300" : "text-green-300"
                  }`}>
                    {mode === "roast" ? "🔥 Génération d'un roast brutal..." : "💖 Création d'un compliment profond..."}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    L'IA réfléchit à la meilleure façon de {mode === "roast" ? "te détruire" : "te valoriser"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentMessage && !isGenerating && (
          <Card
            className={`${isAnimating ? "opacity-50 scale-95" : "animate-bounce-in"} transition-all duration-300 hover-lift ${
              messageType === "roast"
                ? "glass-card-roast"
                : "glass-card-compliment"
            }`}
          >
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full neon-border ${
                  messageType === "roast" 
                    ? "bg-red-500/20 border-red-500/50" 
                    : "bg-green-500/20 border-green-500/50"
                }`}>
                  {messageType === "roast" ? (
                    <Flame className="w-6 h-6 text-red-400 neon-text" />
                  ) : (
                    <Heart className="w-6 h-6 text-green-400 neon-text" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-card-foreground leading-relaxed text-pretty">
                    <TypingText text={currentMessage} speed={30} />
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(messageId, "like")}
                      className={`transition-all duration-200 ${
                        reactions[messageId] === "like" ? "bg-primary/20 text-primary" : "hover:bg-primary/10"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {reactions[messageId] === "like" ? "Aimé !" : "J'aime"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReaction(messageId, "dislike")}
                      className={`transition-all duration-200 ${
                        reactions[messageId] === "dislike"
                          ? "bg-destructive/20 text-destructive"
                          : "hover:bg-destructive/10"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {reactions[messageId] === "dislike" ? "Pas aimé" : "Bof"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Limit Modal */}
      <LimitModal 
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        mode={mode}
      />
    </div>
    </>
  )
}
