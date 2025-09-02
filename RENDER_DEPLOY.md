# 🚀 Deploy to Render in 5 Minutes

## Step-by-Step Render Deployment

### 1. Go to Render.com
- Visit: **https://render.com**
- Click **"Get Started for Free"**
- Sign up with your **GitHub account**

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository: `FractalProjectEcommerce`

### 3. Configure Deployment Settings
```
Name: fractal-ecommerce (or your preferred name)
Environment: Python 3
Region: Choose closest to your location
Branch: master
Root Directory: (leave empty)

Build Command: 
pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ../ecom && python manage.py collectstatic --noinput

Start Command: 
cd ecom && gunicorn ecom.wsgi:application
```

### 4. Add Environment Variables
In the Environment Variables section, add:
```
DJANGO_SETTINGS_MODULE = ecom.production_settings
DEBUG = False
SECRET_KEY = your-super-secret-key-here
```

### 5. Add Database (Optional but Recommended)
- Scroll down to find **"Add Database"**
- Select **PostgreSQL**
- Choose **Free** plan
- Render will automatically set `DATABASE_URL`

### 6. Deploy!
- Click **"Create Web Service"**
- Render will start building your application
- Build process takes 5-10 minutes
- Watch the logs for any errors

### 7. Your App is Live! 🎉
- Your app will be available at: `https://your-app-name.onrender.com`
- Admin panel: `https://your-app-name.onrender.com/admin`
- API docs: `https://your-app-name.onrender.com/api/docs`

## ✅ What Happens During Deployment:
1. Render clones your GitHub repository
2. Installs Python dependencies from `requirements.txt`
3. Installs Node.js dependencies and builds React frontend
4. Collects Django static files
5. Starts the Django server with Gunicorn
6. Your app is live!

## 🔄 Auto-Deployment:
- Every time you push to GitHub, Render automatically redeploys
- No manual deployment needed
- Just push your code and it's live!

## 🛠️ After Deployment:
Run these commands in Render's shell (if needed):
```bash
# Create superuser (admin account)
python ecom/manage.py createsuperuser

# Run migrations (if you add new models)
python ecom/manage.py migrate
```

**That's it! Your full-stack e-commerce application is now live on the internet! 🚀**
