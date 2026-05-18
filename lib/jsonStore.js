import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const rootDir = process.cwd();
export const dataDir = path.join(rootDir, 'data');
export const uploadsDir = path.join(rootDir, 'uploads');

const defaults = {
  'settings.json': null,
  'providers.json': [],
  'requests.json': [],
  'users.json': [],
};

export async function ensureStorage() {
  await mkdir(dataDir, { recursive: true });
  await mkdir(uploadsDir, { recursive: true });

  await Promise.all(Object.entries(defaults).map(async ([file, value]) => {
    try {
      await readFile(path.join(dataDir, file), 'utf8');
    } catch {
      await writeJson(file, value);
    }
  }));
}

export async function readJson(file) {
  await ensureStorage();
  const fullPath = path.join(dataDir, file);

  try {
    const raw = await readFile(fullPath, 'utf8');
    if (!raw.trim()) return defaults[file] ?? null;
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJson(file, defaults[file] ?? null);
      return defaults[file] ?? null;
    }
    if (error instanceof SyntaxError) {
      await rename(fullPath, `${fullPath}.malformed-${Date.now()}`);
      await writeJson(file, defaults[file] ?? null);
      return defaults[file] ?? null;
    }
    throw error;
  }
}

export async function writeJson(file, data) {
  await mkdir(dataDir, { recursive: true });
  const fullPath = path.join(dataDir, file);
  const tempPath = `${fullPath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  await rename(tempPath, fullPath);
  return data;
}
