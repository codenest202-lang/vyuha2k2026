# Vyuha 2K26 - Vercel Deployment Guide

## Overview

This project deploys as **two separate Vercel projects**:
1. **Frontend** (React/Vite) - deployed to Vercel as a static site
2. **Backend** (Node.js/Express) - deployed to Vercel as serverless functions

---

## Step 1: Get Your API Keys

You need accounts and API keys from these services:

### Required Services

| Service | What it's for | Where to get it |
|---------|--------------|-----------------|
| **MongoDB Atlas** | Database | https://cloud.mongodb.com (free tier available) |
| **Razorpay** | Payment gateway | https://dashboard.razorpay.com (test mode available) |
| **SendGrid** | Email delivery (OTP, confirmations) | https://app.sendgrid.com (free 100 emails/day) |
| **Google Cloud** | OAuth login | https://console.cloud.google.com/apis/credentials |

### Optional Services

| Service | What it's for | Where to get it |
|---------|--------------|-----------------|
| **Gemini AI** | Chatbot | https://aistudio.google.com/app/apikey |
| **Telegram Bot** | Booking notifications | https://t.me/BotFather |

---

## Step 2: Set Up MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0 tier)
3. Create a database user (remember the username/password)
4. Under **Network Access**, add `0.0.0.0/0` to allow all IPs (needed for Vercel serverless)
5. Click **Connect** > **Connect your application**
6. Copy the connection string, it looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/vyuha2k26?retryWrites=true&w=majority
   ```

---

## Step 3: Set Up Razorpay

1. Go to https://dashboard.razorpay.com
2. Sign up / Log in
3. Go to **Settings** > **API Keys**
4. Generate a new key pair (use **Test Mode** first!)
5. Save both:
   - `Key ID` (starts with `rzp_test_` or `rzp_live_`)
   - `Key Secret`

---

## Step 4: Set Up SendGrid

1. Go to https://app.sendgrid.com
2. Sign up (free tier: 100 emails/day)
3. Go to **Settings** > **API Keys** > **Create API Key**
4. Give it "Full Access" or at minimum "Mail Send"
5. Copy the API key (starts with `SG.`)
6. Go to **Settings** > **Sender Authentication** > verify your sender email

---

## Step 5: Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth Client ID**
5. Application type: **Web application**
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (for dev)
   - `https://your-frontend.vercel.app` (for production)
7. Add **Authorized redirect URIs**:
   - `http://localhost:3000`
   - `https://your-frontend.vercel.app`
8. Save the **Client ID** and **Client Secret**

---

## Step 6: Deploy Backend to Vercel

### 6a. Create Backend Project

1. Go to https://vercel.com/new
2. Import your GitHub repo: `codenest202-lang/vyuha2k2026`
3. **IMPORTANT**: Set **Root Directory** to `backend`
4. Framework Preset: **Other**
5. Build Command: leave empty (vercel.json handles it)
6. Output Directory: leave empty

### 6b. Add Backend Environment Variables

Go to **Settings** > **Environment Variables** and add ALL of these:

```
PORT=4000
NODE_ENV=production

# MongoDB (REQUIRED)
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/vyuha2k26?retryWrites=true&w=majority

# JWT (REQUIRED - use a strong random string)
JWT_SECRET=generate-a-random-64-char-string-here-use-openssl-rand-hex-32
JWT_EXPIRES_IN=7d

# Google OAuth (REQUIRED for Google login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay (REQUIRED for payments)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# SendGrid (REQUIRED for email OTP)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=vyuha2k26@yourcollege.edu

# Gemini AI (OPTIONAL - chatbot works with placeholder without this)
GEMINI_API_KEY=your-gemini-api-key

# Telegram Bot (OPTIONAL - for booking notifications)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHANNEL_ID=-1001234567890

# Admin emails (comma-separated, these users get admin role)
ADMIN_EMAILS=admin@yourcollege.edu,admin2@yourcollege.edu

# Frontend URL (REQUIRED for CORS)
FRONTEND_URL=https://your-frontend-project.vercel.app
```

### 6c. Deploy

Click **Deploy**. Note the deployed URL (e.g., `https://vyuha2k26-backend.vercel.app`).

---

## Step 7: Deploy Frontend to Vercel

### 7a. Create Frontend Project

1. Go to https://vercel.com/new
2. Import the SAME GitHub repo: `codenest202-lang/vyuha2k2026`
3. **IMPORTANT**: Set **Root Directory** to `frontend`
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 7b. Add Frontend Environment Variables

```
# Backend API URL (REQUIRED - use your deployed backend URL)
VITE_API_URL=https://vyuha2k26-backend.vercel.app/api

# Google OAuth Client ID (REQUIRED for Google login button)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Razorpay Key ID (REQUIRED for payment checkout)
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Cloudflare R2 (OPTIONAL - for image hosting)
VITE_CLOUDFLARE_R2_PUBLIC_URL=https://your-r2-bucket.r2.dev
```

### 7c. Deploy

Click **Deploy**. Note the deployed URL.

### 7d. Update Backend CORS

Go back to your **backend** Vercel project > Settings > Environment Variables.
Update `FRONTEND_URL` to your actual frontend URL:
```
FRONTEND_URL=https://your-frontend-project.vercel.app
```
Redeploy the backend.

---

## Step 8: Test Everything

