import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            📊 Tableau de Bord Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Statistiques et métriques de votre application Roast/Compliment
          </p>
        </div>
        
        <AnalyticsDashboard />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Données mises à jour en temps réel via Firebase Analytics
          </p>
        </div>
      </div>
    </main>
  )
}
