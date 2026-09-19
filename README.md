# NeuroCart

NeuroCart is a browser-based product recommendation prototype that combines a Node.js API, MongoDB and a TensorFlow.js model trained from purchase history.

The project is useful as a compact study of the full recommendation flow: product and user data are served by an API, the browser prepares feature vectors, model training runs in a Web Worker, and the UI displays ranked recommendations without blocking the main thread.

## What is implemented

- Node.js and Express API for users and products
- MongoDB persistence and seed script
- Browser-side model training with TensorFlow.js
- Web Worker isolation for model training and recommendation
- Feature encoding for category, color, price and age
- Dense neural network with binary classification output
- Recommendation ranking by predicted compatibility score
- Training progress and visualization hooks through TFVisor
- Static frontend served by the same Node.js application

## Architecture

```text
Browser
  |
  | HTTP
  v
Express API
  |
  v
MongoDB

Browser UI
  |
  v
Web Worker
  |
  v
TensorFlow.js model
  |
  v
Ranked product recommendations
```

The API is responsible for data access. Model training and inference currently happen in the browser.

## Recommendation flow

1. User and product data are loaded from the API.
2. Product features are normalized and encoded.
3. Purchase history is converted into user vectors.
4. Training samples combine user and product vectors.
5. A small dense neural network is trained with TensorFlow.js.
6. The selected user is paired with every product.
7. Prediction scores are sorted to generate recommendations.

This is intentionally a learning-oriented implementation. It is not presented as a production recommendation service.

## Running locally

Requirements:

- Node.js 22 or newer
- Docker with Docker Compose, or a local MongoDB instance

Start MongoDB:

```bash
docker compose up -d
```

Create the environment file:

```bash
cp .env.example .env
```

Install dependencies and seed the database:

```bash
npm ci
npm run seed
```

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Environment

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ecommerce-aula
```

## API

```text
GET  /api/health
GET  /api/users
GET  /api/users/:id
POST /api/users
PUT  /api/users/:id
GET  /api/products
GET  /api/products/:id
```

## Verification

Run the syntax checks used by CI:

```bash
npm run check
```

## Current limitations

- Training data is intentionally small and synthetic.
- The model is retrained in the browser instead of being served as a versioned model artifact.
- Recommendation quality is not yet evaluated against a formal offline dataset.
- Authentication, authorization and multi-tenant isolation are outside the scope of this prototype.
- Product candidate retrieval is exhaustive. A larger catalog would require a separate retrieval stage before model scoring.

These limitations are part of the reason I keep this repository as an engineering experiment rather than describing it as a production system.

## Project background

This repository started from a recommendation-system exercise from the Software Engineering with Applied AI course material published by UNIPDS and Erick Wendel. I used that base to explore the recommendation flow and extended the project with a MongoDB-backed API, persistence, seed workflow and repository organization.

Upstream learning material:
https://github.com/unipds-engenharia-de-ia-aplicada/engenharia-de-software-com-ia-aplicada

The original course attribution is preserved here intentionally.

## Language

Brazilian Portuguese version: [README.pt-BR.md](README.pt-BR.md)
