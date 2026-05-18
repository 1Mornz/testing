import { ensureStorage } from '../lib/jsonStore.js';
import { seedDemoData } from '../lib/seedData.js';

await ensureStorage();
await seedDemoData({ force: true });
console.log('Demo data seeded.');
