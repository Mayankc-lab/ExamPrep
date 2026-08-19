@echo off
cd /d D:\mayank\lms_yt\new
echo Starting Development Stack...
echo.
echo [1/2] Starting Backend API on port 5000...
start "LMS Backend" cmd /k "cd Server && node server.js"
echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak
echo.
echo [2/2] Starting Frontend on port 5173/5174...
start "LMS Frontend" cmd /k "cd Client && npm run dev"
echo.
echo Development stack started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 or http://localhost:5174
