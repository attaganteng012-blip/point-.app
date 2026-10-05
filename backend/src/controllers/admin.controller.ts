import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.ts';
import { AdminAuthRequest } from '../middleware/auth.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'point_plus_super_secret_jwt_key_2026_secure';

// Helper for activity log
async function logActivity(adminId: number | null, action: string, description: string, orderId: string | null = null, ipAddress: string = '127.0.0.1') {
  try {
    await db.run(
      `INSERT INTO admin_logs (admin_id, action, order_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?)`,
      [adminId, action, orderId, description, ipAddress]
    );
  } catch (err) {
    console.error('[logActivity] Failed to log:', err);
  }
}

export const adminLogin = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const admin = await db.get('SELECT * FROM admins WHERE LOWER(email) = ?', [email.trim().toLowerCase()]);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await logActivity(admin.id, 'LOGIN', `Admin ${admin.name} berhasil login`, null, req.ip);

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error: any) {
    console.error('[adminLogin] Error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login.' });
  }
};

export const adminLogout = async (req: AdminAuthRequest, res: Response) => {
  try {
    if (req.admin) {
      await logActivity(req.admin.id, 'LOGOUT', `Admin ${req.admin.name} logout`, null, req.ip);
    }
    res.clearCookie('admin_token');
    return res.json({ success: true, message: 'Logout berhasil.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal logout.' });
  }
};

export const getAdminMe = async (req: AdminAuthRequest, res: Response) => {
  return res.json({ success: true, admin: req.admin });
};

export const getStatistics = async (req: AdminAuthRequest, res: Response) => {
  try {
    const totalOrdersRes = await db.get('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_revenue FROM orders');
    
    // Today's count
    const todayOrdersRes = await db.get(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as today_revenue 
       FROM orders 
       WHERE date(created_at) = date('now')`
    );

    // Status counts
    const statusCounts = await db.query(
      `SELECT status, COUNT(*) as count FROM orders GROUP BY status`
    );

    const statusMap: Record<string, number> = {
      PENDING_PAYMENT: 0,
      WAITING_VERIFICATION: 0,
      PAID: 0,
      PROCESSING: 0,
      COMPLETED: 0,
      REJECTED: 0,
      EXPIRED: 0,
      CANCELLED: 0
    };

    statusCounts.rows.forEach((r: any) => {
      statusMap[r.status] = Number(r.count);
    });

    const totalUsersRes = await db.get('SELECT COUNT(*) as count FROM users');

    return res.json({
      success: true,
      statistics: {
        totalOrders: Number(totalOrdersRes?.count || 0),
        totalRevenue: Number(totalOrdersRes?.total_revenue || 0),
        todayOrders: Number(todayOrdersRes?.count || 0),
        todayRevenue: Number(todayOrdersRes?.today_revenue || 0),
        totalUsers: Number(totalUsersRes?.count || 0),
        pendingPayment: statusMap.PENDING_PAYMENT || 0,
        waitingVerification: statusMap.WAITING_VERIFICATION || 0,
        paid: statusMap.PAID || 0,
        processing: statusMap.PROCESSING || 0,
        completed: statusMap.COMPLETED || 0,
        rejected: statusMap.REJECTED || 0
      }
    });

  } catch (error: any) {
    console.error('[getStatistics] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat statistik.' });
  }
};

export const getOrders = async (req: AdminAuthRequest, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit as string || '15', 10));
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const search = (req.query.search as string || '').trim().toLowerCase();

    let whereClauses: string[] = [];
    let params: any[] = [];

    if (status && status !== 'ALL') {
      whereClauses.push('o.status = ?');
      params.push(status);
    }

    if (search) {
      whereClauses.push('(LOWER(o.order_id) LIKE ? OR LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ? OR u.phone LIKE ? OR LOWER(g.name) LIKE ?)');
      const wild = `%${search}%`;
      params.push(wild, wild, wild, wild, wild);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countRes = await db.get(
      `SELECT COUNT(*) as total
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       ${whereSql}`,
      params
    );

    const orders = await db.query(
      `SELECT o.*, 
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              g.name as game_name, g.slug as game_slug,
              p.name as product_name,
              pp.storage_path as proof_path, pp.uploaded_at as proof_uploaded_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN payment_proofs pp ON pp.order_id = o.id
       ${whereSql}
       ORDER BY o.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return res.json({
      success: true,
      orders: orders.rows,
      pagination: {
        page,
        limit,
        total: Number(countRes?.total || 0),
        totalPages: Math.ceil(Number(countRes?.total || 0) / limit)
      }
    });

  } catch (error: any) {
    console.error('[getOrders] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar pesanan.' });
  }
};

