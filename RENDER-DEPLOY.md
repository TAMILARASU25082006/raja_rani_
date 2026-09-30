# Deployment Guide: Raja Rani on Render (Full-Stack All-in-One)

This project is configured to serve both the React client UI and the Socket.IO / Express backend together as a single full-stack web service.

---

## Step 1: Initialize Git and Push to GitHub

In your project folder (`c:\Users\balaj\Downloads\Raja-Rani-Fixed\Raja-Rani-Fixed`), run in your terminal:

```bash
git init
git add .
git commit -m "Initial commit for Raja Rani Royal game"
git branch -M main
```

Now, create a **New Repository** on [GitHub](https://github.com/new) (e.g. `raja-rani-game`), and link it:

```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/raja-rani-game.git
git push -u origin main
```

---

## Step 2: Set Up Free MongoDB Database (MongoDB Atlas)

Since Render is a cloud server, it needs a cloud database:

1. Sign up for free at **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)**.
2. Create a free **M0 (Shared)** cluster.
3. Under **Database Access**, create a user with a username and password (note them down).
4. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** -> **Drivers** -> Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/raja_rani?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your database user credentials)*.

---

## Step 3: Deploy to Render

1. Sign in or sign up at **[Render.com](https://render.com)**.
2. In the dashboard, click **New +** and select **Web Service**.
3. Connect your GitHub repository (`raja-rani-game`).
4. Configure the settings:
   - **Name**: `raja-rani-game` (or any name you prefer)
   - **Region**: Choose the closest region (e.g. Singapore / Frankfurt / Oregon)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     node dist-server/index.js
     ```
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` *(or leave default, Render sets this automatically)*
   - `JWT_SECRET`: *(A long random secret string, e.g. `royal_raja_rani_production_secret_key_987`)*
   - `MONGODB_URI`: *(Your MongoDB Atlas connection string from Step 2)*

6. Click **Create Web Service**.

---

## Step 4: Play!

Render will automatically run `npm run build` and launch your game server.
Once deployed, you will receive a public URL (e.g., `https://raja-rani-game.onrender.com`):
- Open it in any browser or on your phone!
- Share room codes with friends to play multiplayer deduction in real time.
