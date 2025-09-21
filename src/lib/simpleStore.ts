import fs from 'fs';
import path from 'path';
import { put, list, del } from '@vercel/blob';

const dataDir = path.join(process.cwd(), 'src', 'data');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function isBlobConfigured(): boolean {
  // If a blob host is provided, we can read via HTTPS; for writes, token is required
  return Boolean(process.env.NEXT_PUBLIC_BLOB_HOST) || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  // Try Vercel Blob first in production if token available
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.VERCEL && token) {
    try {
      // Find exact blob by pathname
      const resp = await list({ token } as any);
      const targetPath = `data/${fileName}`;
      const found = resp.blobs.find(b => b.pathname === targetPath);
      if (found) {
        const res = await fetch(`${found.url}?v=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = (await res.json()) as T;
          return json;
        }
      }
    } catch {
      // fall through to local
    }
  }

  // Local filesystem fallback (dev/local or when Blob not configured)
  ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(fileName: string, data: T): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  // Write to Blob if token is available (in Vercel environments)
  if (token && process.env.VERCEL) {
    try {
      // First attempt: try put with allowOverwrite
      await put(`data/${fileName}`, JSON.stringify(data, null, 2), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        cacheControlMaxAge: 60,
        token,
        allowOverwrite: true,
      } as any);
      return;
    } catch (error) {
      // Recovery strategy: delete existing blob then put again
      try {
        // Find and delete existing blob
        const resp = await list({ token } as any);
        const targetPath = `data/${fileName}`;
        const found = resp.blobs.find(b => b.pathname === targetPath);
        if (found) {
          await del(found.url, { token } as any);
        }
        
        // Try put again without allowOverwrite
        await put(`data/${fileName}`, JSON.stringify(data, null, 2), {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false,
          cacheControlMaxAge: 60,
          token,
        } as any);
        return;
      } catch {
        // fall back to local
      }
    }
  }

  // On Vercel without token, do not attempt to write to read-only filesystem
  if (process.env.VERCEL && !token) {
    throw new Error('Blob non configuré: BLOB_READ_WRITE_TOKEN manquant en Production');
  }

  // Local filesystem fallback
  ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}