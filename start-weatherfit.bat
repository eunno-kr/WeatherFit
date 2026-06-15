@echo off
cd /d "%~dp0"
echo WeatherFit dev server starting...
echo.
start "" "http://127.0.0.1:5173"
npm.cmd run dev -- --host 127.0.0.1
