import { useState } from "react"
import { Button } from "./ui/Button"
import { FeedbackSection } from "./FeedbackSection"
import { ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"

export function FeedbackToggle() {
  const [selectedType, setSelectedType] = useState("positive")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Feedback Analysis</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedType === "positive" ? "default" : "outline"}
            onClick={() => setSelectedType("positive")}
            className="flex items-center gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Positive</span>
          </Button>
          <Button
            variant={selectedType === "negative" ? "default" : "outline"}
            onClick={() => setSelectedType("negative")}
            className="flex items-center gap-2"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>Negative</span>
          </Button>
          <Button
            variant={selectedType === "neutral" ? "default" : "outline"}
            onClick={() => setSelectedType("neutral")}
            className="flex items-center gap-2"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span>Neutral</span>
          </Button>
        </div>
      </div>

      <FeedbackSection type={selectedType} />
    </div>
  )
}