### Test 1: Health Check
```bash
curl https://your-backend.vercel.app/api/health
```
Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "version": "0.1.0"
  }
}
```

### Test 2: Send OTP
```bash
curl -X POST https://your-backend.vercel.app/api/auth/email/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```
Expected: `{"success": true, "data": {"message": "OTP sent to your email address."}}`

Check your email for the OTP (or check Vercel function logs in dev mode).

### Test 3: Verify OTP
```bash
curl -X POST https://your-backend.vercel.app/api/auth/email/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```
Expected: Returns a JWT token and user object.

### Test 4: Create Booking (needs JWT)
```bash
curl -X POST https://your-backend.vercel.app/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "participants": [
      {
        "name": "Test User",
        "mobile": "9876543210",
        "college": "Test College",
        "year": "2nd",
        "department": "Computer Science"
      }
    ]
  }'
```
Expected: Returns bookingId, transactionId, totalAmount, razorpayOrderId.

### Test 5: Get My Bookings
```bash
curl https://your-backend.vercel.app/api/bookings/my-bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 6: Chatbot
```bash
curl -X POST https://your-backend.vercel.app/api/chatbot/message \
  -H "Content-Type: application/json" \
  -d '{"message": "when is the event?"}'
```
Expected: `{"success": true, "data": {"response": "Vyuha 2K26 is happening on March 30, 2026..."}}`

### Test 7: Admin Dashboard (needs admin JWT)
```bash
curl https://your-backend.vercel.app/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Test 8: Frontend
Open your frontend URL in a browser:
- Landing page should load with 3D animation
- Click "Register Now" to go to login
- Enter email, receive OTP, verify
- Create a booking, complete payment
- Check booking confirmation with QR code

---

## All API Endpoints Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/auth/email/send-otp` | No | Send OTP email |
| `POST` | `/api/auth/email/verify-otp` | No | Verify OTP, get JWT |
| `POST` | `/api/auth/google` | No | Google OAuth login |
| `GET` | `/api/auth/me` | Yes | Get user profile |
| `PATCH` | `/api/auth/profile` | Yes | Update profile |
| `POST` | `/api/bookings/create` | Yes | Create booking + Razorpay order |
| `POST` | `/api/bookings/verify-payment` | Yes | Verify payment, confirm booking |
| `GET` | `/api/bookings/my-bookings` | Yes | User's bookings |
| `GET` | `/api/bookings/:id` | Yes | Single booking details |
| `GET` | `/api/admin/dashboard` | Admin | Dashboard stats |
| `GET` | `/api/admin/bookings` | Admin | All bookings (paginated) |
| `POST` | `/api/admin/verify-qr` | Admin | QR check-in |
| `POST` | `/api/admin/manual-verify` | Admin | Manual ID lookup |
| `POST` | `/api/chatbot/message` | No | AI chatbot |

---

## Troubleshooting

### CORS Errors
Make sure `FRONTEND_URL` in backend env matches your exact frontend URL (no trailing slash).

### MongoDB Connection Fails
- Check that `0.0.0.0/0` is in your Atlas Network Access list
- Verify username/password in the connection string
- Make sure the database name is in the URI

### OTP Email Not Received
- Check SendGrid API key is correct
- Verify sender email in SendGrid settings
- Check spam folder
- In dev mode, OTP is logged to Vercel function logs

### Razorpay Payment Fails
- Make sure you are using **Test Mode** keys for testing
- Test card: `4111 1111 1111 1111`, any future expiry, any CVV
- Test UPI: `success@razorpay` for successful payment

### Admin Access
- Add your email to `ADMIN_EMAILS` env variable
- Login with that email
- Your role will be set to "admin" automatically

---

## Generate a Secure JWT Secret

Run this command to generate a random JWT secret:
```bash
openssl rand -hex 32
```
Or use: https://generate-random.org/api-key-generator

---

## Quick Reference: Environment Variables Summary

### Backend (14 variables)

| Variable | Required | Example |
|----------|:---:|---------|
| `MONGODB_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/vyuha2k26` |
| `JWT_SECRET` | Yes | `a1b2c3d4e5f6...` (64 chars) |
| `JWT_EXPIRES_IN` | No | `7d` |
| `NODE_ENV` | No | `production` |
| `PORT` | No | `4000` |
| `GOOGLE_CLIENT_ID` | Yes | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | `GOCSPX-xxx` |
| `RAZORPAY_KEY_ID` | Yes | `rzp_test_xxx` |
| `RAZORPAY_KEY_SECRET` | Yes | `xxx` |
| `SENDGRID_API_KEY` | Yes | `SG.xxx` |
| `EMAIL_FROM` | Yes | `vyuha@college.edu` |
| `ADMIN_EMAILS` | Yes | `admin@college.edu` |
| `FRONTEND_URL` | Yes | `https://frontend.vercel.app` |
| `GEMINI_API_KEY` | No | `xxx` |
| `TELEGRAM_BOT_TOKEN` | No | `123:ABC` |
| `TELEGRAM_CHANNEL_ID` | No | `-100xxx` |

### Frontend (4 variables)

| Variable | Required | Example |
|----------|:---:|---------|
| `VITE_API_URL` | Yes | `https://backend.vercel.app/api` |
| `VITE_GOOGLE_CLIENT_ID` | Yes | `xxx.apps.googleusercontent.com` |
| `VITE_RAZORPAY_KEY_ID` | Yes | `rzp_test_xxx` |
| `VITE_CLOUDFLARE_R2_PUBLIC_URL` | No | `https://r2.dev` |
