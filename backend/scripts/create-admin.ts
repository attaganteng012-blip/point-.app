import readline from 'readline';
import bcrypt from 'bcryptjs';
import { db } from '../src/db.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('\n========================================');
  console.log('   POINT+ ADMIN REGISTRATION UTILITY   ');
  console.log('========================================\n');

  try {
    await db.init();

    const name = (await question('Nama Lengkap Admin : ')).trim();
    if (!name) {
      console.error('Error: Nama tidak boleh kosong!');
      process.exit(1);
    }

    const email = (await question('Email Admin        : ')).trim().toLowerCase();
    if (!email || !email.includes('@')) {
      console.error('Error: Email tidak valid!');
      process.exit(1);
    }

    // Check if email already exists
    const existing = await db.get('SELECT id FROM admins WHERE LOWER(email) = ?', [email]);
    if (existing) {
      console.error(`Error: Admin dengan email ${email} sudah terdaftar!`);
      process.exit(1);
    }

    const password = (await question('Password Admin     : ')).trim();
    if (!password || password.length < 6) {
      console.error('Error: Password minimal 6 karakter!');
      process.exit(1);
    }

    const roleInput = (await question('Role (SUPER_ADMIN / ADMIN, default: ADMIN): ')).trim().toUpperCase();
    const role = roleInput === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';

    console.log('\nMemproses hashing password dengan bcrypt (10 rounds)...');
    const passwordHash = await bcrypt.hash(password, 10);

    const res = await db.run(
      `INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, role]
    );

    console.log('\n========================================');
    console.log('✅ Admin berhasil didaftarkan ke Database!');
    console.log(`   ID    : ${res.lastID || 'Baru'}`);
    console.log(`   Nama  : ${name}`);
    console.log(`   Email : ${email}`);
    console.log(`   Role  : ${role}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Terjadi kesalahan saat membuat admin:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
