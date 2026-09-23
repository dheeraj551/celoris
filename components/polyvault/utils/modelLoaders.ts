import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

/**
 * Shared helpers for loading a REAL uploaded model file (as opposed to the
 * hand-authored procedural placeholder shapes in proceduralModels.ts).
 * Used by both the full detail-view viewer (ThreeViewport.tsx) and the
 * upload-time thumbnail generator (UploadModal.tsx) so the two stay in sync.
 */

export type RealModelLoaderKind = 'gltf' | 'obj' | 'fbx';

/** Which in-browser loader (if any) can read a file, based on its extension.
 *  .blend and .usdz can't be parsed client-side, and a Draco/KTX2-compressed
 *  .glb also isn't supported here (no decoder wired in) — callers should
 *  fall back to the procedural placeholder for those. */
export function getRealModelLoaderKind(filename?: string): RealModelLoaderKind | null {
  const ext = filename?.split('.').pop()?.toLowerCase();
  if (ext === 'glb' || ext === 'gltf') return 'gltf';
  if (ext === 'obj') return 'obj';
  if (ext === 'fbx') return 'fbx';
  return null;
}

/** Load a model from a URL (signed R2 URL, or a local blob: URL) using the
 *  right three.js loader for its kind. Returns the root Object3D. */
export async function loadRealModelObject(url: string, kind: RealModelLoaderKind): Promise<THREE.Object3D> {
  if (kind === 'gltf') {
    const gltf = await new GLTFLoader().loadAsync(url);
    return gltf.scene;
  }
  if (kind === 'obj') {
    return new OBJLoader().loadAsync(url);
  }
  return new FBXLoader().loadAsync(url);
}

/** Center a loaded object at the origin and scale it to a consistent
 *  footprint, since a real uploaded file can be any real-world scale
 *  (millimeters to meters) unlike the hand-tuned procedural placeholders. */
export function normalizeAndCenterObject(object: THREE.Object3D, targetSize = 2.2) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0 && isFinite(maxDim)) {
    const scale = targetSize / maxDim;
    object.scale.setScalar(scale);
    object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }
}

/** Normalize every mesh onto MeshStandardMaterial so lighting and any
 *  downstream shader-filter system behaves predictably. glTF materials are
 *  already MeshStandardMaterial (keeps real textures/colors); OBJ/FBX
 *  materials (MeshPhongMaterial etc.) get replaced with a plausible
 *  equivalent, keeping whatever flat color they had. */
export function standardizeMaterials(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && !(child.material instanceof THREE.MeshStandardMaterial)) {
      const prevColor =
        (child.material as THREE.Material & { color?: THREE.Color })?.color?.clone() || new THREE.Color('#94a3b8');
      child.material = new THREE.MeshStandardMaterial({ color: prevColor, roughness: 0.5, metalness: 0.3 });
    }
  });
}

/**
 * Resolves the 3D model source URL for a given asset.
 * Checks for:
 * 1. Bundled / static local assets (e.g. Lara Croft glb).
 * 2. Any local static file placed in /models/${modelFileName}.
 * 3. Signed Cloudflare R2 download URL if published with an R2 key.
 */
export async function getModelUrlForAsset(asset: {
  id?: string;
  title?: string;
  modelFileName?: string;
  r2ModelKey?: string;
}): Promise<string | null> {
  const fileName = (asset.modelFileName || '').toLowerCase();
  const title = (asset.title || '').toLowerCase();

  // 1. Direct local bundle check for Lara Croft
  if (fileName.includes('laracroft') || title.includes('lara croft') || fileName.includes('lara_croft')) {
    return '/models/laracroft.glb';
  }

  // 2. Check if a local model matching modelFileName exists in /models/
  if (asset.modelFileName) {
    try {
      const testRes = await fetch(`/models/${asset.modelFileName}`, { method: 'HEAD' });
      if (testRes.ok) {
        return `/models/${asset.modelFileName}`;
      }
    } catch {
      // ignore
    }
  }

  // 3. If R2 model key is present, try signed download URL
  if (asset.r2ModelKey) {
    try {
      const res = await fetch('/api/polyvault/sign-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: asset.r2ModelKey, filename: asset.modelFileName }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.downloadUrl) return data.downloadUrl;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