export const getOrderDetail = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await db.get(
      `SELECT o.*, 
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              g.name as game_name, g.slug as game_slug, g.logo as game_logo, g.banner as game_banner,
              g.player_label, g.server_label, g.has_server_id,
              p.name as product_name, p.amount as product_amount,
              pp.storage_path as proof_path, pp.original_filename as proof_filename,
              pp.mime_type as proof_mime, pp.file_size as proof_size,
              pp.uploaded_at as proof_uploaded_at, pp.verified_at as proof_verified_at,
              admin_ver.name as verified_by_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN payment_proofs pp ON pp.order_id = o.id
       LEFT JOIN admins admin_ver ON pp.verified_by = admin_ver.id
       WHERE o.order_id = ? OR o.id = ?`,
      [id, isNaN(Number(id)) ? -1 : Number(id)]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const activityLogs = await db.query(
      `SELECT al.*, a.name as admin_name 
       FROM admin_logs al
       LEFT JOIN admins a ON al.admin_id = a.id
       WHERE al.order_id = ?
       ORDER BY al.id DESC`,
      [order.order_id]
    );

    return res.json({ success: true, order, logs: activityLogs.rows });

  } catch (error: any) {
    console.error('[getOrderDetail] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
};

export const approveOrder = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await db.get('SELECT * FROM orders WHERE order_id = ? OR id = ?', [id, isNaN(Number(id)) ? -1 : Number(id)]);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    // Set to PAID
    await db.run(
      `UPDATE orders SET status = 'PAID', updated_at = datetime('now') WHERE id = ?`,
      [order.id]
    );

    // Update proof verification timestamp
    await db.run(
      `UPDATE payment_proofs SET verified_at = datetime('now'), verified_by = ? WHERE order_id = ?`,
      [req.admin?.id, order.id]
    );

    await logActivity(
      req.admin?.id || null,
      'APPROVE_PAYMENT',
      `Pembayaran pesanan ${order.order_id} disetujui oleh ${req.admin?.name}`,
      order.order_id,
      req.ip
    );

    return res.json({ success: true, message: 'Pembayaran berhasil disetujui (Status: PAID).' });

  } catch (error: any) {
    console.error('[approveOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyetujui pesanan.' });
  }
};

export const rejectOrder = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Admin wajib memberikan alasan penolakan pembayaran.' });
    }

    const order = await db.get('SELECT * FROM orders WHERE order_id = ? OR id = ?', [id, isNaN(Number(id)) ? -1 : Number(id)]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.run(
      `UPDATE orders SET status = 'REJECTED', rejection_reason = ?, updated_at = datetime('now') WHERE id = ?`,
      [reason.trim(), order.id]
    );

    await logActivity(
      req.admin?.id || null,
      'REJECT_PAYMENT',
      `Pembayaran pesanan ${order.order_id} ditolak: ${reason.trim()}`,
      order.order_id,
      req.ip
    );

    return res.json({ success: true, message: 'Pesanan telah ditolak dengan alasan yang tercatat.' });

  } catch (error: any) {
    console.error('[rejectOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menolak pesanan.' });
  }
};

export const processOrder = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const order = await db.get('SELECT * FROM orders WHERE order_id = ? OR id = ?', [id, isNaN(Number(id)) ? -1 : Number(id)]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.run(
      `UPDATE orders SET status = 'PROCESSING', process_note = ?, updated_at = datetime('now') WHERE id = ?`,
      [note ? note.trim() : order.process_note, order.id]
    );

    await logActivity(
      req.admin?.id || null,
      'PROCESS_ORDER',
      `Status pesanan ${order.order_id} diubah menjadi PROCESSING`,
      order.order_id,
      req.ip
    );

    return res.json({ success: true, message: 'Status pesanan diubah menjadi PROCESSING.' });

  } catch (error: any) {
    console.error('[processOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memproses pesanan.' });
  }
};

export const completeOrder = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const order = await db.get('SELECT * FROM orders WHERE order_id = ? OR id = ?', [id, isNaN(Number(id)) ? -1 : Number(id)]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    await db.run(
      `UPDATE orders SET status = 'COMPLETED', process_note = ?, updated_at = datetime('now') WHERE id = ?`,
      [note ? note.trim() : order.process_note, order.id]
    );

    await logActivity(
      req.admin?.id || null,
      'COMPLETE_ORDER',
      `Pesanan ${order.order_id} berhasil diselesaikan (COMPLETED)`,
      order.order_id,
      req.ip
    );

    return res.json({ success: true, message: 'Pesanan telah berhasil diselesaikan (COMPLETED).' });

  } catch (error: any) {
    console.error('[completeOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal menyelesaikan pesanan.' });
  }
};

