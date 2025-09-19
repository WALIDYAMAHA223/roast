"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, RefreshCw } from "lucide-react"

interface LimitModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "roast" | "compliment"
}

export function LimitModal({ isOpen, onClose, mode }: LimitModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-scale-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className={`relative w-full max-w-md animate-slide-in-up ${
        mode === "roast" ? "glass-card-roast" : "glass-card-compliment"
      }`}>
        <CardHeader className="text-center pb-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            mode === "roast" ? "bg-red-500/20" : "bg-green-500/20"
          }`}>
            <AlertTriangle className={`w-8 h-8 ${
              mode === "roast" ? "text-red-400" : "text-green-400"
            }`} />
          </div>
          <CardTitle className={`text-xl font-bold ${
            mode === "roast" ? "text-red-400" : "text-green-400"
          }`}>
            Limite atteinte ! 🚫
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground text-lg">
              Tu as atteint la limite pour aujourd'hui, réessaie plus tard !
            </p>
            <p className="text-sm text-muted-foreground">
              L'IA a besoin d'une petite pause pour recharger ses batteries 🔋
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Prochaine génération disponible dans quelques heures</span>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 hover-lift"
            >
              Compris
            </Button>
            <Button
              onClick={() => {
                onClose()
                // Optionnel: rediriger vers une page de contact ou d'upgrade
              }}
              className={`flex-1 hover-lift ${
                mode === "roast" 
                  ? "bg-red-600 hover:bg-red-700 hover-glow" 
                  : "bg-green-600 hover:bg-green-700 hover-glow-green"
              }`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
