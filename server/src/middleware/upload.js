import path from 'node:path';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { uploadsDir } from '../storage/jsonStore.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${nanoid(10)}${ext}`);
  },
});

export const uploadPhotos = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'));
      return;
    }
    callback(null, true);
  },
});
