# Complete Vercel Deployment Guide

## **PART 1: DEPLOY FRONTEND**

### **Step 1: Go to Vercel and Create Frontend Project**
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Find and select your GitHub repository: `ExamPrep`
4. Click **Import**

### **Step 2: Configure Frontend Project**
- **Project Name**: `examprep` (or your preferred name)
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (default, but verify it's not set to `Client`)

#### **Configure Build Settings:**
1. Click **Environment Variables** button first (before Deploy)
2. Or skip for now and add later (we'll do this)

#### **Scroll down to "Build and Output Settings":**
- **Build Command**: `npm install --legacy-peer-deps && cd Client && npm install --legacy-peer-deps && cd Client && npm run build`
- **Output Directory**: `Client/dist`
- **Install Command**: (leave blank, handled by build command)

### **Step 3: Add Environment Variables for Frontend**
Before clicking Deploy, click **Environment Variables**:
- **Key**: `VITE_API_URL`
- **Value**: `http://localhost:5000/api/v1` (temporary, will update after backend deployment)
- **Environments**: Select all (Production, Preview, Development)

### **Step 4: Deploy Frontend**
- Click **Deploy**
- Wait for deployment to complete
- You'll get a URL like: `https://examprep.vercel.app`
- **Copy this URL** - you'll need it for backend CORS

---

## **PART 2: DEPLOY BACKEND**

### **Step 1: Create New Vercel Project for Backend**
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub repository: `ExamPrep`
4. This time, select different settings (it's a new project)

### **Step 2: Configure Backend Project**
- **Project Name**: `examprep-api` (or similar)
- **Framework Preset**: `Node.js`
- **Root Directory**: `Server` ⚠️ **IMPORTANT: Select `Server` folder**

### **Step 3: Add Environment Variables for Backend**
Click **Environment Variables** and add ALL these:

#### **Database:**
```
MONGODB_URL: mongodb+srv://username:password@cluster.mongodb.net/examprep
```

#### **JWT Authentication:**
```
JWT_SECRET: your-super-secret-key-that-is-at-least-32-characters-long
JWT_EXPIRY: 7d
```

#### **Frontend Configuration:**
```
FRONTEND_URL: https://examprep.vercel.app
```
(Use your actual frontend URL from Part 1)

#### **Email Configuration:**
```
CONTACT_US_EMAIL: your-email@gmail.com
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_USERNAME: your-email@gmail.com
SMTP_PASSWORD: your_app_password
SMTP_FROM_EMAIL: noreply@yourapp.com
```

#### **Cloudinary (Image Storage):**
```
CLOUDINARY_CLOUD_NAME: your_cloudinary_cloud_name
CLOUDINARY_API_KEY: your_cloudinary_api_key
CLOUDINARY_API_SECRET: your_cloudinary_api_secret
CLOUDINARY_SECURE: true
```

#### **Razorpay (Payment):**
```
RAZORPAY_KEY_ID: your_razorpay_key_id
RAZORPAY_SECRET: your_razorpay_secret
RAZORPAY_PLAN_ID: plan_XXXXXXXXXXXXXXXX
```

### **Step 4: Deploy Backend**
- Click **Deploy**
- Wait for deployment to complete
- You'll get a URL like: `https://examprep-api.vercel.app`
- **Copy this URL** - you'll need it to update frontend

---

## **PART 3: CONNECT FRONTEND TO BACKEND**

### **Step 1: Update Frontend Environment Variable**
1. Go to your Frontend Vercel project: `examprep`
2. Click **Settings** → **Environment Variables**
3. Find `VITE_API_URL`
4. Update the value to your backend API:
   ```
   https://examprep-api.vercel.app/api/v1
   ```
5. Click **Save**

### **Step 2: Redeploy Frontend**
1. Go to **Deployments**
2. Click the 3-dot menu on the latest deployment
3. Click **Redeploy**
4. Wait for redeployment to complete

---

## **PART 4: VERIFY DEPLOYMENT**

### **Test Frontend:**
1. Go to `https://examprep.vercel.app`
2. Try logging in or any API call
3. Check browser Console (F12) for any errors

### **Test Backend:**
1. Go to `https://examprep-api.vercel.app/ping`
2. Should show: `Pong`

### **Common Issues & Fixes:**

**Issue: CORS Error**
- Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
- Restart the backend deployment

**Issue: API calls failing**
- Verify `VITE_API_URL` in frontend env variables
- Make sure you redeployed frontend after updating env variable

**Issue: Database connection failing**
- Verify `MONGODB_URL` is correct
- Make sure your MongoDB cluster allows connections from Vercel's IP
  - Go to MongoDB Atlas → Network Access
  - Add IP: `0.0.0.0/0` (allows all IPs)

---

## **TROUBLESHOOTING CHECKLIST**

✅ Frontend deployed with correct build command
✅ Backend deployed with Root Directory set to `Server`
✅ `VITE_API_URL` in frontend points to backend API URL
✅ `FRONTEND_URL` in backend matches frontend URL
✅ All environment variables added to both projects
✅ Frontend redeployed after env variable changes
✅ MongoDB allows Vercel's IP range
✅ All API keys (Cloudinary, Razorpay) are correct

---

## **NEXT STEPS**

After successful deployment:
1. Test all features (login, course creation, payments, etc.)
2. Monitor Vercel Analytics for errors
3. Set up error tracking (optional)
4. Enable auto-deployments for future updates

