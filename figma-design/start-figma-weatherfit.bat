@echo off
cd /d "%~dp0"
start "" npm.cmd run dev
timeout /t 3 /nobreak > nul
start "" "http://127.0.0.1:5175"
