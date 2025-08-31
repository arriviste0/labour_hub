@echo off
echo 🚀 Setting up Labour Marketplace Application...
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

echo.
echo 📦 Installing dependencies...

REM Install backend dependencies
echo Installing backend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd client
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo 🔧 Setting up environment...

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please edit .env file with your configuration values
    echo    - MongoDB connection string
    echo    - JWT secret key
    echo    - AWS S3 credentials (if using)
    echo    - Twilio credentials (if using)
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎯 Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Start MongoDB service
echo 3. Run the application:
echo    - Development mode: npm run dev
echo    - Backend only: npm run server
echo    - Frontend only: npm run client
echo.
echo Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo    - Health check: http://localhost:5000/health
echo.
echo Happy coding! 🎉
pause
