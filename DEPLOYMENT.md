# 🚀 KidneyCare AI Deployment Guide

To make your application live for everyone, you'll need to host the **Backend** (API) and the **Frontend** (UI) separately. This guide will walk you through the process step-by-step.

## Step 1: Push Your Code to GitHub
1. Create a new repository on GitHub (e.g., `kidneycare-ai`).
2. Push your entire local project folder to this repository.

## Step 2: Deploy the Backend (Python / Flask)
The backend is in the `machine_learning_deployment` folder. I recommend using **Render** (free and simple).

1. Log in to [Render.com](https://render.com).
2. Click **New** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name:** `kidney-api`
   - **Root Directory:** `machine_learning_deployment`
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Click **Deploy Web Service**.
6. **Important:** Once deployed, Render will give you a URL like `https://kidney-api.onrender.com`. Copy it.

## Step 3: Update the Frontend API URL
Now, you need to tell your frontend where the live API is.

1. Open `script.js` in your local project.
2. Find this line:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
     ? 'http://127.0.0.1:5000'
     : 'https://kidney-api.onrender.com'; // <--- Update this URL
   ```
3. Replace `https://kidney-api.onrender.com` with your **actual Render URL** from Step 2.
4. **Push this change** to your GitHub repository.

## Step 4: Deploy the Frontend (Static Files)
The easiest way is to use **GitHub Pages**.

1. Go to your repository on GitHub.
2. Navigate to **Settings** → **Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch".
4. Select the `main` branch and the `/(root)` folder.
5. Click **Save**.
6. After a few minutes, your site will be live at `https://your-username.github.io/kidneycare-ai/`.

---

### 💡 Why this works:
- **Render** runs the Python server with `gunicorn` for production-level stability.
- **GitHub Pages** hosts your HTML/CSS/JS files for free.
- **script.js** detects if you're running locally (`localhost`) or online, and automatically picks the right API URL.

> [!TIP]
> **Pushover Warning:** On Render's free tier, the API goes to sleep after 15 minutes of inactivity. The first prediction after a long break might take 30-40 seconds to "wake up" the server.
