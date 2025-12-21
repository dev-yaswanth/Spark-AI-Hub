# Frontend Setup - Node.js Installation Required

## Problem
You're getting "This site can't be reached" at http://localhost:5173 because **Node.js is not installed** on your system.

## Solution: Install Node.js

### Step 1: Download Node.js
1. Go to: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (.msi file)

### Step 2: Install Node.js
1. Follow the installation wizard
2. ✅ **Important**: Check the box that says "Automatically install the necessary tools"
3. Click "Next" through all screens
4. Click "Install" and wait for completion
5. Restart your PowerShell/Command Prompt

### Step 3: Verify Installation
Open a NEW PowerShell window and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

### Step 4: Install Frontend Dependencies
```powershell
cd c:\Users\MyPC\Downloads\spark\spark-ai-hub-main
npm install
```

This will take a few minutes to download all packages.

### Step 5: Start Frontend Server
```powershell
npm run dev
```

The frontend will start on http://localhost:5173

---

## Quick Start (After Installing Node.js)

Once Node.js is installed, you can use the quick start script:

```powershell
cd c:\Users\MyPC\Downloads\spark
.\start.bat
```

This will start both:
- ✅ Backend (already running): http://localhost:5000
- ✅ Frontend: http://localhost:5173

---

## Alternative: Use Backend Only (Without Frontend)

If you don't want to install Node.js right now, you can test the backend API directly:

### Test Backend Health
Visit in browser: http://localhost:5000/api/health

### Test Resume Review API
Use PowerShell or any API client:
```powershell
# Create a test text file first
"Test resume content" | Out-File -FilePath test_resume.txt

# Test the API (use Invoke-RestMethod or a tool like Postman)
```

### Test Chat API
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"Hello SPARK!"}'
```

---

## Current Status

✅ **Backend**: Running successfully on port 5000  
❌ **Frontend**: Cannot start (Node.js not installed)  
✅ **Tool Files**: No errors detected  

---

## Support

If you encounter any issues during Node.js installation, please let me know!
