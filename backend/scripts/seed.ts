import { db } from '../src/db.ts';

async function runSeed() {
  console.log('[Seed] Running manual database seed...');
  await db.init();
  console.log('[Seed] Database initialized and verified.');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
