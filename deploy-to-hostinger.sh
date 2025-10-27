#!/bin/bash

# Deployment script for PACE Frontend to Hostinger VPS
# This script deploys the frontend to your Hostinger server

echo "=========================================="
echo "PACE Frontend Deployment to Hostinger"
echo "=========================================="
echo ""

# Configuration
SERVER_USER="root"
SERVER_HOST="89.116.187.76"
SERVER_PASSWORD=".u4LJ4Pc?xQ,U;p7zAGX"
FRONTEND_DIR="/root/pace-frontend-modern"
GITHUB_REPO="https://github.com/athomsenofficial/pace-frontend-modern.git"  # Update this with your actual repo

echo "This script will:"
echo "1. SSH into your Hostinger VPS"
echo "2. Clone/update the frontend repository"
echo "3. Build the Docker image"
echo "4. Start the frontend container on port 3000"
echo ""
echo "The frontend will be accessible at: http://89.116.187.76:3000"
echo ""
read -p "Press Enter to continue..."

# Deploy using expect to handle password
expect <<EOF
set timeout 300

spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST
expect "password:"
send "$SERVER_PASSWORD\r"
expect "#"

# Check if directory exists
send "if [ -d $FRONTEND_DIR ]; then echo 'EXISTS'; else echo 'NOT_EXISTS'; fi\r"
expect {
    "EXISTS" {
        send "echo 'Frontend directory exists, pulling latest changes...'\r"
        expect "#"
        send "cd $FRONTEND_DIR && git pull origin main\r"
        expect "#"
    }
    "NOT_EXISTS" {
        send "echo 'Cloning frontend repository...'\r"
        expect "#"
        send "git clone $GITHUB_REPO $FRONTEND_DIR\r"
        expect "#"
    }
}

# Navigate to directory
send "cd $FRONTEND_DIR\r"
expect "#"

# Stop existing container if running
send "echo 'Stopping existing container...'\r"
expect "#"
send "docker stop pace-frontend 2>/dev/null || true\r"
expect "#"
send "docker rm pace-frontend 2>/dev/null || true\r"
expect "#"

# Build and start
send "echo 'Building and starting frontend...'\r"
expect "#"
send "docker compose up -d --build\r"
expect "#"

# Wait for container to start
send "sleep 3\r"
expect "#"

# Check status
send "docker ps | grep pace-frontend\r"
expect "#"

# Test the frontend
send "curl -I http://localhost:3000 2>/dev/null | head -1\r"
expect "#"

send "echo ''\r"
expect "#"
send "echo '========================================='\r"
expect "#"
send "echo 'Deployment Complete!'\r"
expect "#"
send "echo '========================================='\r"
expect "#"
send "echo 'Frontend URL: http://89.116.187.76:3000'\r"
expect "#"
send "echo 'Backend URL: http://89.116.187.76:8000'\r"
expect "#"
send "echo ''\r"
expect "#"

send "exit\r"
expect eof
EOF

echo ""
echo "Deployment finished!"
echo ""
echo "Access your application:"
echo "  Frontend: http://89.116.187.76:3000"
echo "  Backend:  http://89.116.187.76:8000/api/health"
echo ""
