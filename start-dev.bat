@echo off

REM EcoConnect Sphere Development Startup Script for Windows

echo 🌱 Starting EcoConnect Sphere Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Check if environment files exist
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating from template...
    copy backend\env.example backend\.env
    echo 📝 Please edit backend\.env with your MongoDB Atlas connection string
)

if not exist ".env" (
    echo ⚠️  Frontend .env file not found. Creating from template...
    copy env.example .env
)

echo 🚀 Starting development servers...
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo    Press Ctrl+C to stop both servers
echo.

REM Start both servers concurrently
npm run fullstack:dev

pause
