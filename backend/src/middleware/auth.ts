import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AdminAuthRequest extends Request {
  admin?: AdminPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'point_plus_super_secret_jwt_key_2026_secure';

export const requireAdmin = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  // Check authorization header or cookie
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Autentikasi admin diperlukan. Silakan login terlebih dahulu.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Sesi login telah kedaluwarsa atau tidak valid.' });
  }
};

export const requireSuperAdmin = (req: AdminAuthRequest, res: Response, next: NextFunction) => {
  requireAdmin(req, res, () => {
    if (req.admin?.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Fitur ini memerlukan hak SUPER_ADMIN.' });
    }
    next();
  });
};
