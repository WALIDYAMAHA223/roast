import { TestGenerator } from "@/components/test-generator"

export default function TestPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Test du Service de Génération</h1>
          <p className="text-muted-foreground">
            Testez le service qui génère des roasts et compliments selon vos spécifications
          </p>
        </div>
        <TestGenerator />
      </div>
    </main>
  )
}


