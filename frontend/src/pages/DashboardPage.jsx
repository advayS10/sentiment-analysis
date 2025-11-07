import { DashboardHeader } from "../components/DashboardHeader"
import { FileUpload } from "../components/FileUpload"
import { SentimentCharts } from "../components/SentimentCharts"
import { FeedbackToggle } from "../components/FeedbackToggle"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

        <div className="mb-8 rounded-lg border bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Upload Data</h2>
          <FileUpload />
        </div>

        <SentimentCharts />

        <div className="mt-8">
          <FeedbackToggle />
        </div>
      </main>
    </div>
  )
}
