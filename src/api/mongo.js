import { MongoClient } from 'mongodb';
import { config } from '../config/env.js';

let client;
let db;

export async function getDb() {
  if (db) return db;

  client = new MongoClient(config.mongoUri);
  await client.connect();
  db = client.db(config.mongoDbName);
  console.log(`[MongoDB] conectado em ${config.mongoUri}/${config.mongoDbName}`);
  return db;
}

export async function getCollection(name) {
  const database = await getDb();
  return database.collection(name);
}

export async function closeMongoConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
