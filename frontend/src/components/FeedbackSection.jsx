import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { FeedbackCard } from './FeedbackCard'
import { Button } from "./ui/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useReviewStore } from "../store/useReviewStore"

export function FeedbackSection({ type }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { reviews } = useReviewStore()

  // Define sentiment mapping
  const sentimentMap = {
    positive: "Positive Feedback",
    negative: "Negative Feedback",
    neutral: "Neutral Feedback",
  }

  // Define title/description
  const titleMap = {
    positive: "Positive Feedback",
    negative: "Negative Feedback",
    neutral: "Neutral Feedback",
  }

  const descriptionMap = {
    positive: "Customer feedback with positive sentiment",
    negative: "Customer feedback with negative sentiment",
    neutral: "Customer feedback with neutral sentiment",
  }

  // Fallback to avoid errors
  const sentimentFilter = sentimentMap[type] || "Neutral Feedback"
  const title = titleMap[type] || "Neutral Feedback"
  const description = descriptionMap[type] || "Customer feedback with neutral sentiment"

  const feedbackData = reviews.filter((item) => item.sentiment === sentimentFilter)

  const totalPages = Math.ceil(feedbackData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = feedbackData.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentItems.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={{
                id: feedback.id,
                text: feedback.text,
                sentiment: feedback.sentiment,
                response: feedback.ai_response,
                hate_speech: feedback.hate_speech_detection
              }}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, feedbackData.length)} of {feedbackData.length} items
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
