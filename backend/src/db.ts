import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import type { Database as SqlJsDatabase } from 'sql.js';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

export interface DBResult {
  rows: any[];
  rowCount?: number;
}

class DatabaseService {
  private pgPool: pg.Pool | null = null;
  private sqliteDb: SqlJsDatabase | null = null;
  private sqlitePath: string = path.resolve(process.cwd(), 'database/point_plus.sqlite');
  private isPostgres: boolean = false;
  private isInitialized: boolean = false;
  private isInitializing: boolean = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    if (this.isInitializing) {
      while (this.isInitializing && !this.isInitialized) {
        await new Promise((r) => setTimeout(r, 50));
      }
      return;
    }
    this.isInitializing = true;

    const dbUrl = process.env.DATABASE_URL?.trim();

    if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
      try {
        console.log('[DB] Connecting to PostgreSQL / Supabase...');
        this.pgPool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
        });

        // Test connection
        await this.pgPool.query('SELECT 1');
        this.isPostgres = true;
        console.log('[DB] Connected to PostgreSQL successfully.');
        await this.runPgMigrations();
      } catch (err) {
        console.warn('[DB] PostgreSQL connection failed, falling back to SQLite:', err);
        await this.initSqlite();
      }
    } else {
      await this.initSqlite();
    }

    this.isInitialized = true;
    this.isInitializing = false;

    await this.seedInitialData();
  }

  private async initSqlite(): Promise<void> {
    console.log('[DB] Initializing SQLite Relational Database Engine...');
    const dir = path.dirname(this.sqlitePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const SQL = await initSqlJs();

    if (fs.existsSync(this.sqlitePath)) {
      const fileBuffer = fs.readFileSync(this.sqlitePath);
      this.sqliteDb = new SQL.Database(fileBuffer);
      console.log('[DB] Loaded existing SQLite database from', this.sqlitePath);
    } else {
      this.sqliteDb = new SQL.Database();
      console.log('[DB] Created fresh SQLite database.');
    }

    this.sqliteDb.run('PRAGMA foreign_keys = ON;');
    this.runSqliteMigrations();
    this.persistSqlite();
  }

  private persistSqlite(): void {
    if (this.sqliteDb) {
      const data = this.sqliteDb.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.sqlitePath, buffer);
    }
  }

  private runSqliteMigrations(): void {
    if (!this.sqliteDb) return;

    this.sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'ADMIN',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        logo TEXT NOT NULL,
        banner TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        has_server_id INTEGER DEFAULT 0,
        player_label TEXT DEFAULT 'Player ID',
        server_label TEXT DEFAULT 'Server ID',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        amount TEXT NOT NULL,
        price REAL NOT NULL,
        active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        player_id TEXT NOT NULL,
        server_id TEXT,
        total_amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'QRIS_DANA',
        status TEXT DEFAULT 'PENDING_PAYMENT',
        rejection_reason TEXT,
        process_note TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS payment_proofs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        storage_path TEXT NOT NULL,
        original_filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at TEXT DEFAULT (datetime('now')),
        verified_at TEXT,
        verified_by INTEGER REFERENCES admins(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        order_id TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        order_id TEXT,
        description TEXT NOT NULL,
        ip_address TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }

  private async runPgMigrations(): Promise<void> {
    if (!this.pgPool) return;
    const migrationPath = path.resolve(process.cwd(), 'database/migrations/001_initial_schema.sql');
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      await this.pgPool.query(sql);
      console.log('[DB] PostgreSQL migrations applied successfully.');
    }
  }

  private async seedInitialData(): Promise<void> {
    const existingGames = await this.query('SELECT COUNT(*) as count FROM games');
    const count = Number(existingGames.rows[0]?.count || 0);

    if (count === 0) {
      console.log('[DB] Seeding games and products...');
      const games = [
        {
          id: 1,
          slug: 'mobile-legends',
          name: 'Mobile Legends: Bang Bang',
          description: 'Top up Diamonds & Weekly Diamond Pass Mobile Legends resmi dan terpercaya. Pengiriman cepat langsung masuk ke akun Anda.',
          logo: '/images/games/mobile-legends/logo.webp',
          banner: '/images/games/mobile-legends/banner.webp',
          has_server_id: 1,
          player_label: 'User ID',
          server_label: 'Zone ID'
        },
        {
          id: 2,
          slug: 'free-fire',
          name: 'Free Fire',
          description: 'Beli Diamonds Free Fire resmi Garena. Proses instan 24 jam dengan harga termurah dan verifikasi QRIS otomatis.',
          logo: '/images/games/free-fire/logo.webp',
          banner: '/images/games/free-fire/banner.webp',
          has_server_id: 0,
          player_label: 'Player ID',
          server_label: null
        },
        {
          id: 3,
          slug: 'pubg-mobile',
          name: 'PUBG Mobile',
          description: 'Isi Unknown Cash (UC) PUBG Mobile resmi Tencent VNG. Buka Royale Pass dan upgrade skin senjata impianmu.',
          logo: '/images/games/pubg-mobile/logo.webp',
          banner: '/images/games/pubg-mobile/banner.webp',
          has_server_id: 0,
          player_label: 'Player ID',
          server_label: null
        },
        {
          id: 4,
          slug: 'valorant',
          name: 'VALORANT',
          description: 'Beli Valorant Points (VP) resmi Riot Games. Beli skin bundle favoritmu dan raih rank Radiant.',
          logo: '/images/games/valorant/logo.webp',
          banner: '/images/games/valorant/banner.webp',
          has_server_id: 0,
          player_label: 'Riot ID (Nama#Tag)',
          server_label: null
        },
        {
          id: 5,
          slug: 'honor-of-kings',
          name: 'Honor of Kings',
          description: 'Top up Tokens Honor of Kings resmi Level Infinite. Dapatkan hero dan skin spektakuler di Arena Gorge.',
          logo: '/images/games/honor-of-kings/logo.webp',
          banner: '/images/games/honor-of-kings/banner.webp',
          has_server_id: 0,
          player_label: 'Player ID',
          server_label: null
        },
        {
          id: 6,
          slug: 'genshin-impact',
          name: 'Genshin Impact',
          description: 'Beli Genesis Crystals resmi Genshin Impact HoYoverse. Gacha karakter bintang 5 impianmu di Teyvat.',
          logo: '/images/games/genshin-impact/logo.webp',
          banner: '/images/games/genshin-impact/banner.webp',
          has_server_id: 1,
          player_label: 'UID',
          server_label: 'Server (Asia/America/Europe/TW)'
        },
        {
          id: 7,
          slug: 'roblox',
          name: 'Roblox',
          description: 'Beli Robux resmi Roblox. Nikmati jutaan game karya komunitas dengan outfit dan avatar terkeren.',
          logo: '/images/games/roblox/logo.webp',
          banner: '/images/games/roblox/banner.webp',
          has_server_id: 0,
          player_label: 'Roblox Username',
          server_label: null
        }
      ];

      for (const g of games) {
        await this.run(
          `INSERT INTO games (id, slug, name, description, logo, banner, active, has_server_id, player_label, server_label)
           VALUES (?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?)`,
          [g.id, g.slug, g.name, g.description, g.logo, g.banner, Boolean(g.has_server_id), g.player_label, g.server_label]
        );
      }

      const products = [
        // MLBB
        { game_id: 1, name: '86 Diamonds', amount: '86', price: 21000 },
        { game_id: 1, name: '172 Diamonds', amount: '172', price: 42000 },
        { game_id: 1, name: '257 Diamonds', amount: '257', price: 63000 },
        { game_id: 1, name: '344 Diamonds', amount: '344', price: 84000 },
        { game_id: 1, name: '429 Diamonds', amount: '429', price: 105000 },
        { game_id: 1, name: '514 Diamonds', amount: '514', price: 126000 },
        { game_id: 1, name: '706 Diamonds', amount: '706', price: 172000 },
        { game_id: 1, name: '878 Diamonds', amount: '878', price: 215000 },
        { game_id: 1, name: '1050 Diamonds', amount: '1050', price: 257000 },
        { game_id: 1, name: 'Weekly Diamond Pass', amount: '1 Pass', price: 28500 },

        // Free Fire
        { game_id: 2, name: '70 Diamonds', amount: '70', price: 9500 },
        { game_id: 2, name: '140 Diamonds', amount: '140', price: 19000 },
        { game_id: 2, name: '355 Diamonds', amount: '355', price: 48000 },
        { game_id: 2, name: '720 Diamonds', amount: '720', price: 95000 },
        { game_id: 2, name: '1450 Diamonds', amount: '1450', price: 190000 },
        { game_id: 2, name: '2180 Diamonds', amount: '2180', price: 285000 },
        { game_id: 2, name: '3640 Diamonds', amount: '3640', price: 475000 },

        // PUBG Mobile
        { game_id: 3, name: '60 UC', amount: '60', price: 14500 },
        { game_id: 3, name: '325 UC', amount: '325', price: 73000 },
        { game_id: 3, name: '660 UC', amount: '660', price: 145000 },
        { game_id: 3, name: '1800 UC', amount: '1800', price: 365000 },
        { game_id: 3, name: '3850 UC', amount: '3850', price: 730000 },
        { game_id: 3, name: '8100 UC', amount: '8100', price: 1460000 },

        // VALORANT
        { game_id: 4, name: '475 VP', amount: '475', price: 55000 },
        { game_id: 4, name: '1000 VP', amount: '1000', price: 110000 },
        { game_id: 4, name: '2050 VP', amount: '2050', price: 220000 },
        { game_id: 4, name: '3650 VP', amount: '3650', price: 385000 },
        { game_id: 4, name: '5350 VP', amount: '5350', price: 550000 },
        { game_id: 4, name: '11000 VP', amount: '11000', price: 1100000 },

        // Honor of Kings
        { game_id: 5, name: '80 Tokens', amount: '80', price: 15000 },
        { game_id: 5, name: '240 Tokens', amount: '240', price: 45000 },
        { game_id: 5, name: '400 Tokens', amount: '400', price: 75000 },
        { game_id: 5, name: '560 Tokens', amount: '560', price: 105000 },
        { game_id: 5, name: '830 Tokens', amount: '830', price: 150000 },

        // Genshin Impact
        { game_id: 6, name: '60 Genesis Crystals', amount: '60', price: 16000 },
        { game_id: 6, name: '300 Genesis Crystals', amount: '300', price: 79000 },
        { game_id: 6, name: '980 Genesis Crystals', amount: '980', price: 249000 },
        { game_id: 6, name: '1980 Genesis Crystals', amount: '1980', price: 479000 },
        { game_id: 6, name: '3280 Genesis Crystals', amount: '3280', price: 799000 },
        { game_id: 6, name: '6480 Genesis Crystals', amount: '6480', price: 1599000 },

        // Roblox
        { game_id: 7, name: '80 Robux', amount: '80', price: 15000 },
        { game_id: 7, name: '400 Robux', amount: '400', price: 75000 },
        { game_id: 7, name: '800 Robux', amount: '800', price: 150000 },
        { game_id: 7, name: '1700 Robux', amount: '1700', price: 300000 },
        { game_id: 7, name: '4500 Robux', amount: '4500', price: 750000 },
      ];

      for (const p of products) {
        await this.run(
          `INSERT INTO products (game_id, name, amount, price, active) VALUES (?, ?, ?, ?, TRUE)`,
          [p.game_id, p.name, p.amount, p.price]
        );
      }
      console.log('[DB] Seeded games and products successfully.');
    }

    // Check admin existence
    const existingAdmins = await this.query('SELECT COUNT(*) as count FROM admins');
    const adminCount = Number(existingAdmins.rows[0]?.count || 0);

    if (adminCount === 0) {
      console.log('[DB] Creating default Super Admin accounts...');
      const superAdminPass = await bcrypt.hash('AdminPointPlus2026!', 10);
      const userAdminPass = await bcrypt.hash('PointPlusAdmin123!', 10);

      await this.run(
        `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, 'SUPER_ADMIN')`,
        ['Super Administrator', 'admin@pointplus.id', superAdminPass]
      );

      await this.run(
        `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, 'SUPER_ADMIN')`,
        ['Atta Administrator', 'attaerpeel@gmail.com', userAdminPass]
      );
      console.log('[DB] Created default super admin accounts: admin@pointplus.id and attaerpeel@gmail.com');
    }
  }

  private sanitizePgSql(sqlText: string): string {
    return sqlText
      .replace(/datetime\('now'\)/gi, 'CURRENT_TIMESTAMP')
      .replace(/\bactive\s*=\s*1\b/gi, 'active = TRUE')
      .replace(/\bactive\s*=\s*0\b/gi, 'active = FALSE')
      .replace(/\bis_read\s*=\s*1\b/gi, 'is_read = TRUE')
      .replace(/\bis_read\s*=\s*0\b/gi, 'is_read = FALSE')
      .replace(/\bhas_server_id\s*=\s*1\b/gi, 'has_server_id = TRUE')
      .replace(/\bhas_server_id\s*=\s*0\b/gi, 'has_server_id = FALSE');
  }

  // Unified Query execution
  async query(sqlText: string, params: any[] = []): Promise<DBResult> {
    await this.init();

    const cleanParams = params.map((p) => {
      if (typeof p === 'boolean') {
        return this.isPostgres ? p : (p ? 1 : 0);
      }
      if (p === undefined) return null;
      return p;
    });

    if (this.isPostgres && this.pgPool) {
      let pgSql = this.sanitizePgSql(sqlText);
      // Convert ? to $1, $2, etc for postgres
      let pIdx = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${pIdx++}`);
      const res = await this.pgPool.query(pgSql, cleanParams);
      return { rows: res.rows, rowCount: res.rowCount || 0 };
    }

    if (this.sqliteDb) {
      // sql.js execution
      const stmt = this.sqliteDb.prepare(sqlText);
      try {
        stmt.bind(cleanParams);
        const rows: any[] = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return { rows, rowCount: rows.length };
      } catch (err) {
        stmt.free();
        throw err;
      }
    }

    throw new Error('Database not initialized');
  }

  async run(sqlText: string, params: any[] = []): Promise<{ lastID?: number; changes?: number }> {
    await this.init();

    const cleanParams = params.map((p) => {
      if (typeof p === 'boolean') {
        return this.isPostgres ? p : (p ? 1 : 0);
      }
      if (p === undefined) return null;
      return p;
    });

    if (this.isPostgres && this.pgPool) {
      let pgSql = this.sanitizePgSql(sqlText);
      let pIdx = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${pIdx++}`);
      const res = await this.pgPool.query(pgSql, cleanParams);
      return { changes: res.rowCount || 0 };
    }

    if (this.sqliteDb) {
      this.sqliteDb.run(sqlText, cleanParams);
      this.persistSqlite();
      
      // Get last insert rowid
      const idRes = this.sqliteDb.exec('SELECT last_insert_rowid() as id');
      const lastID = idRes[0]?.values[0]?.[0] as number | undefined;
      return { lastID, changes: 1 };
    }

    throw new Error('Database not initialized');
  }

  async get(sqlText: string, params: any[] = []): Promise<any | null> {
    const res = await this.query(sqlText, params);
    return res.rows[0] || null;
  }
}

export const db = new DatabaseService();
