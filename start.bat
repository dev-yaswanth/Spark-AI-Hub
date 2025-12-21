@echo off
echo ============================================================
echo SPARK AI Tools - Quick Start Guide
echo ============================================================
echo.
echo This will start both the backend and frontend servers.
echo.
echo STEP 1: Starting Backend Server (Flask)
echo ============================================================
cd /d "%~dp0"
start "SPARK Backend" cmd /k ".\.venv\Scripts\activate && python app.py"
echo Backend started on http://localhost:5000
echo.
timeout /t 3 /nobreak >nul
echo.
echo STEP 2: Starting Frontend Server (React + Vite)
echo ============================================================
cd spark-ai-hub-main
start "SPARK Frontend" cmd /k "npm run dev"
echo Frontend will start on http://localhost:5173
echo.
echo ============================================================
echo IMPORTANT:
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Keep both terminal windows open while using the app.
echo Press Ctrl+C in each window to stop the servers.
echo ============================================================
pause
