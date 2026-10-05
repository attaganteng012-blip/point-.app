import nodemailer, { Transporter } from 'nodemailer';

export interface NewOrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  gameName: string;
  productName: string;
  playerId: string;
  serverId?: string | null;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface PaymentProofEmailData {
  orderId: string;
  customerName: string;
  gameName: string;
  productName: string;
  totalAmount: number;
  uploadedAt: string;
  status: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private adminEmail: string = process.env.ADMIN_EMAIL || 'attaerpeel@gmail.com';

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASSWORD;
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      console.log('[EmailService] SMTP Transporter initialized for:', user);
    } else {
      console.log('[EmailService] SMTP credentials not set. Emails will be logged to backend console.');
    }
  }

  async sendNewOrderNotification(data: NewOrderEmailData): Promise<void> {
    const subject = `[POINT+] Pesanan Baru #${data.orderId}`;
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const adminLink = `${baseUrl}/admin/orders/${data.orderId}`;

    const textContent = `
========================================
[POINT+] NOTIFIKASI PESANAN BARU
========================================
Order ID        : ${data.orderId}
Customer        : ${data.customerName}
Email           : ${data.customerEmail}
WhatsApp        : ${data.customerPhone}
Game            : ${data.gameName}
Product         : ${data.productName}
Player ID       : ${data.playerId}
Server ID       : ${data.serverId || '-'}
Total           : Rp ${data.totalAmount.toLocaleString('id-ID')}
Metode Bayar    : ${data.paymentMethod}
Status          : ${data.status}
Waktu Order     : ${data.createdAt}
----------------------------------------
Link Admin Order: ${adminLink}
========================================
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #e11d48; margin-top: 0;">[POINT+] Pesanan Baru #${data.orderId}</h2>
        <p>Pesanan baru telah dibuat oleh pelanggan. Berikut adalah rinciannya:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; width: 35%;">Order ID</td><td style="padding: 8px;">${data.orderId}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Customer</td><td style="padding: 8px;">${data.customerName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${data.customerEmail}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">WhatsApp</td><td style="padding: 8px;">${data.customerPhone}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Game</td><td style="padding: 8px;">${data.gameName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Produk</td><td style="padding: 8px;">${data.productName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Player ID</td><td style="padding: 8px;">${data.playerId}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Server ID</td><td style="padding: 8px;">${data.serverId || '-'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Total Bayar</td><td style="padding: 8px; font-size: 16px; color: #e11d48; font-weight: bold;">Rp ${data.totalAmount.toLocaleString('id-ID')}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Metode</td><td style="padding: 8px;">${data.paymentMethod}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Status</td><td style="padding: 8px;"><span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${data.status}</span></td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Waktu Order</td><td style="padding: 8px;">${data.createdAt}</td></tr>
        </table>
        <div style="margin-top: 25px;">
          <a href="${adminLink}" style="background: #e11d48; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Buka Halaman Admin Order</a>
        </div>
      </div>
    `;

    console.log(`[EmailService] Sending New Order Email to ${this.adminEmail}:`, textContent);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"POINT+ System" <${process.env.EMAIL_USER}>`,
          to: this.adminEmail,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[EmailService] New order email successfully sent to ${this.adminEmail}`);
      } catch (err) {
        console.error('[EmailService] Failed to send email via SMTP:', err);
      }
    }
  }

  async sendPaymentProofNotification(data: PaymentProofEmailData): Promise<void> {
    const subject = `[POINT+] Bukti Pembayaran Baru #${data.orderId}`;
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const adminLink = `${baseUrl}/admin/orders/${data.orderId}`;

    const textContent = `
========================================
[POINT+] BUKTI PEMBAYARAN BARU
========================================
Order ID        : ${data.orderId}
Customer        : ${data.customerName}
Game            : ${data.gameName}
Product         : ${data.productName}
Total           : Rp ${data.totalAmount.toLocaleString('id-ID')}
Waktu Upload    : ${data.uploadedAt}
Status          : ${data.status}
----------------------------------------
Link Admin Order: ${adminLink}
========================================
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0284c7; margin-top: 0;">[POINT+] Bukti Pembayaran Baru #${data.orderId}</h2>
        <p>Customer telah mengunggah bukti transfer pembayaran QRIS. Silakan verifikasi bukti pembayaran di bawah:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold; width: 35%;">Order ID</td><td style="padding: 8px;">${data.orderId}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Customer</td><td style="padding: 8px;">${data.customerName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Game</td><td style="padding: 8px;">${data.gameName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Produk</td><td style="padding: 8px;">${data.productName}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Total</td><td style="padding: 8px; font-weight: bold; color: #0284c7;">Rp ${data.totalAmount.toLocaleString('id-ID')}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px; font-weight: bold;">Waktu Upload</td><td style="padding: 8px;">${data.uploadedAt}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Status</td><td style="padding: 8px;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${data.status}</span></td></tr>
        </table>
        <div style="margin-top: 25px;">
          <a href="${adminLink}" style="background: #0284c7; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Periksa & Verifikasi Bukti</a>
        </div>
      </div>
    `;

    console.log(`[EmailService] Sending Payment Proof Email to ${this.adminEmail}:`, textContent);

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"POINT+ System" <${process.env.EMAIL_USER}>`,
          to: this.adminEmail,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[EmailService] Payment proof email successfully sent to ${this.adminEmail}`);
      } catch (err) {
        console.error('[EmailService] Failed to send email via SMTP:', err);
      }
    }
  }
}

export const emailService = new EmailService();
