import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { useReviewStore } from "../store/useReviewStore"

// Mock data for the charts




export function SentimentCharts() {

  const { reviews } = useReviewStore()

  let posCount = 0
  let negCount = 0
  let neuCount = 0

  for(let i=0; i<reviews.length; i++){
    if(reviews[i].sentiment === "Positive Feedback"){
      posCount = posCount + 1
    }
    else if(reviews[i].sentiment === "Neutral Feedback"){
      neuCount = neuCount + 1
    }else{
      negCount = negCount + 1
    }
  }

  const sentimentData = [
    { name: "Positive", value: posCount, color: "#10b981" },
    { name: "Neutral", value: neuCount, color: "#6b7280" },
    { name: "Negative", value: negCount, color: "#ef4444" }
  ]

  const barData = [
    { name: "Positive", count: posCount, color: "#10b981" },
    { name: "Neutral", count: neuCount, color: "#6b7280" },
    { name: "Negative", count: negCount, color: "#ef4444" },
  ]

  console.log(reviews)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
          <CardDescription>Distribution of positive and negative sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sentiment Counts</CardTitle>
          <CardDescription>Number of each type of sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Count" fill="#3b82f6">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
