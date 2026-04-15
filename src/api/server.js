import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCollection, closeMongoConnection } from './mongo.js';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const app = express();
app.use(express.json());
app.use(express.static(rootDir));

const stripMongoId = (document) => {
  if (!document) return document;
  const { _id, ...rest } = document;
  return rest;
};

const normalizeUser = (user) => ({
  ...user,
  purchases: Array.isArray(user.purchases) ? user.purchases : [],
});

const normalizeProduct = (product) => ({
  ...product,
});

const toNumericId = (value) => {
  const id = Number(value);
  return Number.isNaN(id) ? null : id;
};

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, db: config.mongoDbName });
});

app.get('/api/users', async (_req, res, next) => {
  try {
    const collection = await getCollection('users');
    const users = await collection.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    res.json(users.map(normalizeUser));
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const id = toNumericId(req.params.id);
    if (id === null) return res.status(400).json({ message: 'ID de usuário inválido.' });

    const collection = await getCollection('users');
    const user = await collection.findOne({ id }, { projection: { _id: 0 } });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(normalizeUser(user));
  } catch (error) {
    next(error);
  }
});

app.post('/api/users', async (req, res, next) => {
  try {
    const user = normalizeUser(req.body || {});
    if (typeof user.id !== 'number' || !user.name) {
      return res.status(400).json({ message: 'Usuário inválido. Informe ao menos id e name.' });
    }

    const collection = await getCollection('users');
    const alreadyExists = await collection.findOne({ id: user.id }, { projection: { _id: 1 } });

    if (alreadyExists) {
      return res.status(409).json({ message: 'Já existe um usuário com esse id.' });
    }

    await collection.insertOne(user);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.put('/api/users/:id', async (req, res, next) => {
  try {
    const id = toNumericId(req.params.id);
    if (id === null) return res.status(400).json({ message: 'ID de usuário inválido.' });

    const collection = await getCollection('users');
    const payload = normalizeUser({ ...req.body, id });

    const updateResult = await collection.updateOne({ id }, { $set: payload });
    if (!updateResult.matchedCount) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const updatedUser = await collection.findOne({ id });
    res.json(normalizeUser(stripMongoId(updatedUser)));
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (_req, res, next) => {
  try {
    const collection = await getCollection('products');
    const products = await collection.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    res.json(products.map(normalizeProduct));
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const id = toNumericId(req.params.id);
    if (id === null) return res.status(400).json({ message: 'ID de produto inválido.' });

    const collection = await getCollection('products');
    const product = await collection.findOne({ id }, { projection: { _id: 0 } });

    if (!product) return res.status(404).json({ message: 'Produto não encontrado.' });
    res.json(normalizeProduct(product));
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: 'Erro interno no servidor.',
    details: error.message,
  });
});

const server = app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
});

const shutdown = async () => {
  await closeMongoConnection();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
