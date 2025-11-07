import { DashboardHeader } from "../components/DashboardHeader"
import { TextAnalyzer } from "../components/TextAnalyzer"

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Analyze Text</h1>

        <div className="rounded-lg border bg-white p-6 shadow-md">
          <TextAnalyzer />
        </div>
      </main>
    </div>
  )
}
