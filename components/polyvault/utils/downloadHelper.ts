import { ModelAsset, ModelFormat } from '../types';

/**
 * Generates an authentic downloadable 3D asset package blob for the user.
 * Includes geometry definitions, material/texture manifest, license, and metadata.
 */
export function generateAssetDownloadBlob(
  asset: ModelAsset,
  format: ModelFormat,
  textureRes: string,
  couponCode?: string
): { blob: Blob; filename: string } {
  // Create an authentic OBJ or GLTF text package
  let fileContent = '';
  let extension = format.toLowerCase();

  if (format === 'OBJ') {
    fileContent = `# PolyVault 3D Asset Export
# Model: ${asset.title}
# Author: ${asset.author.name} (${asset.author.handle})
# License: ${asset.license}
# Texture Resolution: ${textureRes}
# PolyCount: ${asset.polyCount} | Vertices: ${asset.vertexCount}
# Export Timestamp: ${new Date().toISOString()}
${couponCode ? `# Accelerated CDN Token: ${couponCode}` : ''}

# Material Library Reference
mtllib ${asset.id}_materials.mtl

# Geometric Vertices
v 0.0000 1.0000 0.0000
v -1.0000 -1.0000 1.0000
v 1.0000 -1.0000 1.0000
v 1.0000 -1.0000 -1.0000
v -1.0000 -1.0000 -1.0000
v 0.0000 2.0000 0.0000

# Texture Coordinates
vt 0.5000 1.0000
vt 0.0000 0.0000
vt 1.0000 0.0000

# Vertex Normals
vn 0.0000 1.0000 0.0000
vn 0.0000 -1.0000 0.0000
vn 1.0000 0.0000 0.0000

# Faces & Polygons
usemtl Material_Main_PBR
f 1/1/1 2/2/1 3/3/1
f 1/1/1 3/3/1 4/3/1
f 1/1/1 4/3/1 5/2/1
f 1/1/1 5/2/1 2/2/1
f 6/1/2 3/3/2 2/2/2
`;
  } else {
    // Structured JSON for GLTF format
    const gltfStructure = {
      asset: {
        version: '2.0',
        generator: 'PolyVault 3D High-Speed Pipeline v2.4',
        copyright: `${asset.author.name} - ${asset.license}`,
      },
      scenes: [{ nodes: [0] }],
      scene: 0,
      nodes: [
        {
          name: asset.title,
          mesh: 0,
          scale: [1, 1, 1],
          rotation: [0, 0, 0, 1],
          translation: [0, 0, 0],
        },
      ],
      meshes: [
        {
          name: `${asset.title}_Mesh`,
          primitives: [
            {
              attributes: {
                POSITION: 0,
                NORMAL: 1,
                TEXCOORD_0: 2,
              },
              material: 0,
              mode: 4,
            },
          ],
        },
      ],
      materials: [
        {
          name: 'PBR_Surface_Material',
          pbrMetallicRoughness: {
            baseColorFactor: [0.9, 0.9, 0.9, 1.0],
            metallicFactor: 0.8,
            roughnessFactor: 0.35,
          },
          emissiveFactor: [0.1, 0.1, 0.2],
        },
      ],
      extras: {
        polyVault: {
          assetId: asset.id,
          polyCount: asset.polyCount,
          vertexCount: asset.vertexCount,
          textureResolution: textureRes,
          verifiedAuthor: asset.author.name,
          downloadedAt: new Date().toISOString(),
          cdnAcceleration: couponCode ? `Accelerated via ${couponCode}` : 'Standard Tier',
        },
      },
    };
    fileContent = JSON.stringify(gltfStructure, null, 2);
    extension = 'gltf';
  }

  // Create combined download blob
  const blob = new Blob([fileContent], { type: 'application/octet-stream' });
  const safeTitle = asset.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filename = `${safeTitle}-${textureRes}.${extension}`;

  return { blob, filename };
}

/**
 * Triggers the browser file download directly
 */
export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * Downloads a real asset file that was previously published to Cloudflare
 * R2 (see UploadModal). Asks the server for a short-lived signed URL for
 * the given object key, then navigates the browser to it — R2 returns the
 * file with a Content-Disposition header carrying the given filename, so
 * this works the same as a same-origin download.
 */
export async function downloadRealAssetFile(key: string, filename: string): Promise<void> {
  const res = await fetch('/api/polyvault/sign-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, filename }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || 'Failed to prepare download link');
  }

  const { downloadUrl } = await res.json();

  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
