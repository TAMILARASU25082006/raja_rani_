@echo off
cd /d "%~dp0"
title Raja Rani Royal Game Server

where node >nul 2>nul
if errorlevel 1 (
  echo =========================================================
  echo Node.js was not detected on your system.
  echo Please install Node.js 20 or newer from https://nodejs.org
  echo =========================================================
  pause
  exit /b 1
)

echo %cd% | findstr /i "Temp" >nul
if not errorlevel 1 (
  echo =========================================================
  echo ERROR: You are running this directly from inside a ZIP file!
  echo.
  echo Please RIGHT-CLICK the ZIP file, click "Extract All...",
  echo and open START-GAME.cmd from the EXTRACTED folder.
  echo =========================================================
  pause
  exit /b 1
)

if not exist .env (
  if exist .env.example (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
  )
)

if not exist node_modules (
  echo Installing game dependencies...
  call npm install
  if errorlevel 1 (
    echo Dependency installation failed. Check the error above.
    pause
    exit /b 1
  )
)

echo =========================================
echo 🏰 Starting Raja Rani Game Server...
echo 📡 Website URL: http://localhost:5000
echo =========================================

:: Automatically open browser after server initialization
start /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5000"

call npm run dev
if errorlevel 1 (
  echo.
  echo Server stopped or startup failed. Please copy the error shown above.
  pause
)
