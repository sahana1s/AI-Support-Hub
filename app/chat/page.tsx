import { CustomerSupport } from "@/components/customer-support"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Support Chat</h1>
      <CustomerSupport />
    </div>
  )
}
