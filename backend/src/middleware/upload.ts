import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
const uploadDir = isServerless 
  ? path.resolve('/tmp/uploads/proofs') 
  : path.resolve(process.cwd(), 'uploads/proofs');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Upload] Failed to create upload dir:', e);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure random filename with original extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const safeName = `proof_${Date.now()}_${uniqueSuffix}${ext}`;
    cb(null, safeName);
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

export const uploadPaymentProof = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Format file tidak didukung. Harap unggah format JPG, JPEG, PNG, atau WEBP.'));
    }
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('MIME file tidak valid. Harap unggah gambar asli.'));
    }
    cb(null, true);
  },
});
