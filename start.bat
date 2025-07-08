@echo off
REM SOPA Frontend Docker Startup Script for Windows
REM Usage: start.bat [dev|prod|nginx]

setlocal enabledelayedexpansion

REM Default mode
set MODE=%1
if "%MODE%"=="" set MODE=dev

echo 🐳 SOPA Frontend Docker Setup
echo Mode: %MODE%

REM Function to check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)
echo ✅ Docker is running

REM Function to clean up old containers
echo 🧹 Cleaning up old containers...
docker-compose down --remove-orphans >nul 2>&1

REM Main execution
if "%MODE%"=="dev" (
    echo 🚀 Starting development environment...
    docker-compose up --build sopa-dev
) else if "%MODE%"=="prod" (
    echo 🚀 Starting production environment...
    docker-compose -f docker-compose.prod.yml up --build sopa-frontend
) else if "%MODE%"=="nginx" (
    echo 🚀 Starting production environment with Nginx...
    docker-compose -f docker-compose.prod.yml --profile with-nginx up --build
) else if "%MODE%"=="help" (
    echo Usage: %0 [dev^|prod^|nginx^|help]
    echo.
    echo Options:
    echo   dev     Start development environment ^(default^)
    echo   prod    Start production environment
    echo   nginx   Start production environment with Nginx reverse proxy
    echo   help    Show this help message
    echo.
    echo Examples:
    echo   %0 dev      # Start development server
    echo   %0 prod     # Start production server
    echo   %0 nginx    # Start production with Nginx
) else (
    echo ❌ Invalid mode: %MODE%
    echo Usage: %0 [dev^|prod^|nginx^|help]
    exit /b 1
)

endlocal
