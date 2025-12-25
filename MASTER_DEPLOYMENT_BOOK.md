# 📔 S.P.A.R.K. Hub: The Master Deployment Book

This is a comprehensive, click-by-click guide to managing your AI Assistant Hub. It covers everything from initial setup to cloud scaling and database management.

---

## 📑 Table of Contents
1.  [🔑 The Key Vault (API Keys)](#-the-key-vault-api-keys)
2.  [🗄️ The Memory Bank (Supabase)](#-the-memory-bank-supabase)
3.  [💻 Local Development (Your PC)](#-local-development-your-pc)
4.  [🚀 Cloud Hosting: Backend (Hugging Face)](#-cloud-hosting-backend-hugging-face)
5.  [🌐 Cloud Hosting: Frontend (Vercel)](#-cloud-hosting-frontend-vercel)
6.  [🛠️ Maintenance & Troubleshooting](#-maintenance--troubleshooting)

---

## 🔑 1. The Key Vault (API Keys)

Your app needs "brains" (Gemini) and "memory" (Supabase).

### A. Google Gemini (The Brains)
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google Account.
3.  On the left, click **"Get API key"**.
4.  Click **"Create API key in new project"**.
5.  **Copy the key** and save it in a safe place. 
    *   *Note: Never share this key or post it on GitHub.*

### B. Supabase (The Memory)
1.  Go to [Supabase](https://supabase.com/).
2.  Click **"New Project"**.
3.  Give it a name (e.g., `spark-db`) and a secure password.
4.  Wait ~2 minutes for the database to wake up.

---

## 🗄️ 2. The Memory Bank (Supabase)

Once your Supabase project is ready, you must tell it how to store your messages.

### A. Creating the Table
1.  On the left sidebar, click the **"SQL Editor"** icon (looks like a square with a `>_` inside).
2.  Click **"New query"**.
3.  Paste this exact code:
    ```sql
    CREATE TABLE messages (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      name TEXT,
      email TEXT,
      message TEXT
    );
    ```
4.  Click the **"Run"** button at the bottom right. You should see "Success".

### B. Getting your Connection Keys
1.  Click the **"Settings"** icon (gear) at the bottom left.
2.  Click **"API"**.
3.  You need two things from here:
    *   **Project URL**: (Example: `https://xyz.supabase.co`)
    *   **Project API keys (anon/public)**: (The long string of text).

---

## 💻 3. Local Development (Your PC)

Use this to test new features before putting them on the internet.

### A. Backend Setup
1.  Open the `spark` folder in VS Code.
2.  Create a file called `.env`.
3.  Paste this, replacing the values with your actual keys:
    ```env
    GOOGLE_API_KEY=your_gemini_key
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key
    ```
4.  Open your terminal and run these commands:
    ```powershell
    python -m venv .venv
    .\.venv\Scripts\activate
    pip install -r requirements.txt
    python app.py
    ```
    *You should see "Server running on http://localhost:5000"*

### B. Frontend Setup
1.  Open a **new** terminal window.
2.  Go into the frontend folder: `cd spark-ai-hub-main`
3.  Create a file called `.env`:
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Run these commands:
    ```bash
    npm install
    npm run dev
    ```
5.  Open `http://localhost:5173` in your browser.

---

## 🚀 4. Cloud Hosting: Backend (Hugging Face)

This makes your "brain" run 24/7 in the cloud.

### A. Create the Space
1.  Go to [Hugging Face Spaces](https://huggingface.co/new-space).
2.  **Name**: `spark-api` (or whatever you like).
3.  **SDK**: Choose **Docker**.
4.  **Template**: Choose **Blank**.
5.  Click **"Create Space"**.

### B. Uploading Files
In the "Files" tab of your Space, upload these files:
- `app.py`
- `requirements.txt`
- `Dockerfile`
- `.dockerignore`
- `README.md`

### C. Adding the Secrets
1.  Go to the **"Settings"** tab of your Space.
2.  Scroll down to **"Variables and secrets"**.
3.  Add 3 "New secret" items:
    - `GOOGLE_API_KEY`
    - `SUPABASE_URL`
    - `SUPABASE_KEY`
4.  Your Space will automatically "build". Once it says **"Running"**, copy the URL (from the "Embed this Space" button or the browser bar).
    *   *Warning: The URL should look like `https://name-space.hf.space`*

---

## 🌐 5. Cloud Hosting: Frontend (Vercel)

This makes your website live for the world.

### A. Push to GitHub
1.  Create a new repository on [GitHub](https://github.com/new).
2.  Upload the **contents** of `spark-ai-hub-main` to this repository.

### B. Import to Vercel
1.  Go to [Vercel](https://vercel.com/new).
2.  Connect your GitHub and import the `spark-ai-hub-main` repo.
3.  **CRITICAL STEP**: Before clicking Deploy, expand the **"Environment Variables"** section.
4.  Add:
    - **Name**: `VITE_API_URL`
    - **Value**: Your Hugging Face URL (e.g., `https://dev-yaswanth-spark.hf.space`)
5.  Click **"Deploy"**.

---

## 🛠️ 6. Maintenance & Troubleshooting

### Q: Why does the chat say "API Limit Reached"?
*   **Reason**: You are likely on the free tier of Gemini.
*   **Fix**: Wait 1 minute. If you need more power, enable billing in Google Cloud Console.

### Q: Why are my messages not in Supabase?
*   **Check 1**: Did you run the SQL script in Part 2?
*   **Check 2**: Are the `SUPABASE_URL` and `SUPABASE_KEY` correct in your Hugging Face Secrets?
*   **Check 3**: Look at the Hugging Face logs. If you see "Permission denied", use the latest `app.py`.

### Q: How do I update my app?
1.  Change your code locally.
2.  Upload the new `app.py` to Hugging Face (it will auto-update).
3.  Push your frontend changes to GitHub (Vercel will auto-update).

---

**You are now the master of your S.P.A.R.K. Hub! 🌟**
