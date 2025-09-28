import { Suspense } from "react"
import { S2ApplicationGenerator } from "@/components/s2-application-generator"

function S2GeneratorWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading S2 Application Generator...</p>
          </div>
        </div>
      }
    >
      <S2ApplicationGenerator />
    </Suspense>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <S2GeneratorWithSuspense />
    </main>
  )
}
