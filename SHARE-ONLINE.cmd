@echo off
cd /d "%~dp0"
title Raja Rani - Online Share Link
echo =========================================================
echo 👑 Generating Online Public Link for Raja Rani Game...
echo 🌍 Anyone in the world can play using this link!
echo =========================================================
echo.
if not exist cloudflared.exe (
  echo Downloading Cloudflare tunnel helper...
  curl -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
)
echo.
echo Starting tunnel... Look for the link ending in .trycloudflare.com below:
echo =========================================================
cloudflared.exe tunnel --protocol http2 --url http://localhost:5000
pause
