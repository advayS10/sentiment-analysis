"use client"

import { useState } from "react"
import { Card, CardContent } from "./ui/Card"
import { Button } from "./ui/Button"
import { Textarea } from "./ui/Textarea"
import { Badge } from "./ui/Badge"
import { Copy, Edit, Check, RefreshCw } from "lucide-react"
import { useReviewStore } from '../store/useReviewStore'

export function FeedbackCard({ feedback }) {
  const [isEditing, setIsEditing] = useState(false)
  const [response, setResponse] = useState(feedback.response)
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const reviews = useReviewStore((state) => state.reviews)
  const setReviews = useReviewStore((state) => state.setReviews)

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = () => {
    setIsEditing(false)
    // You can also update the Zustand store here if needed
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const res = await fetch("/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedback.text }),
      })

      const data = await res.json()

      if (data.ai_response) {
        setResponse(data.ai_response)

        // 🧠 Update Zustand store
        const updatedReviews = reviews.map((item) =>
          item.id === feedback.id ? { ...item, response: data.ai_response } : item
        )
        setReviews(updatedReviews)
      }
    } catch (error) {
      console.error("Error regenerating AI response:", error)
    } finally {
      setIsRegenerating(false)
    }
  }

  let sentimentColor = ""
  let borderColor = ""

  switch (feedback.sentiment) {
    case "Positive Feedback":
      sentimentColor = "bg-green-100 text-green-800"
      borderColor = "#10b981"
      break
    case "Negative Feedback":
      sentimentColor = "bg-red-100 text-red-800"
      borderColor = "#ef4444"
      break
    case "Neutral Feedback":
      sentimentColor = "bg-yellow-100 text-yellow-800"
      borderColor = "#facc15"
      break
    default:
      sentimentColor = "bg-gray-100 text-gray-800"
      borderColor = "#d1d5db"
  }

  return (
    <Card className="overflow-hidden border-l-4 transition-all hover:shadow-md" style={{ borderLeftColor: borderColor }}
>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <p className="text-sm font-medium">{feedback.text}</p>
          <div className="flex items-center justify-between">
          <Badge className={`ml-2 ${sentimentColor}`}>{feedback.hate_speech}</Badge>
          <Badge className={`ml-2 ${sentimentColor}`}>{feedback.sentiment}</Badge>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">AI Response:</p>
            {isEditing ? (
              <div className="mt-2">
                <Textarea value={response} onChange={(e) => setResponse(e.target.value)} className="min-h-[100px]" />
                <div className="mt-2 flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                {isRegenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Regenerating...</span>
                    </div>
                  </div>
                )}
                <p className="mt-1 text-sm text-gray-700">{response}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRegenerate}
              disabled={isEditing || isRegenerating}
              className="flex items-center"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Regenerate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isEditing || isRegenerating}
            >
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopy} disabled={isEditing || isRegenerating}>
              {isCopied ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
