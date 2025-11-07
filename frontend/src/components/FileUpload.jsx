"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { Alert, AlertDescription } from "./ui/Alert"
import { AlertCircle, Upload } from "lucide-react"
import { useReviewStore } from "../store/useReviewStore"

export function FileUpload() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { setReviews } = useReviewStore()


  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError("")
    setIsSuccess(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setError("")
    setIsSuccess(false)

    if (!file) {
      setError("Please select a CSV file")
      return
    }

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    setIsLoading(true)

    try {
      const res = await axios.post("http://localhost:5000/upload", formData)
      setReviews(res.data)
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to upload file. Please try again."
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="bg-green-50 text-green-800">
          <AlertDescription>File uploaded successfully! Data is being processed.</AlertDescription>
        </Alert>
      )}

      <div className="grid w-full gap-1.5">
        <Label htmlFor="csv">Upload CSV file with feedback data</Label>
        <Input id="csv" type="file" accept=".csv" onChange={handleFileChange} className="mt-1" />
        <p className="text-sm text-muted-foreground">The CSV should contain a column for feedback text.</p>
      </div>

      <Button type="submit" disabled={isLoading}>
        <Upload className="mr-2 h-4 w-4" />
        {isLoading ? "Uploading..." : "Upload and Analyze"}
      </Button>
    </form>
  )
}
