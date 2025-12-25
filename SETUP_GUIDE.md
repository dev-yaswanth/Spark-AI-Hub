# 🚀 S.P.A.R.K. Hub: Complete Setup Guide

This guide will show you exactly how to run your AI Hub on your own computer or put it on the internet for everyone to see.

---

## 🔑 Part 1: Your Secret Keys (The "Brains")

You need these keys for the AI to work and for messages to be saved.

### 1. Google Gemini API Key
*   **What it does**: Powers the ChatBot and Resume Reviewer.
*   **Where to get it**: [Google AI Studio](https://aistudio.google.com/app/apikey)
*   **How**: Click "Create API key in new project" and copy the long code.

### 2. Supabase Keys (Database)
*   **What it does**: Saves your contact messages forever.
*   **Where to get it**: [Supabase.com](https://supabase.com/)
*   **How**: 
    1. Create a free project.
    2. Go to **Project Settings** (gear icon) -> **API**.
    3. Copy the **Project URL**.
    4. Copy the **anon public API Key**.
*   **Setup the Table**: Go to the **SQL Editor** tab in Supabase, paste this code, and click "Run":
    ```sql
    CREATE TABLE messages (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT,
      email TEXT,
      message TEXT
    );
    ```

---

## 💻 Part 2: Running Locally (On your Computer)

### 1. Setup Backend (The Engine)
1. Open the main `spark` folder in your code editor.
2. Create a file named `.env` and paste your keys:
   ```env
   GOOGLE_API_KEY=your_gemini_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_KEY=your_supabase_key_here
   ```
3. Open a terminal and run:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

### 2. Setup Frontend (The Website)
1. Go into the `spark-ai-hub-main` folder.
2. Create a `.env` file here:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
3. Open a terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the link shown (usually `http://localhost:5173`).

---

## ☁️ Part 3: Hosting on the Internet (Cloud)

### 1. Backend: Hugging Face (HG)
1. Go to [Hugging Face](https://huggingface.co/new-space).
2. Create a new **Space**. Select **Docker** as the SDK.
3. Upload these files from your computer: `app.py`, `requirements.txt`, `Dockerfile`, `.dockerignore`, `README.md`.
4. Go to **Settings** -> **Variables and secrets**.
5. Add these 3 **Secrets**:
   - `GOOGLE_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
6. Your Space will build and give you a URL (e.g., `https://your-name-spark.hf.space`). **Copy this URL.**

### 2. Frontend: Vercel
1. Upload your `spark-ai-hub-main` folder to **GitHub**.
2. Go to [Vercel](https://vercel.com/new) and import the GitHub repository.
3. Before clicking "Deploy", open **Environment Variables**.
4. Add one variable:
   - **Key**: `VITE_API_URL`
   - **Value**: (Paste your Hugging Face Space URL from Step 6).
5. Click **Deploy**.

---

## 📝 Summary of Variables Needed
| Name | Where it goes | Where to get it |
| :--- | :--- | :--- |
| `GOOGLE_API_KEY` | HF Secrets / Local `.env` | Google AI Studio |
| `SUPABASE_URL` | HF Secrets / Local `.env` | Supabase Settings |
| `SUPABASE_KEY` | HF Secrets / Local `.env` | Supabase Settings |
| `VITE_API_URL` | Vercel Env / Local `.env` | Your Hugging Face URL |

**You are all set! Your AI Hub is now professional and persistent!** 🚀
