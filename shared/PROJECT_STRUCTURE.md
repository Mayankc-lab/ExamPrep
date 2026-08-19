# LMS Project - New Structure

## Overview
This project has been reorganized into a clean three-part structure for better separation of concerns.

## Directory Structure

```
d:\mayank\lms_yt\new/
├── frontend/
│   ├── Client/                 # React Vite frontend application
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── .env                # Frontend environment variables
│   │   └── ...
│   └── package.json            # Frontend workspace root
│
├── backend/
│   ├── Server/                 # Express.js backend application
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── package.json
│   │   ├── nodemon.json
│   │   ├── .env                # Backend environment variables
│   │   └── ...
│   ├── uploads/                # File uploads directory
│   ├── scripts/                # Backend-specific utility scripts
│   │   ├── ensure_user_access.mjs
│   │   ├── list_courses.cjs
│   │   └── ...
│   └── package.json            # Backend workspace root
│
├── shared/
│   ├── scripts/                # Common/utility scripts
│   │   ├── activate_mayank_override.mjs
│   │   ├── check-links.js
│   │   ├── extract_excel_links.js
│   │   └── ...
│   ├── README.md               # Project documentation
│   ├── GETTING_CREDENTIALS_GUIDE.md
│   ├── VERCEL_DEPLOYMENT_GUIDE.md
│   ├── start-dev.cmd           # Development startup script
│   ├── text/                   # Text files and data
│   └── ...
│
├── package.json                # Root workspace configuration
├── package-lock.json
├── .env.example                # Example environment variables
├── .gitignore
└── ...
```

## Running the Project

### From Root Directory
```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build frontend for production
npm run build

# Lint frontend code
npm run lint
```

### From Individual Directories
```bash
# Frontend
cd frontend
npm run dev      # Start dev server on http://localhost:5173

# Backend
cd backend
npm run dev      # Start server on http://localhost:5000
```

## Environment Variables

### Frontend (.env in `frontend/Client/.env`)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api/v1)

### Backend (.env in `backend/Server/.env`)
- `PORT`: Server port (default: 5000)
- `MONGODB_URL`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS
- `CLOUDINARY_*`: Cloudinary cloud storage credentials
- `SMTP_*`: Email service credentials
- `RAZORPAY_*`: Razorpay payment gateway credentials

## Key Changes from Original Structure

1. **Frontend moved**: `Client/` → `frontend/Client/`
2. **Backend moved**: `Server/` → `backend/Server/`
3. **Uploads moved**: `uploads/` → `backend/uploads/`
4. **Scripts organized**:
   - Backend-specific scripts → `backend/scripts/`
   - Common utility scripts → `shared/scripts/`
5. **Documentation**: All guides and README files → `shared/`
6. **Root package.json**: Updated with new paths for all npm scripts

## Next Steps

1. Install dependencies:
   ```bash
   npm install           # Root dependencies
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` and create `.env` files in `backend/Server/` and `frontend/Client/`

3. Start development:
   ```bash
   npm run dev
   ```

## Notes

- The `.env` files remain in their original locations within Client and Server folders
- Configuration files (vite.config.js, nodemon.json, etc.) remain unchanged
- All relative imports within Client and Server remain functional
- Node modules are still managed at each folder level (frontend, backend)
