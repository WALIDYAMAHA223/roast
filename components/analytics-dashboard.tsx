"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, MessageSquare, Heart, Flame, TrendingUp } from "lucide-react"

interface AnalyticsData {
  totalRoasts: number
  totalCompliments: number
  totalReactions: number
  modeSwitches: number
  aiLimitReached: number
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRoasts: 0,
    totalCompliments: 0,
    totalReactions: 0,
    modeSwitches: 0,
    aiLimitReached: 0
  })

  useEffect(() => {
    // Simuler des données d'analytics (en production, vous récupéreriez ces données depuis Firebase)
    const mockData: AnalyticsData = {
      totalRoasts: Math.floor(Math.random() * 100) + 50,
      totalCompliments: Math.floor(Math.random() * 80) + 30,
      totalReactions: Math.floor(Math.random() * 200) + 100,
      modeSwitches: Math.floor(Math.random() * 50) + 20,
      aiLimitReached: Math.floor(Math.random() * 10) + 5
    }
    
    setAnalytics(mockData)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Roasts Générés
          </CardTitle>
          <Flame className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{analytics.totalRoasts}</div>
          <p className="text-xs text-muted-foreground">
            +12% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Compliments Générés
          </CardTitle>
          <Heart className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{analytics.totalCompliments}</div>
          <p className="text-xs text-muted-foreground">
            +8% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Réactions Totales
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{analytics.totalReactions}</div>
          <p className="text-xs text-muted-foreground">
            +15% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Changements de Mode
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">{analytics.modeSwitches}</div>
          <p className="text-xs text-muted-foreground">
            +5% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Limites IA Atteintes
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400">{analytics.aiLimitReached}</div>
          <p className="text-xs text-muted-foreground">
            -2% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Utilisateurs Actifs
          </CardTitle>
          <Users className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-400">
            {analytics.totalRoasts + analytics.totalCompliments}
          </div>
          <p className="text-xs text-muted-foreground">
            +20% par rapport au mois dernier
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
