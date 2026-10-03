@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 20 or newer, then reopen this file.
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
echo =========================================
call npm run dev
if errorlevel 1 (
  echo Startup failed. Please copy the error shown above.
  pause
)
