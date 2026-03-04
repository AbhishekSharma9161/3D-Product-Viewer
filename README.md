# 3D Product Viewer - MERN + Three.js

A full-stack web application for viewing and customizing 3D models with real-time controls.

## Tech Stack

- **Frontend**: React, Three.js, React Three Fiber, React Three Drei
- **Backend**: Node.js, Express, MongoDB, Multer
- **Deployment**: Vercel (Frontend), Render (Backend)

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
- Background color customization
- Wireframe mode toggle
- Save and load viewer configurations
- Responsive design

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
