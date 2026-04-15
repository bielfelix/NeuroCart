import { HttpClient } from './HttpClient.js';

export class ProductService {
  #httpClient;

  constructor() {
    this.#httpClient = new HttpClient();
  }

  async getProducts() {
    return this.#httpClient.get('/api/products');
  }

  async getProductById(id) {
    return this.#httpClient.get(`/api/products/${id}`);
  }

  async getProductsByIds(ids) {
    const products = await this.getProducts();
    return products.filter(product => ids.includes(product.id));
  }
}
