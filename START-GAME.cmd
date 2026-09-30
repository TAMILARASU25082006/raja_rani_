@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22 LTS or newer, then reopen this file.
  pause
  exit /b 1
)
call npm ci
if errorlevel 1 (
  echo Dependency installation failed. Check the error above.
  pause
  exit /b 1
)
call npm start -- --open
if errorlevel 1 echo Startup failed. Please copy the error shown above.
pause
