#!/bin/bash

# EcoConnect Sphere Development Startup Script

echo "🌱 Starting EcoConnect Sphere Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if environment files exist
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from template..."
    cp backend/env.example backend/.env
    echo "📝 Please edit backend/.env with your MongoDB Atlas connection string"
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found. Creating from template..."
    cp env.example .env
fi

echo "🚀 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo "   Press Ctrl+C to stop both servers"
echo ""

# Start both servers concurrently
npm run fullstack:dev
