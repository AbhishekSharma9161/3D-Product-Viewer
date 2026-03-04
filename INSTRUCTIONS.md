# How to Test the 3D Viewer

## ✅ Application Status
- **Backend**: Running on http://localhost:5000 ✓
- **Frontend**: Running on http://localhost:3000 ✓
- **MongoDB**: Connected to Atlas ✓

## 🎯 How to Use

### Option 1: Download a GLB Model (Recommended)
GLB files have everything embedded (textures, materials) and work perfectly.

**Free GLB Models:**
1. **Sketchfab** (Best option)
   - Go to: https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount
   - Find a model you like
   - Click "Download 3D Model"
   - Choose "glTF Binary (.glb)" format
   - Download and upload to the viewer

2. **Poly Pizza**
   - Go to: https://poly.pizza/
   - Browse models
   - Download as GLB
   - Upload to the viewer

3. **Sample Models**
   - https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0
   - Download any .glb file from the models

### Option 2: Convert Your GLTF to GLB
Your current GLTF file needs its texture files. You can:
1. Upload the entire Assets folder along with the GLTF
2. Or convert to GLB using: https://products.aspose.app/3d/conversion/gltf-to-glb

## 🎮 Controls

Once you upload a GLB model:
- **Rotate**: Left-click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag
- **Background Color**: Use the color picker
- **Wireframe Mode**: Toggle the switch
- **Save Settings**: Click the green button

## 🔧 Features Working

✅ 3D Model Upload
✅ Model Viewing with Three.js
✅ Orbit Controls (rotate, zoom, pan)
✅ Lighting (ambient + directional)
✅ Background Color Picker
✅ Wireframe Mode Toggle
✅ Settings Persistence (MongoDB)
✅ File Storage

## 📝 Quick Test

1. Open http://localhost:3000
2. Download this sample GLB: https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb
3. Upload it to the viewer
4. Play with the controls!

## ⚠️ Note About GLTF Files

GLTF files reference external texture files. Your adamHead.gltf needs:
- Assets/Models/PBR/Adam/Textures/AdamMonitor.jpg
- Assets/Models/PBR/Adam/Textures/Adam_Torso_n.jpg
- And other texture files

Use GLB format instead - it's a single file with everything included!
