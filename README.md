# SPARK AI Tools - Quick Start

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Google API Key in `.env` file

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd c:\Users\MyPC\Downloads\spark
pip install -r requirements.txt
```

### 2. Start Backend Server
```bash
cd c:\Users\MyPC\Downloads\spark
python app.py
```
The backend will run on `http://localhost:5000`

### 3. Start Frontend Server (in a new terminal)
```bash
cd c:\Users\MyPC\Downloads\spark\spark-ai-hub-main
npm run dev
```
The frontend will run on `http://localhost:5173`

## Quick Start
Alternatively, use the provided batch script:
```bash
cd c:\Users\MyPC\Downloads\spark
start.bat
```

## Available Tools

### 1. Resume Reviewer
- URL: http://localhost:5173/tools/resume-reviewer
- Upload PDF or TXT resume files
- Get AI-powered feedback and suggestions

### 2. Image Classifier
- URL: http://localhost:5173/tools/image-classifier
- Upload JPG/PNG images
- Get classification results with confidence scores

### 3. ChatBot
- URL: http://localhost:5173/tools/chatbot
- Real-time AI conversation
- Powered by Google Gemini 2.0 Flash

## Troubleshooting

**Backend won't start:**
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Check that `.env` file contains valid `GOOGLE_API_KEY`

**Frontend shows API errors:**
- Ensure backend is running on http://localhost:5000
- Check backend terminal for error messages

**CORS errors:**
- Backend has CORS enabled for all origins
- Make sure you're accessing frontend from http://localhost:5173
