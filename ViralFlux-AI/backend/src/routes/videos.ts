import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimit';
import { env } from '../config/env';
import {
  uploadVideo,
  getVideos,
  getVideo,
  deleteVideo,
  getClips,
  createExport,
  getExports,
} from '../controllers/videoController';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, AVI, and MKV are allowed.'));
    }
  },
});

const router = Router();

router.get('/', authenticate, getVideos);
router.post('/upload', authenticate, uploadLimiter, upload.single('video'), uploadVideo);
router.get('/:id', authenticate, getVideo);
router.delete('/:id', authenticate, deleteVideo);
router.get('/:videoId/clips', authenticate, getClips);
router.post('/exports', authenticate, createExport);
router.get('/exports/list', authenticate, getExports);

export default router;
