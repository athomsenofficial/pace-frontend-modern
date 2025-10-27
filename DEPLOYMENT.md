# PACE Frontend Deployment Guide

This guide explains how to deploy your PACE frontend to Hostinger VPS.

## Prerequisites

- Hostinger VPS with Docker installed (already configured)
- Backend running at http://89.116.187.76:8000
- Frontend code pushed to GitHub

## Deployment Options

### Option 1: Automated Deployment (Recommended)

1. **First, push your frontend code to GitHub:**
   ```bash
   cd /Users/drew/Coding/pace-frontend-modern
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pace-frontend-modern.git
   git push -u origin main
   ```

2. **Update the deployment script:**
   - Open `deploy-to-hostinger.sh`
   - Update the `GITHUB_REPO` variable with your actual repository URL

3. **Run the deployment script:**
   ```bash
   ./deploy-to-hostinger.sh
   ```

The script will:
- SSH into your server
- Clone/pull the latest code
- Build the Docker image
- Start the frontend container
- Make it accessible at http://89.116.187.76:3000

### Option 2: Manual Deployment

#### Step 1: Push Code to GitHub

First, create a new repository on GitHub for your frontend, then:

```bash
cd /Users/drew/Coding/pace-frontend-modern
git init
git add .
git commit -m "Initial frontend deployment"
git remote add origin https://github.com/YOUR_USERNAME/pace-frontend-modern.git
git push -u origin main
```

#### Step 2: SSH into Your Server

```bash
ssh root@89.116.187.76
# Password: .u4LJ4Pc?xQ,U;p7zAGX
```

#### Step 3: Clone the Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/pace-frontend-modern.git
cd pace-frontend-modern
```

#### Step 4: Build and Deploy

```bash
# Build and start the frontend
docker compose up -d --build

# Check if it's running
docker ps | grep pace-frontend

# Test the frontend
curl -I http://localhost:3000
```

#### Step 5: Update and Redeploy (for future updates)

```bash
ssh root@89.116.187.76
cd ~/pace-frontend-modern
git pull origin main
docker compose down
docker compose up -d --build
```

## Accessing Your Application

After deployment:

- **Frontend:** http://89.116.187.76:3000
- **Backend:** http://89.116.187.76:8000

## Environment Variables

The production build uses the `.env` file in your repository. Make sure it contains:

```
VITE_API_URL=http://89.116.187.76:8000
VITE_ENV=production
```

## Port Configuration

The frontend runs on port 3000 by default. To change this:

1. Edit `docker-compose.yml`
2. Change the port mapping: `"YOUR_PORT:80"`
3. Rebuild: `docker compose up -d --build`

## Custom Domain Setup (Optional)

To use a custom domain like `pace.yourdomain.com`:

1. **Add DNS A Record:**
   - Point your domain to: `89.116.187.76`

2. **Update nginx configuration** to include your domain:
   - Edit `nginx.conf`
   - Change `server_name _;` to `server_name pace.yourdomain.com;`

3. **Set up SSL with Let's Encrypt** (recommended):
   ```bash
   # On your server
   apt-get update
   apt-get install certbot python3-certbot-nginx
   certbot --nginx -d pace.yourdomain.com
   ```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs pace-frontend

# Check if port is already in use
lsof -i :3000
```

### Frontend can't reach backend
- Verify backend is running: `curl http://localhost:8000/api/health`
- Check `.env` file has correct `VITE_API_URL`
- Rebuild frontend: `docker compose up -d --build`

### 404 errors on refresh
- This is handled by nginx.conf - make sure it's properly copied during build
- The `try_files` directive ensures React Router works correctly

## Architecture

```
[User] → [Port 3000] → [Nginx Container] → [React App]
                    ↓
            [Port 8000] → [Backend Container]
                    ↓
            [Port 6379] → [Redis Container]
```

## Files Overview

- `Dockerfile` - Multi-stage build (Node.js build + Nginx serve)
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Web server configuration for React SPA
- `.dockerignore` - Files to exclude from Docker build
- `deploy-to-hostinger.sh` - Automated deployment script

## Quick Reference

```bash
# View frontend logs
docker logs -f pace-frontend

# Restart frontend
docker restart pace-frontend

# Stop frontend
docker stop pace-frontend

# Remove frontend
docker stop pace-frontend && docker rm pace-frontend

# Rebuild from scratch
docker compose down
docker compose up -d --build
```