export const getUsers = async (req: AdminAuthRequest, res: Response) => {
  try {
    const users = await db.query(
      `SELECT u.*, 
              COUNT(o.id) as order_count,
              COALESCE(SUM(CASE WHEN o.status = 'COMPLETED' OR o.status = 'PAID' THEN o.total_amount ELSE 0 END), 0) as total_spend,
              MAX(o.created_at) as last_order_date
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       GROUP BY u.id
       ORDER BY total_spend DESC, u.id DESC`
    );

    return res.json({ success: true, users: users.rows });
  } catch (error: any) {
    console.error('[getUsers] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna.' });
  }
};

export const getNotifications = async (req: AdminAuthRequest, res: Response) => {
  try {
    const notifs = await db.query(
      `SELECT * FROM notifications ORDER BY id DESC LIMIT 50`
    );
    const unreadCountRes = await db.get('SELECT COUNT(*) as count FROM notifications WHERE is_read = FALSE');

    return res.json({
      success: true,
      notifications: notifs.rows,
      unreadCount: Number(unreadCountRes?.count || 0)
    });
  } catch (error: any) {
    console.error('[getNotifications] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi.' });
  }
};

export const markNotificationRead = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.run('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Notifikasi ditandai telah dibaca.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui notifikasi.' });
  }
};

export const markAllNotificationsRead = async (req: AdminAuthRequest, res: Response) => {
  try {
    await db.run('UPDATE notifications SET is_read = TRUE');
    return res.json({ success: true, message: 'Semua notifikasi telah ditandai dibaca.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal memperbarui notifikasi.' });
  }
};

export const getActivityLogs = async (req: AdminAuthRequest, res: Response) => {
  try {
    const logs = await db.query(
      `SELECT al.*, a.name as admin_name, a.email as admin_email
       FROM admin_logs al
       LEFT JOIN admins a ON al.admin_id = a.id
       ORDER BY al.id DESC
       LIMIT 100`
    );
    return res.json({ success: true, logs: logs.rows });
  } catch (error: any) {
    console.error('[getActivityLogs] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memuat log aktivitas.' });
  }
};

// Admin Products CRUD
export const getAdminProducts = async (req: AdminAuthRequest, res: Response) => {
  try {
    const gameId = req.query.game_id;
    let sql = `SELECT p.*, g.name as game_name, g.slug as game_slug 
               FROM products p
               JOIN games g ON p.game_id = g.id`;
    const params: any[] = [];
    if (gameId) {
      sql += ' WHERE p.game_id = ?';
      params.push(gameId);
    }
    sql += ' ORDER BY g.id ASC, p.price ASC';

    const prods = await db.query(sql, params);
    const games = await db.query('SELECT id, name, slug FROM games ORDER BY id ASC');

    return res.json({ success: true, products: prods.rows, games: games.rows });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal memuat produk.' });
  }
};

export const createAdminProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { game_id, name, amount, price, active = true } = req.body;
    if (!game_id || !name || !amount || price === undefined) {
      return res.status(400).json({ success: false, message: 'Data produk tidak lengkap.' });
    }

    const resInsert = await db.run(
      `INSERT INTO products (game_id, name, amount, price, active) VALUES (?, ?, ?, ?, ?)`,
      [game_id, name.trim(), amount.trim(), Number(price), Boolean(active)]
    );

    await logActivity(req.admin?.id || null, 'CREATE_PRODUCT', `Tambah produk baru: ${name} (Rp ${price})`, null, req.ip);

    return res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan.', id: resInsert.lastID });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal menambah produk.' });
  }
};

export const updateAdminProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, amount, price, active } = req.body;

    const prod = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    await db.run(
      `UPDATE products 
       SET name = ?, amount = ?, price = ?, active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name !== undefined ? name.trim() : prod.name,
        amount !== undefined ? amount.trim() : prod.amount,
        price !== undefined ? Number(price) : prod.price,
        active !== undefined ? Boolean(active) : prod.active,
        id
      ]
    );

    await logActivity(req.admin?.id || null, 'UPDATE_PRODUCT', `Edit produk #${id} ${name || prod.name} (Rp ${price ?? prod.price})`, null, req.ip);

    return res.json({ success: true, message: 'Produk berhasil diperbarui.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal mengubah produk.' });
  }
};

export const deleteAdminProduct = async (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const prod = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!prod) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    }

    await db.run('DELETE FROM products WHERE id = ?', [id]);
    await logActivity(req.admin?.id || null, 'DELETE_PRODUCT', `Hapus produk #${id} ${prod.name}`, null, req.ip);

    return res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus produk.' });
  }
};
