import { ensureStorage } from '../storage/jsonStore.js';
import { seedDemoData } from '../seedData.js';

await ensureStorage();
await seedDemoData({ force: true });
console.log('Demo data seeded.');
