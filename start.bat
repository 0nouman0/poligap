@echo off
echo Starting Poligap with Neon DB...
echo.

echo Starting backend server...
start /B "Backend" powershell -Command "cd backend; npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
npm run dev

echo.
echo Both servers are running:
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:3001
echo.
pause
