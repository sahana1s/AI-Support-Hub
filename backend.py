from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from cryptography.fernet import Fernet
import json

app = Flask(__name__)
CORS(app)

# Set your Gemini API key
GEMINI_API_KEY = "AIzaSyAT0-qu5N_T5IdzDK5iBnXg221Cbn293zs"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# In-memory data for chat history, feedback, and analytics
chat_history = []
feedback_data = [
    {"user": "user", "rating": 4, "comments": "The support was helpful, but the response time could be improved."},
    {"user": "user", "rating": 5, "comments": "Excellent support! Everything was resolved quickly."},
    {"user": "user", "rating": 3, "comments": "It took a bit too long to get a response, but the solution was useful."},
    {"user": "user", "rating": 2, "comments": "The response was not helpful. I expected more details."}
]

analytics_data = {
    "total_chats": len(chat_history),
    "average_rating": sum(feedback["rating"] for feedback in feedback_data) / len(feedback_data) if feedback_data else 0,
    "response_time": "N/A"
}

# Secret key for encryption (Keep this safe, use environment variables for production)
SECRET_KEY = Fernet.generate_key()
cipher = Fernet(SECRET_KEY)

# Helper function to encrypt data
def encrypt_data(data):
    json_data = json.dumps(data)  # Convert to JSON string
    encrypted_data = cipher.encrypt(json_data.encode())  # Encrypt the JSON string
    return encrypted_data

# Helper function to decrypt data
def decrypt_data(encrypted_data):
    decrypted_data = cipher.decrypt(encrypted_data)  # Decrypt the data
    return json.loads(decrypted_data.decode())  # Convert back to JSON

@app.route("/api/get-chat-history", methods=["GET"])
def get_chat_history():
    # Return the chat history data
    return jsonify({"chat_history": chat_history})

@app.route("/api/get-feedback", methods=["GET"])
def get_feedback():
    # Return the feedback data
    return jsonify({"feedback": feedback_data})

@app.route("/api/get-analytics", methods=["GET"])
def get_analytics():
    # Return the analytics data
    return jsonify({"analytics": analytics_data})

@app.route("/api/get-response", methods=["POST"])
def get_response():
    # Handle the generation of AI responses
    data = request.json
    dispute_type = data.get("dispute_type")
    user_prompt = data.get("user_prompt")

    if not dispute_type or not user_prompt:
        return jsonify({"error": "Dispute type and user prompt are required."}), 400

    try:
        # Encrypt sensitive user data for security
        encrypted_data = encrypt_data({"dispute_type": dispute_type, "user_prompt": user_prompt})

        # Filter query based on dispute type and user prompt
        filtered_query = f"Dispute Type: {dispute_type}. Issue: {user_prompt}"

        # Fine-tune the model's response to only address relevant queries and reject others
        # Add context to focus the model on giving concise and relevant answers
        prompt = (
            f"Customer Query: {filtered_query}\n"
            "Provide a short, clear, and specific answer only related to this query. "
            "Answer to the customer giving placeholders for further information, or ask follow-up questions."
            "Answers have to be precise, actionable and empathetic."
            "If the query is unrelated or out of scope, politely decline the request with a brief message, "
            "keeping the tone neutral and to the point. Do not exceed 200 words."
        )

        # Generate AI response
        response = model.generate_content(prompt).text.strip()

        # Enforce word limit (max 200 words)
        response_words = response.split()
        if len(response_words) > 200:
            response = "Sorry, the answer is too long. Please narrow down your query for a more concise response."

        # Add the user message and AI response to chat history
        chat_history.append({"role": "user", "content": user_prompt})
        chat_history.append({"role": "assistant", "content": response})

        # Increment the total chats count in analytics
        analytics_data["total_chats"] += 1

        # Return encrypted data
        return jsonify({"response": response, "encrypted_data": encrypted_data.decode()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/add-chat", methods=["POST"])
def add_chat():
    # Allow the admin to add a chat entry (for example, when new interactions are recorded)
    data = request.json
    user_message = data.get("user_message")
    assistant_message = data.get("assistant_message")

    if not user_message or not assistant_message:
        return jsonify({"error": "User and assistant messages are required."}), 400

    new_chat = {"role": "user", "content": user_message}
    chat_history.append(new_chat)

    new_chat = {"role": "assistant", "content": assistant_message}
    chat_history.append(new_chat)

    # Increment the total chats count in analytics
    analytics_data["total_chats"] += 1

    return jsonify({"message": "Chat added successfully!"})

@app.route("/api/add-feedback", methods=["POST"])
def add_feedback():
    # Allow the admin to add feedback (e.g., after resolving a customer issue)
    data = request.json
    user = data.get("user")
    rating = data.get("rating")
    comments = data.get("comments")

    if not user or not rating or not comments:
        return jsonify({"error": "User, rating, and comments are required."}), 400

    # Add feedback to the data
    feedback_data.append({"user": user, "rating": rating, "comments": comments})

    # Update the average rating in analytics
    total_rating = sum([feedback["rating"] for feedback in feedback_data])
    analytics_data["average_rating"] = total_rating / len(feedback_data)

    return jsonify({"message": "Feedback added successfully!"})

@app.route("/api/update-analytics", methods=["POST"])
def update_analytics():
    # Allow the admin to update analytics data, e.g., after new chats are recorded
    data = request.json
    total_chats = data.get("total_chats")
    response_time = data.get("response_time")

    if total_chats is not None:
        analytics_data["total_chats"] = total_chats

    if response_time:
        analytics_data["response_time"] = response_time

    return jsonify({"message": "Analytics updated successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
