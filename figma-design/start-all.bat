@echo off
echo WeatherFit 서버 시작 중...

:: 루트 버전 (5173)
start "WeatherFit 5173" /d "D:\WeatherFit" cmd /k npm.cmd run dev

:: 피그마 버전 (5175)
start "WeatherFit Figma 5175" /d "D:\WeatherFit\figma-design" cmd /k npm.cmd run dev

:: 서버 뜨는 시간 대기
timeout /t 5 /nobreak > nul

:: 브라우저 오픈
start "" "http://localhost:5175"
