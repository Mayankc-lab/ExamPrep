# Getting All Credentials for Vercel Deployment

## **1. MONGODB_URL** (Database Connection)

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Log in with Google or create account
3. Click **Create** → **Build a Database**
4. Choose **Free** tier (M0)
5. Select **AWS** region closest to you
6. Click **Create Cluster** (wait 1-2 minutes)
7. Click **Security** → **Database Access**
   - Add new database user
   - Username: `admin`
   - Auto-generate password (copy it!)
8. Click **Network Access** → **Add IP Address**
   - Add: `0.0.0.0/0` (allows all IPs for Vercel)
9. Go back to cluster, click **Connect** → **Drivers**
10. Copy connection string:
    ```
    mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/examprep?retryWrites=true&w=majority
    ```
11. Replace `YOUR_PASSWORD` with your actual password

**Your Value:**
```
MONGODB_URL=mongodb+srv://admin:your_password@cluster.mongodb.net/examprep?retryWrites=true&w=majority
```

---

## **2. JWT_SECRET** (Random Secret Key)

### Steps:
Run this in PowerShell:
```powershell
-join((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Or use this online generator: https://www.uuidgenerator.net/
- Copy the UUID, remove hyphens, use it

**Example:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

---

## **3. FRONTEND_URL** (Your Vercel Frontend)

### Steps:
1. Deploy frontend first on Vercel (Step 1 from guide)
2. After deployment completes, you'll get a URL like:
   ```
   https://examprep.vercel.app
   ```
3. Copy this URL

**Your Value:**
```
FRONTEND_URL=https://examprep.vercel.app
```

---

## **4. CONTACT_US_EMAIL** (Your Email)

### Steps:
Simply use your email address

**Your Value:**
```
CONTACT_US_EMAIL=your-email@gmail.com
```

---

## **5-7. SMTP Credentials** (Gmail)

### Steps:
1. Go to https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Enable **2-Step Verification** if not already enabled
4. Go to **App passwords** (only visible if 2-Step enabled)
5. Select: App: **Mail**, Device: **Windows Computer**
6. Click **Generate**
7. Copy the 16-character password shown
8. Use your Gmail email

**Your Values:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
SMTP_FROM_EMAIL=your-email@gmail.com
```

---

## **8-10. CLOUDINARY Credentials** (Image/Video Storage)

### Steps:
1. Go to https://cloudinary.com/
2. Click **Sign Up** (or sign in)
3. Choose **Free** plan
4. Complete registration
5. Go to **Dashboard**
6. Copy these from your account:
   - **Cloud Name** (under your profile)
   - **API Key** (under API Environment Variable)
   - **API Secret** (under API Environment Variable - keep this secret!)

**Your Values:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true
```

---

## **11-13. RAZORPAY Credentials** (Payment Gateway)

### Steps:
1. Go to https://razorpay.com/
2. Click **Sign Up** → choose **Business**
3. Complete KYC (identity verification - takes 10-15 mins)
4. Go to **Settings** → **API Keys**
5. Copy:
   - **Key ID** (starts with `rzp_live_` or `rzp_test_`)
   - **Key Secret** (keep this secret!)
6. Create a subscription plan:
   - Go to **Subscriptions** → **Plans**
   - Click **New Plan**
   - Amount: `999` (₹9.99)
   - Period: `yearly` or `monthly`
   - Click **Create**
   - Copy the **Plan ID** (format: `plan_XXXXXXXXXXXXXXXX`)

**Your Values:**
```
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_SECRET=your_razorpay_secret
RAZORPAY_PLAN_ID=plan_1234567890abcdef
```

---

## **Summary - What to Collect**

| # | Credential | Source | Time |
|---|-----------|--------|------|
| 1 | MONGODB_URL | MongoDB Atlas | 5 mins |
| 2 | JWT_SECRET | Generate random | 1 min |
| 3 | FRONTEND_URL | Vercel (after Step 1) | After frontend deploy |
| 4 | CONTACT_US_EMAIL | Your email | 1 min |
| 5-7 | SMTP (Gmail) | Google Account | 5 mins |
| 8-10 | Cloudinary | Cloudinary.com | 5 mins |
| 11-13 | Razorpay | Razorpay.com | 10-15 mins |

---

## **Order of Setup:**

1. ✅ Set up MongoDB Atlas (5 min)
2. ✅ Generate JWT Secret (1 min)
3. ✅ Deploy Frontend on Vercel (get URL)
4. ✅ Set up Gmail SMTP (5 min)
5. ✅ Set up Cloudinary (5 min)
6. ✅ Set up Razorpay (15 min)
7. ✅ Deploy Backend on Vercel with all credentials

---

## **Once You Have All Credentials:**

1. Open a text file
2. Write down all 13 values
3. Go to your Backend Vercel project
4. Add each one to Environment Variables
5. Deploy!

**Which one should we start with?** Let me know and I can provide more detailed help!

