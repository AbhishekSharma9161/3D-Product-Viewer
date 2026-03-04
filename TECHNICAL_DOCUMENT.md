# Technical Document - 3D Product Viewer

## 1. Architecture Overview

### System Architecture
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│    MongoDB      │
│  (Three.js)     │  HTTP   │  (Node.js)      │         │   Database      │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
   Static Files              File Storage
   (Vite Build)              (uploads/)
```

### Component Architecture
```
Frontend:
├── App.jsx (Main container)
├── Viewer3D.jsx (Three.js canvas)
├── Controls.jsx (UI controls)
└── services/api.js (API client)

Backend:
├── server.js (Express app)
├── routes/
│   ├── modelRoutes.js (Upload & list)
│   └── settingsRoutes.js (Save & fetch)
└── models/
    ├── Model.js (Model schema)
    └── ViewerSettings.js (Settings schema)
```

## 2. Tech Stack

### Frontend
- **React 18**: UI framework
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helper components (OrbitControls, Environment, useGLTF)
- **Axios**: HTTP client
- **Vite**: Build tool and dev server

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Multer**: File upload middleware
- **CORS**: Cross-origin resource sharing

### DevOps
- **Git**: Version control
- **Vercel**: Frontend hosting
- **Render**: Backend hosting
- **MongoDB Atlas**: Database hosting (recommended)

## 3. Key Implementation Decisions

### 3.1 Three.js Integration
- Used React Three Fiber for declarative 3D scene management
- Implemented OrbitControls for intuitive camera manipulation
- Added Environment preset for realistic lighting
- Wireframe mode toggles material property on all meshes

### 3.2 File Upload Strategy
- Multer handles multipart/form-data uploads
- Files stored locally in `uploads/` directory
- Unique filenames prevent collisions (timestamp + random)
- File validation ensures only GLB/GLTF formats accepted

### 3.3 State Management
- React useState for local component state
- No Redux needed due to simple state structure
- Settings persist to MongoDB for cross-session consistency

### 3.4 API Design
**Endpoints:**
- `POST /api/models/upload` - Upload 3D model
- `GET /api/models` - List all uploaded models
- `POST /api/settings` - Save viewer configuration
- `GET /api/settings/latest` - Fetch latest settings

### 3.5 Performance Optimizations
- Suspense boundary for lazy loading 3D models
- Environment map cached by Drei
- Minimal re-renders using React best practices

## 4. Project Structure

```
3d-viewer/
├── backend/
│   ├── models/
│   │   ├── Model.js
│   │   └── ViewerSettings.js
│   ├── routes/
│   │   ├── modelRoutes.js
│   │   └── settingsRoutes.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Controls.jsx
│   │   │   ├── Controls.css
│   │   │   ├── Viewer3D.jsx
│   │   │   └── Viewer3D.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── TECHNICAL_DOCUMENT.md
```

## 5. Deployment Instructions

### 5.1 Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

### 5.2 Production Deployment

**MongoDB Setup:**
1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Add to backend environment variables

**Backend (Render):**
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 5000
   - `BASE_URL`: Your Render service URL

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project to Vercel
3. Set root directory: `frontend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL + /api

### 5.3 Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/3d-viewer
BASE_URL=http://localhost:5000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 6. Features Implemented

### Mandatory Features ✓
- [x] 3D model viewer with GLB/GLTF support
- [x] Rotate, zoom, pan controls (OrbitControls)
- [x] Ambient + directional lighting
- [x] Upload 3D model functionality
- [x] Background color picker
- [x] Wireframe mode toggle
- [x] Model upload API
- [x] Save viewer settings API
- [x] Fetch viewer settings API
- [x] MongoDB integration
- [x] Git version control
- [x] Technical documentation

### Bonus Features (Optional)
- [x] Environment HDRI lighting (studio preset)
- [ ] Material/texture switching
- [ ] Hotspots/annotations

## 7. Testing the Application

### Test Model Upload:
1. Find a free GLB model (e.g., from Sketchfab)
2. Click "Choose GLB/GLTF File"
3. Select the model
4. Wait for upload confirmation
5. Model should appear in viewer

### Test Controls:
1. Click and drag to rotate
2. Scroll to zoom
3. Right-click drag to pan
4. Change background color
5. Toggle wireframe mode
6. Click "Save Settings"
7. Refresh page - settings should persist

## 8. Known Limitations

- File storage is local (not cloud-based like AWS S3)
- No user authentication
- Single settings record (no multi-user support)
- No model deletion functionality
- Limited error handling for large files

## 9. Future Enhancements

- AWS S3 integration for scalable file storage
- User authentication and authorization
- Model library with thumbnails
- Material editor with texture upload
- Annotation system with 3D hotspots
- Model compression and optimization
- Real-time collaboration features
- Export functionality (screenshots, videos)

## 10. Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.92.0",
  "three": "^0.160.0",
  "axios": "^1.6.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "dotenv": "^16.3.1"
}
```

## 11. API Documentation

### Upload Model
```
POST /api/models/upload
Content-Type: multipart/form-data

Body: { model: <file> }

Response: {
  url: "http://localhost:5000/uploads/1234567890-model.glb",
  id: "507f1f77bcf86cd799439011"
}
```

### Save Settings
```
POST /api/settings
Content-Type: application/json

Body: {
  backgroundColor: "#1a1a1a",
  wireframeMode: false
}

Response: {
  _id: "507f1f77bcf86cd799439011",
  backgroundColor: "#1a1a1a",
  wireframeMode: false,
  timestamp: "2026-03-03T10:30:00.000Z"
}
```

### Get Latest Settings
```
GET /api/settings/latest

Response: {
  backgroundColor: "#1a1a1a",
  wireframeMode: false,
  timestamp: "2026-03-03T10:30:00.000Z"
}
```

---

**Author**: Full Stack Developer  
**Date**: March 2026  
**Version**: 1.0.0
