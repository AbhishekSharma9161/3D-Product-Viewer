import { Suspense, useState, useMemo, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import './Viewer3D.css';

// ─── Local Model Loader ───────────────────────────────────────────────────────
// Loads a GLTF/GLB from local blob URLs. blobUrlMap and mainUrl are
// stable references (computed once per file-set change) so useGLTF
// caching works correctly.
function LocalModel({ mainUrl, blobUrlMap, wireframeMode }) {
  const { scene } = useGLTF(mainUrl, false, false, (loader) => {
    // Override the loader's manager URL modifier so .bin / texture
    // requests are resolved from blob URLs.
    loader.manager.setURLModifier((url) => {
      // Extract just the filename from whatever path Three.js requests
      const filename = decodeURIComponent(url).split(/[\\/]/).pop().split('?')[0];
      if (blobUrlMap[filename]) {
        return blobUrlMap[filename];
      }
      return url;
    });
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      if (!child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
      child.material.wireframe = wireframeMode;
    }
  });

  return <primitive object={scene} />;
}

// ─── Remote Model Loader ──────────────────────────────────────────────────────
function RemoteModel({ url, wireframeMode }) {
  const { scene } = useGLTF(url, false);

  scene.traverse((child) => {
    if (child.isMesh) {
      if (!child.material) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
      child.material.wireframe = wireframeMode;
    }
  });

  return <primitive object={scene} />;
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <p>Loading model…</p>
    </div>
  );
}

// ─── Error Fallback ───────────────────────────────────────────────────────────
function ErrorFallback({ error, onRetry }) {
  return (
    <div className="error-overlay">
      <div className="error-box">
        <h3>⚠️ Failed to load model</h3>
        <p>{error}</p>
        <p className="error-tip">
          <strong>Tip:</strong> For <code>.gltf</code> files, select the <code>.gltf</code> +
          <code>.bin</code> + textures <strong>all at once</strong> in the file picker.<br />
          Or use a self-contained <code>.glb</code> file instead.
        </p>
        {onRetry && <button className="retry-button" onClick={onRetry}>Try Again</button>}
      </div>
    </div>
  );
}

// ─── React Error Boundary ─────────────────────────────────────────────────────
class ErrorCatcher extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (this.props.onError) {
      this.props.onError(error.message || 'Unknown error loading model');
    }
  }

  componentDidUpdate(prevProps) {
    // Reset error when new files are provided
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Main Viewer ──────────────────────────────────────────────────────────────
function Viewer3D({ localFiles, modelUrl, backgroundColor, wireframeMode }) {
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Build stable blob URL map — only recomputes when localFiles changes
  const { mainUrl, blobUrlMap } = useMemo(() => {
    if (!localFiles || localFiles.length === 0) {
      return { mainUrl: null, blobUrlMap: {} };
    }

    const map = {};
    for (const file of localFiles) {
      map[file.name] = URL.createObjectURL(file);
    }

    const main = [...localFiles].find(f => /\.(gltf|glb)$/i.test(f.name));
    return { mainUrl: main ? map[main.name] : null, blobUrlMap: map };
  }, [localFiles]);

  // Revoke old blob URLs when files change to avoid memory leaks
  useEffect(() => {
    return () => {
      Object.values(blobUrlMap).forEach(url => URL.revokeObjectURL(url));
    };
  }, [blobUrlMap]);

  // Reset error when new files are selected
  useEffect(() => {
    setLoadError(null);
    if (localFiles && localFiles.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [localFiles]);

  const hasModel = mainUrl || modelUrl;
  const resetKey = mainUrl || modelUrl || 'empty';

  return (
    <div className="viewer-container" style={{ background: backgroundColor }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <directionalLight position={[0, 10, -5]} intensity={0.3} />
        <hemisphereLight groundColor="#444444" intensity={0.6} />

        <Suspense fallback={null}>
          {hasModel && !loadError && !isLoading && (
            <Bounds fit clip observe margin={1.5}>
              <Center>
                <ErrorCatcher onError={setLoadError} resetKey={resetKey}>
                  {mainUrl ? (
                    <LocalModel
                      key={mainUrl}
                      mainUrl={mainUrl}
                      blobUrlMap={blobUrlMap}
                      wireframeMode={wireframeMode}
                    />
                  ) : (
                    <RemoteModel
                      key={modelUrl}
                      url={modelUrl}
                      wireframeMode={wireframeMode}
                    />
                  )}
                </ErrorCatcher>
              </Center>
            </Bounds>
          )}
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls enablePan enableZoom enableRotate makeDefault />
      </Canvas>

      {!hasModel && !loadError && (
        <div className="placeholder">
          <p>Upload a 3D model to get started</p>
        </div>
      )}

      {isLoading && <LoadingOverlay />}

      {loadError && !isLoading && (
        <ErrorFallback
          error={loadError}
          onRetry={() => setLoadError(null)}
        />
      )}
    </div>
  );
}

export default Viewer3D;
