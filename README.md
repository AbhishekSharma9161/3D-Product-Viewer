# 3D Product Viewer - MERN + Three.js

A full-stack web application for viewing and customizing 3D models with real-time controls.

## Tech Stack

- **Frontend**: React, Three.js, React Three Fiber, React Three Drei, Vite
- **Backend**: Node.js, Express, MongoDB, Multer
- **Deployment**: Netlify (Frontend), Render/Railway (Backend)

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

- 3D model viewer with rotation, zoom, and pan controls
- Upload custom GLB/GLTF models
- **Folder upload support** for GLTF models with textures
- Background color customization
- Wireframe mode toggle
- Save and load viewer configurations
- Responsive design

## Deployment to Netlify

### Option 1: Deploy via Netlify UI
1. Push your code to GitHub (already done ✅)
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Netlify will auto-detect the `netlify.toml` configuration
6. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Important: Environment Variables
After deployment, set the environment variable in Netlify:
- Go to Site settings → Environment variables
- Add `VITE_API_URL` with your backend URL

## Project Structure

```
├── backend/          # Express API server
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   └── uploads/      # Model storage
└── frontend/         # React application
    ├── src/
    │   ├── components/  # React components
    │   └── services/    # API services
```

See TECHNICAL_DOCUMENT.pdf for detailed architecture and implementation details.
