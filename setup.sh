#!/bin/bash

echo "🚀 Setting up Labour Marketplace Application..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Check if MongoDB is running (optional check)
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is installed but not running. Please start MongoDB service."
        echo "   On Ubuntu/Debian: sudo systemctl start mongod"
        echo "   On macOS: brew services start mongodb-community"
        echo "   On Windows: Start MongoDB service from Services"
    fi
else
    echo "⚠️  MongoDB is not installed. Please install MongoDB v5 or higher."
    echo "   Visit: https://docs.mongodb.com/manual/installation/"
fi

echo ""
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🔧 Setting up environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your configuration values"
    echo "   - MongoDB connection string"
    echo "   - JWT secret key"
    echo "   - AWS S3 credentials (if using)"
    echo "   - Twilio credentials (if using)"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB service"
echo "3. Run the application:"
echo "   - Development mode: npm run dev"
echo "   - Backend only: npm run server"
echo "   - Frontend only: npm run client"
echo ""
echo "Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - Health check: http://localhost:5000/health"
echo ""
echo "Happy coding! 🎉"
