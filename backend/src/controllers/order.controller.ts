import { Request, Response } from 'express';
import { db } from '../db.ts';
import { emailService } from '../services/email.service.ts';
import crypto from 'crypto';

// Helper to generate format: PTP-YYYYMMDD-XXXXX
function generateOrderId(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase().substring(0, 5);
  return `PTP-${yyyy}${mm}${dd}-${randomChars}`;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      gameId,
      productId,
      playerId,
      serverId,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = 'QRIS_DANA'
    } = req.body;

    // Validation
    if (!gameId || !productId || !playerId || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Data formulir tidak lengkap. Harap lengkapi semua kolom yang wajib diisi.'
      });
    }

    // Backend must query database for game and product, NEVER TRUST FRONTEND PRICE
    const game = await db.get('SELECT * FROM games WHERE id = ? AND active = TRUE', [gameId]);
    if (!game) {
      return res.status(400).json({ success: false, message: 'Game tidak ditemukan atau sedang tidak aktif.' });
    }

    if (game.has_server_id && !serverId) {
      return res.status(400).json({ success: false, message: `Game ini memerlukan ${game.server_label || 'Server ID'}.` });
    }

    const product = await db.get('SELECT * FROM products WHERE id = ? AND game_id = ? AND active = TRUE', [productId, gameId]);
    if (!product) {
      return res.status(400).json({ success: false, message: 'Produk yang dipilih tidak valid atau tidak aktif.' });
    }

    const trueAmount = Number(product.price);

    // Upsert User
    let user = await db.get('SELECT * FROM users WHERE email = ?', [customerEmail.trim().toLowerCase()]);
    let userId: number;

    if (!user) {
      const userRes = await db.run(
        `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`,
        [customerName.trim(), customerEmail.trim().toLowerCase(), customerPhone.trim()]
      );
      userId = userRes.lastID || (await db.get('SELECT id FROM users WHERE email = ?', [customerEmail.trim().toLowerCase()]))?.id;
    } else {
      userId = user.id;
      // Update phone or name if changed
      await db.run(
        `UPDATE users SET name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?`,
        [customerName.trim(), customerPhone.trim(), userId]
      );
    }

    // Generate unique order ID
    let orderId = generateOrderId();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await db.get('SELECT id FROM orders WHERE order_id = ?', [orderId]);
      if (!existing) {
        isUnique = true;
      } else {
        orderId = generateOrderId();
        attempts++;
      }
    }

    // Insert order with PENDING_PAYMENT status
    await db.run(
      `INSERT INTO orders (order_id, user_id, game_id, product_id, player_id, server_id, total_amount, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_PAYMENT')`,
      [orderId, userId, gameId, productId, playerId.trim(), serverId ? serverId.trim() : null, trueAmount, paymentMethod]
    );

    // Create Notification in Database for Admin
    await db.run(
      `INSERT INTO notifications (type, title, message, order_id)
       VALUES ('NEW_ORDER', ?, ?, ?)`,
      [
        `Pesanan Baru: ${orderId}`,
        `Customer ${customerName} memesan ${product.name} untuk game ${game.name} total Rp ${trueAmount.toLocaleString('id-ID')}`,
        orderId
      ]
    );

    // Trigger Email Notification (Nodemailer)
    emailService.sendNewOrderNotification({
      orderId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      gameName: game.name,
      productName: product.name,
      playerId: playerId.trim(),
      serverId: serverId ? serverId.trim() : null,
      totalAmount: trueAmount,
      paymentMethod,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
    }).catch(err => console.error('[OrderController] Email sending error:', err));

    return res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat. Silakan lanjutkan ke pembayaran.',
      order: {
        orderId,
        totalAmount: trueAmount,
        status: 'PENDING_PAYMENT',
        gameName: game.name,
        productName: product.name
      }
    });

  } catch (error: any) {
    console.error('[createOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem saat membuat pesanan.' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await db.get(
      `SELECT o.*, 
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              g.name as game_name, g.slug as game_slug, g.logo as game_logo, g.banner as game_banner,
              g.player_label, g.server_label, g.has_server_id,
              p.name as product_name, p.amount as product_amount,
              pp.storage_path as proof_path, pp.original_filename as proof_filename, pp.uploaded_at as proof_uploaded_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN payment_proofs pp ON pp.order_id = o.id
       WHERE o.order_id = ? OR o.id = ?`,
      [id, isNaN(Number(id)) ? -1 : Number(id)]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    return res.json({ success: true, order });
  } catch (error: any) {
    console.error('[getOrderById] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
};

export const uploadProof = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'File bukti pembayaran wajib diunggah.' });
    }

    // Find order
    const order = await db.get(
      `SELECT o.*, u.name as customer_name, g.name as game_name, p.name as product_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       JOIN products p ON o.product_id = p.id
       WHERE o.order_id = ? OR o.id = ?`,
      [id, isNaN(Number(id)) ? -1 : Number(id)]
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Pesanan ini sudah selesai.' });
    }

    const storagePath = `/uploads/proofs/${file.filename}`;

    // Insert or update payment_proofs
    const existingProof = await db.get('SELECT id FROM payment_proofs WHERE order_id = ?', [order.id]);
    if (existingProof) {
      await db.run(
        `UPDATE payment_proofs 
         SET storage_path = ?, original_filename = ?, mime_type = ?, file_size = ?, uploaded_at = datetime('now')
         WHERE order_id = ?`,
        [storagePath, file.originalname, file.mimetype, file.size, order.id]
      );
    } else {
      await db.run(
        `INSERT INTO payment_proofs (order_id, storage_path, original_filename, mime_type, file_size)
         VALUES (?, ?, ?, ?, ?)`,
        [order.id, storagePath, file.originalname, file.mimetype, file.size]
      );
    }

    // Update status to WAITING_VERIFICATION
    await db.run(
      `UPDATE orders SET status = 'WAITING_VERIFICATION', updated_at = datetime('now') WHERE id = ?`,
      [order.id]
    );

    // Create Notification for Admin
    await db.run(
      `INSERT INTO notifications (type, title, message, order_id)
       VALUES ('PAYMENT_PROOF', ?, ?, ?)`,
      [
        `Bukti Bayar Baru: ${order.order_id}`,
        `Customer ${order.customer_name} telah mengunggah bukti bayar untuk pesanan ${order.order_id}`,
        order.order_id
      ]
    );

    // Send email notification to admin
    emailService.sendPaymentProofNotification({
      orderId: order.order_id,
      customerName: order.customer_name,
      gameName: order.game_name,
      productName: order.product_name,
      totalAmount: Number(order.total_amount),
      uploadedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      status: 'WAITING_VERIFICATION'
    }).catch(err => console.error('[uploadProof] Email sending error:', err));

    return res.json({
      success: true,
      message: 'Bukti pembayaran berhasil diunggah. Tim admin kami sedang memverifikasi pesanan Anda.',
      proofPath: storagePath
    });

  } catch (error: any) {
    console.error('[uploadProof] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengunggah bukti pembayaran.' });
  }
};

