import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './simpleStore';

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

export async function readProjects(): Promise<Project[]> {
  return await readJson<Project[]>('projects.json', []);
}

export async function writeProjects(projects: Project[]) {
  await writeJson('projects.json', projects);
}

export function nextId(projects: Project[]): number {
  const max = projects.reduce((m, p) => (p.id > m ? p.id : m), 0);
  return max + 1;
}

export function getUploadsDir() {
  ensureStorage();
  return uploadsDir;
}