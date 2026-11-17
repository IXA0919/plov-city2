@echo off
cd /d "%~dp0"
start "Plov City server" /min node --env-file=.env server.mjs
timeout /t 2 /nobreak >nul
start "" http://localhost:3001