export const checkOrder = async (req: Request, res: Response) => {
  try {
    const orderId = (req.query.order_id as string || '').trim();
    const identifier = (req.query.identifier as string || '').trim().toLowerCase();

    if (!orderId || !identifier) {
      return res.status(400).json({
        success: false,
        message: 'Order ID dan Email/Nomor WhatsApp wajib dimasukkan untuk verifikasi keamanan.'
      });
    }

    const order = await db.get(
      `SELECT o.id, o.order_id, o.player_id, o.server_id, o.total_amount, o.payment_method,
              o.status, o.rejection_reason, o.process_note, o.created_at, o.updated_at,
              u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              g.name as game_name, g.slug as game_slug, g.logo as game_logo, g.banner as game_banner,
              g.player_label, g.server_label, g.has_server_id,
              p.name as product_name, p.amount as product_amount,
              pp.storage_path as proof_path, pp.uploaded_at as proof_uploaded_at
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN games g ON o.game_id = g.id
       JOIN products p ON o.product_id = p.id
       LEFT JOIN payment_proofs pp ON pp.order_id = o.id
       WHERE o.order_id = ? AND (LOWER(u.email) = ? OR u.phone = ?)`,
      [orderId, identifier, identifier]
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan. Pastikan Order ID dan Email/Nomor WhatsApp yang Anda masukkan sesuai.'
      });
    }

    return res.json({ success: true, order });
  } catch (error: any) {
    console.error('[checkOrder] Error:', error);
    return res.status(500).json({ success: false, message: 'Gagal memeriksa status pesanan.' });
  }
};
