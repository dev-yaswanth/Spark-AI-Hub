---
title: Spark AI Backend
emoji: ⚡
colorFrom: yellow
colorTo: red
sdk: docker
pinned: false
app_port: 7860
---

# S.P.A.R.K. - Smart Personal Assistant for Real-time Knowledge

S.P.A.R.K. is a powerful AI backend API built with Flask, seamlessly integrating multiple advanced AI capabilities into a single cohesive service. It leverages Google's Gemini 2.0 Flash for natural language processing and generic task reasoning, MobileNetV2/TensorFlow for computer vision, and LangChain for agentic capabilities including real-time web search.

## 🌟 Features

*   **Resume Recruitment Critic**: Analyzes resumes (PDF/TXT) against job descriptions using a "brutally honest" persona to provide actionable feedback and ATS scores.
*   **AI Image Classifier**: Uses a pre-trained MobileNetV2 model to classify uploaded images with high accuracy.
*   **Smart Chat Assistant**: A context-aware chatbot powered by `gemini-2.5-flash` with access to real-time `DuckDuckGo` web search.
*   **Analytics**: Logs tool usage and user messages (supports Supabase integration).

## 🚀 Live Demo

This API is ready to be deployed on Hugging Face Spaces (Docker).

**Base URL**: `https://[YOUR-SPACE-NAME].hf.space` (once deployed)

## 🛠️ Tech Stack

*   **Framework**: Flask (Python)
*   **AI Models**: 
    *   LLM: Google Gemini 2.0 Flash
    *   Vision: MobileNetV2 (TensorFlow/Keras)
*   **Orchestration**: LangChain (ReAct agents)
*   **Tools**: DuckDuckGo Search
*   **Database**: Supabase (Optional, falls back to local JSON)

## 📦 Installation & Local Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/spark-ai-hub.git
    cd spark-ai-hub
    ```

2.  **Create a virtual environment**
    ```bash
    python -m venv .venv
    # Windows
    .venv\Scripts\activate
    # Mac/Linux
    source .venv/bin/activate
    ```

3.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    # Optional - for database logging
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_key
    # Optional - admin protection
    ADMIN_SECRET_KEY=spark_admin_2025
    ```

5.  **Run the Server**
    ```bash
    python app.py
    ```
    The server will start at `http://localhost:5000`.

## 🐳 Deployment to Hugging Face Spaces

This project is configured for **Docker** deployment on Hugging Face Spaces.

1.  Create a new [Space on Hugging Face](https://huggingface.co/new-space).
2.  Select **Docker** as the SDK.
3.  Upload the files from this repository to the Space (or connect it to your GitHub repo).
4.  **Important**: Go to the **Settings** tab of your Space and add the following **Secret/Variable**:
    *   `GOOGLE_API_KEY`: Your Google Cloud/AI Studio API Key.
    *   `SUPABASE_URL` (Optional)
    *   `SUPABASE_KEY` (Optional)
5.  The `Dockerfile` will automatically install system dependencies (like `libgl1`) and Python packages, then start the server on port 7860.

## 🔌 API Documentation

### 1. Root / Health Check
*   **GET** `/`
*   Returns service status and available endpoints.

### 2. Resume Review
*   **POST** `/api/resume-review`
*   **Form Data**:
    *   `file`: The resume file (PDF or TXT).
    *   `jobRole`: (Optional) Target job title.
    *   `jobDescription`: (Optional) JD text for comparison.
*   **Response**: JSON containing ATS score, detailed analysis, and suggestions.

### 3. Image Classification
*   **POST** `/api/image-classify`
*   **Form Data**:
    *   `file`: Image file (JPG, PNG).
*   **Response**: JSON with top 3 predicted classes and confidence scores.

### 4. Chat
*   **POST** `/api/chat`
*   **JSON Body**:
    ```json
    {
      "messages": [
        {"role": "user", "content": "Who is the CEO of Google?"}
      ]
    }
    ```
*   **Response**: JSON with the assistant's reply (fetched via web search if needed).

## 📊 Analytics & Admin

*   **GET** `/api/stats?key=ADMIN_SECRET_KEY`: View tool usage statistics.
*   **GET** `/api/messages?key=ADMIN_SECRET_KEY`: View submitted contact form messages.

---

**Developed for the Spark AI Hub Project.**
