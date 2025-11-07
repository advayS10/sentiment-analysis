"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "./ui/Button"
import { Textarea } from "./ui/Textarea"
import { Card, CardContent } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Copy, Edit, Check } from "lucide-react"

export function TextAnalyzer() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [xgbResult, setXgbResult] = useState(null)
  const [dtcResult, setDtcResult] = useState(null)
  const [robertaResult, setRobertaResult] = useState(null)
  const [aiResponse, setAiResponse] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedResponse, setEditedResponse] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", { text })
      setXgbResult(res.data.xgb_prediction)
      setDtcResult(res.data.dtc_prediction)
      setRobertaResult(res.data.roberta_prediction)
      setAiResponse(res.data.ai_response)
      setEditedResponse(res.data.ai_response)
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedResponse)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = () => {
    setAiResponse(editedResponse)
    setIsEditing(false)
  }

  const getSentimentColor = (sentiment) => {
    if (sentiment === "Positive Feedback") return "bg-green-100 text-green-800"
    if (sentiment === "Negative Feedback") return "bg-red-100 text-red-800"
    if (sentiment === "Neutral Feedback")return "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text-input" className="mb-2 block text-sm font-medium">
          Enter text to analyze
        </label>
        <Textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here for sentiment analysis..."
          className="min-h-[150px]"
        />
      </div>

      <Button onClick={handleSubmit} disabled={!text.trim() || loading} className="w-full sm:w-auto">
        {loading ? "Analyzing..." : "Analyze Sentiment"}
      </Button>

      {(xgbResult || dtcResult || robertaResult) && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Analysis Result</h3>

            <div className="space-y-2">
              {/* <div>
                <span className="text-sm font-medium">XGBoost:</span>{" "}
                <Badge className={getSentimentColor(xgbResult)}>{xgbResult}</Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Decision Tree:</span>{" "}
                <Badge className={getSentimentColor(dtcResult)}>{dtcResult}</Badge>
              </div> */}
              <div>
                {/* <span className="text-sm font-medium">RoBERTa:</span>{" "} */}
                <Badge className={getSentimentColor(robertaResult)}>{robertaResult}</Badge>
              </div>
            </div>

            <div className="mt-4 rounded-md bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">AI Response:</p>
              {isEditing ? (
                <div className="mt-2">
                  <Textarea
                    value={editedResponse}
                    onChange={(e) => setEditedResponse(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-700">{aiResponse}</p>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} disabled={isEditing}>
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={handleCopy} disabled={isEditing}>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
