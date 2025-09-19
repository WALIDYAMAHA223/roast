"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Heart } from "lucide-react"

interface GenerateResponse {
  mode: 'roast' | 'compliment'
  name: string
  text: string
}

export function TestGenerator() {
  const [name, setName] = useState("")
  const [mode, setMode] = useState<'roast' | 'compliment'>('roast')
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mode }),
      })

      if (!response.ok) {
        throw new Error('Erreur API')
      }

      const data: GenerateResponse = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {mode === 'roast' ? (
              <>
                <Flame className="w-5 h-5 text-red-500" />
                Générateur de Roasts
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 text-pink-500" />
                Générateur de Compliments
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom (optionnel)
            </label>
            <Input
              type="text"
              placeholder="Entrez un nom..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={mode === 'roast' ? 'default' : 'outline'}
              onClick={() => setMode('roast')}
              className="flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              Roast
            </Button>
            <Button
              variant={mode === 'compliment' ? 'default' : 'outline'}
              onClick={() => setMode('compliment')}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Compliment
            </Button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Génération...' : 'Générer'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Résultat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Mode:</strong> {result.mode}</p>
              <p><strong>Nom:</strong> {result.name}</p>
              <p><strong>Texte:</strong> {result.text}</p>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h4 className="font-medium mb-2">JSON Response:</h4>
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


