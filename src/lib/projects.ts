import fs from 'fs';
import path from 'path';

export type Project = {
  id: number;
  nom: string;
  desc: string;
  client?: string;
  infos?: string;
  images: string[];
  logo?: string;
};

const dataDir = path.join(process.cwd(), 'src', 'data');
const dataFile = path.join(dataDir, 'projects.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');

export function ensureStorage() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf-8');
}

export function readProjects(): Project[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeProjects(projects: Project[]) {
  ensureStorage();
  fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2), 'utf-8');
}

export function nextId(projects: Project[]): number {
  const max = projects.reduce((m, p) => (p.id > m ? p.id : m), 0);
  return max + 1;
}

export function getUploadsDir() {
  ensureStorage();
  return uploadsDir;
}