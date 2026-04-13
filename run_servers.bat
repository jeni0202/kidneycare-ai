@echo off
echo ===================================================
echo Starting KidneyCare AI Servers...
echo ===================================================

echo Starting Frontend Server on port 8000...
start "Frontend Server" /D "%~dp0" python -m http.server 8000

echo Starting Backend ML API on port 5000...
start "Backend Server" /D "%~dp0machine_learning_deployment" cmd /k ".\venv\Scripts\activate && python app.py"

echo.
echo Both servers have been launched in separate windows!
echo - Frontend: http://localhost:8000
echo - Backend API:  http://localhost:5000
echo ===================================================
pause
