# Quick Start - Deploy Frontend to Hostinger

Follow these steps to deploy your frontend to Hostinger VPS in under 5 minutes.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `pace-frontend-modern`
3. Keep it **Private** (recommended) or Public
4. Don't initialize with README (we have files already)
5. Click "Create repository"

## Step 2: Push Code to GitHub

Copy your repository URL from GitHub, then run:

```bash
cd /Users/drew/Coding/pace-frontend-modern

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial deployment - PACE Frontend"

# Add your GitHub repository (replace with YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/pace-frontend-modern.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Update Deployment Script

Open `deploy-to-hostinger.sh` and update line 14:

```bash
GITHUB_REPO="https://github.com/YOUR_USERNAME/pace-frontend-modern.git"
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Deploy!

Run the deployment script:

```bash
./deploy-to-hostinger.sh
```

The script will automatically:
- SSH into your Hostinger VPS
- Clone your frontend repository
- Build the Docker container
- Start the frontend on port 3000

## Step 5: Access Your App

Once deployed, access your application:

- **Frontend:** http://89.116.187.76:3000
- **Backend API:** http://89.116.187.76:8000

## That's It! 🎉

Your frontend is now deployed and running on Hostinger.

---

## Updating Your Frontend (For Future Changes)

When you make changes to your frontend:

```bash
# 1. Commit and push changes
git add .
git commit -m "Updated XYZ feature"
git push

# 2. Redeploy
./deploy-to-hostinger.sh
```

---

## Alternative: Manual Deployment (No Script)

If you prefer to deploy manually:

```bash
# SSH into server
ssh root@89.116.187.76
# Password: .u4LJ4Pc?xQ,U;p7zAGX

# Clone repository (first time only)
git clone https://github.com/YOUR_USERNAME/pace-frontend-modern.git
cd pace-frontend-modern

# Build and start
docker compose up -d --build

# Check status
docker ps | grep pace-frontend

# Exit
exit
```

For updates:
```bash
ssh root@89.116.187.76
cd pace-frontend-modern
git pull
docker compose down
docker compose up -d --build
exit
```

---

## Troubleshooting

**Issue: Script fails with "command not found: expect"**
```bash
# Install expect on your Mac
brew install expect
```

**Issue: Can't access http://89.116.187.76:3000**
```bash
# SSH into server and check logs
ssh root@89.116.187.76
docker logs pace-frontend
```

**Issue: Frontend shows old version**
- Clear browser cache (Cmd+Shift+R on Mac)
- Check if deployment actually updated: `docker logs pace-frontend`

---

## Need More Help?

See `DEPLOYMENT.md` for detailed documentation including:
- Custom domain setup
- SSL certificate installation
- Port configuration
- Architecture overview
