"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Send, Star, ThumbsUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export function CustomerSupport() {
  const [disputeType, setDisputeType] = useState("")
  const [userPrompt, setUserPrompt] = useState("")
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!userPrompt.trim()) return

    setIsLoading(true)

    // Add user message to chat history
    setChatHistory([...chatHistory, { role: "user", content: userPrompt }])

    // Call backend API to generate AI response
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dispute_type: disputeType,
          user_prompt: userPrompt,
        }),
      })
      

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Add AI response to chat history
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }

    setIsLoading(false)

    // Clear user input
    setUserPrompt("")
  }

  const handleFeedbackSubmit = () => {
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    })
    setRating(0)
    setFeedback("")
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Customer Support Chat</CardTitle>
          <CardDescription>Select a dispute type and describe your issue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={(value) => setDisputeType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a dispute type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product Quality Issue</SelectItem>
                <SelectItem value="shipping">Shipping Issue</SelectItem>
                <SelectItem value="billing">Billing Discrepancy</SelectItem>
                <SelectItem value="service">Service Complaint</SelectItem>
              </SelectContent>
            </Select>

            {disputeType && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Guidance</AlertTitle>
                <AlertDescription>
                  {disputeType === "product" &&
                    "Please provide details about the product, including defects, damages, or dissatisfaction."}
                  {disputeType === "shipping" &&
                    "Please provide details such as tracking number, delivery date, or condition upon arrival."}
                  {disputeType === "billing" && "Please specify the charge or transaction that appears incorrect."}
                  {disputeType === "service" &&
                    "Please explain the issue related to the service you received (e.g., delays, unprofessional behavior)."}</AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-2">
              <Textarea
                placeholder="Describe your issue here..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={handleSubmit} disabled={isLoading}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>

            {isLoading && (
              <div className="text-center">
                <Progress value={33} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">AI is thinking...</p>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${message.role === "user" ? "bg-blue-100" : "bg-green-100"}`}
                >
                  <p className="font-semibold">{message.role === "user" ? "You" : "AI Assistant"}</p>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <p className="font-semibold">Rate your experience:</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant={rating >= star ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRating(star)}
                >
                  <Star className={`h-4 w-4 ${rating >= star ? "text-yellow-400 fill-yellow-400" : ""}`} />
                </Button>
              ))}
            </div>
            <Textarea
              placeholder="Additional feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleFeedbackSubmit}>
              <ThumbsUp className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
