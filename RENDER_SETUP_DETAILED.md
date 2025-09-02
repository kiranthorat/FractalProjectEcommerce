# 🚀 Detailed Render Setup Guide - Connect GitHub Repository

## Step 1: Sign Up for Render

1. **Go to Render.com**
   - Visit: https://render.com
   - Click the **"Get Started for Free"** button (usually blue button in top right)

2. **Sign Up with GitHub**
   - Click **"Sign up with GitHub"** (recommended)
   - This will redirect you to GitHub
   - Click **"Authorize Render"** to allow Render to access your repositories
   - You'll be redirected back to Render dashboard

## Step 2: Connect Your GitHub Repository

1. **Access Your Dashboard**
   - After signing up, you'll see the Render dashboard
   - Look for a **"New +"** button (usually in top right corner)

2. **Create New Web Service**
   - Click **"New +"**
   - Select **"Web Service"** from the dropdown menu

3. **Connect Repository**
   - You'll see a page titled "Create a new Web Service"
   - Look for **"Connect a repository"** section
   - You'll see two options:
     - **"Connect GitHub"** (if not already connected)
     - **"Import from GitHub"** (if already connected)

4. **Find Your Repository**
   - In the repository list, look for: **`FractalProjectEcommerce`**
   - If you don't see it immediately:
     - Use the search box to type "FractalProject"
     - Make sure the repository is public on GitHub
     - Check that you're looking under your username (not an organization)

5. **Connect the Repository**
   - Click **"Connect"** button next to `FractalProjectEcommerce`
   - Render will analyze your repository (takes a few seconds)

## Step 3: Configure Web Service Settings

After connecting the repository, you'll see a configuration form:

### Basic Information:
```
Name: fractal-ecommerce
(or any name you prefer - this will be part of your URL)

Environment: Python 3
(Render should auto-detect this)

Region: 
Select the region closest to you:
- Oregon (US West)
- Ohio (US East) 
- Frankfurt (Europe)
- Singapore (Asia)

Branch: master
(This should be auto-selected)

Root Directory: 
(Leave this EMPTY - don't type anything)
```

### Build & Deploy Settings:
```
Build Command:
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ../ecom && python manage.py collectstatic --noinput

Start Command:
cd ecom && gunicorn ecom.wsgi:application
```

### Environment Variables:
Click **"Add Environment Variable"** and add these one by one:

```
Key: DJANGO_SETTINGS_MODULE
Value: ecom.production_settings

Key: DEBUG  
Value: False

Key: SECRET_KEY
Value: your-super-secret-key-here-make-it-long-and-random
```

### Auto-Deploy:
- Make sure **"Auto-Deploy"** is set to **"Yes"**
- This means every time you push to GitHub, Render will automatically redeploy

## Step 4: Add Database (Recommended)

1. **Scroll down** to find **"Add Database"** section
2. Click **"Add Database"**
3. Select **"PostgreSQL"**
4. Choose **"Free"** plan (0$ per month)
5. Database name: `fractal-ecommerce-db`
6. Render will automatically create a `DATABASE_URL` environment variable

## Step 5: Review and Deploy

1. **Review all settings** - make sure everything looks correct
2. **Estimated cost** should show **"$0/month"** for free tier
3. Click **"Create Web Service"** button

## Step 6: Watch the Deployment

1. **Build Process Starts**
   - You'll be taken to the service dashboard
   - Click on **"Logs"** tab to watch the build process
   - You'll see logs like:
     ```
     Installing Python dependencies...
     Installing Node.js dependencies...
     Building React frontend...
     Collecting static files...
     Starting server...
     ```

2. **Deployment Status**
   - Build takes 5-10 minutes for first deployment
   - Status will change from "Building" → "Live"
   - You'll get a URL like: `https://fractal-ecommerce.onrender.com`

## Step 7: Test Your Deployment

1. **Click on your app URL** (provided in Render dashboard)
2. **Test these features**:
   - Homepage loads ✅
   - Product browsing works ✅
   - User registration works ✅
   - Cart functionality works ✅

3. **Admin Panel**:
   - Go to: `https://your-app.onrender.com/admin`
   - Create superuser if needed (see below)

## Troubleshooting Common Issues

### If Repository Doesn't Appear:
1. **Check repository visibility** - make sure it's public on GitHub
2. **Refresh the page** - sometimes takes a moment to sync
3. **Re-authorize GitHub** - go to GitHub → Settings → Applications → Render

### If Build Fails:
1. **Check logs** in Render dashboard
2. **Common fixes**:
   - Make sure `requirements.txt` is in root directory
   - Verify all file paths are correct
   - Check that `frontend/package.json` exists

### Create Superuser (Admin Account):
1. **Go to Render dashboard**
2. **Click on your service**
3. **Click "Shell"** tab
4. **Run command**:
   ```bash
   cd ecom && python manage.py createsuperuser
   ```
5. **Follow prompts** to create admin account

## 🎉 Success!

Once deployed successfully:
- **Your app**: `https://your-app-name.onrender.com`
- **Admin panel**: `https://your-app-name.onrender.com/admin`
- **API docs**: `https://your-app-name.onrender.com/api/docs`

### Auto-Deployment Setup:
✅ Every time you push code to GitHub, Render automatically redeploys
✅ No manual steps needed for updates
✅ Just code, commit, push - and your changes are live!

**Need help with any specific step? Let me know which part you're stuck on!**
