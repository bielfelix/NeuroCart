import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCollection, closeMongoConnection } from './mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

async function readJson(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  const fileContent = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
}

async function seedCollection(name, data) {
  const collection = await getCollection(name);
  await collection.deleteMany({});
  if (data.length) {
    await collection.insertMany(data);
  }
  console.log(`[seed] ${name}: ${data.length} registros importados.`);
}

async function run() {
  try {
    const [users, products] = await Promise.all([
      readJson('data/users.json'),
      readJson('data/products.json'),
    ]);

    await seedCollection('users', users);
    await seedCollection('products', products);
  } finally {
    await closeMongoConnection();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
