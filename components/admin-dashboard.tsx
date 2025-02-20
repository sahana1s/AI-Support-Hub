import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, MessageSquare, Star } from "lucide-react";
import { StarIcon } from '@heroicons/react/20/solid';

// Define types for chat history, feedback, and analytics
interface ChatHistoryItem {
  role: string;
  content: string;
  issue_type: string;
}

interface FeedbackItem {
  user: string;
  comments: string;
  rating: number;
}

interface Analytics {
  total_chats: number;
  average_rating: number;
  response_time: string;
}

interface AdminDashboardProps {
  adminLoggedIn: boolean;
  setAdminLoggedIn: (value: boolean) => void;
}

export function AdminDashboard({ adminLoggedIn, setAdminLoggedIn }: AdminDashboardProps) {
  // Define state with the correct types
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    setLoading(true); // Start loading state

    // Fetch chat history
    fetch("http://127.0.0.1:5000/api/get-chat-history")
      .then((response) => response.json())
      .then((data) => {
        console.log("Chat History:", data); // Log the response to ensure correct data
        setChatHistory(data.chat_history);
      })
      .catch((error) => console.error("Error fetching chat history:", error));

    // Fetch feedback
    fetch("http://127.0.0.1:5000/api/get-feedback")
      .then((response) => response.json())
      .then((data) => {
        console.log("Feedback:", data); // Log the response to ensure correct data
        setFeedback(data.feedback);
      })
      .catch((error) => console.error("Error fetching feedback:", error));

    // Fetch analytics
    fetch("http://127.0.0.1:5000/api/get-analytics")
      .then((response) => response.json())
      .then((data) => {
        console.log("Analytics:", data); // Log the response to ensure correct data
        setAnalytics(data.analytics);
      })
      .catch((error) => console.error("Error fetching analytics:", error))
      .finally(() => setLoading(false)); // End loading state
  }, []);

  if (!adminLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Admin Login Form */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <CardDescription>Manage customer support data and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat History
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <Star className="mr-2 h-4 w-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Chat History</h3>
                <div className="bg-muted p-4 rounded-lg">
                  {loading ? (
                    <p>Loading chat history...</p>
                  ) : chatHistory.length > 0 ? (
                    chatHistory.map((message, index) => (
                      <div key={index}>
                        <strong>{message.role}: </strong>
                        {message.content}
                        <div>
                          <strong>Issue Type:</strong> {message.issue_type}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No chat history available.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="feedback">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Feedback & Ratings</h3>
                <div className="bg-muted p-4 rounded-lg">
                  {loading ? (
                    <p>Loading feedback...</p>
                  ) : feedback.length > 0 ? (
                    feedback.map((feedbackItem, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex items-center space-x-2">
                          <strong>{feedbackItem.user}</strong>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-5 w-5 ${i < feedbackItem.rating ? "text-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p>{feedbackItem.comments}</p>
                      </div>
                    ))
                  ) : (
                    <p>No feedback available.</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Support Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Chats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{analytics?.total_chats || "N/A"}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{analytics?.average_rating || "N/A"}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{analytics?.response_time || "N/A"}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
