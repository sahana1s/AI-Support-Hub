import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Users, MessageCircle, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AI Support Hub</h1>
            <p className="text-xl text-gray-600 mb-6">Empower your customer support with cutting-edge AI technology</p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/placeholder.jpg?height=300&width=600"
              alt="AI Support Hub"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>AI-Powered Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get instant, accurate responses powered by advanced AI technology</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Provide round-the-clock support to your customers, anytime, anywhere</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Personalized Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Tailor support to individual customer needs for higher satisfaction</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Insightful Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain valuable insights from customer interactions to improve your service
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
