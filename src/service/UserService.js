import { HttpClient } from './HttpClient.js';

export class UserService {
  #httpClient;

  constructor() {
    this.#httpClient = new HttpClient();
  }

  async getDefaultUsers() {
    return this.#httpClient.get('/api/users');
  }

  async getUsers() {
    return this.#httpClient.get('/api/users');
  }

  async getUserById(userId) {
    return this.#httpClient.get(`/api/users/${userId}`);
  }

  async updateUser(user) {
    return this.#httpClient.put(`/api/users/${user.id}`, user);
  }

  async addUser(user) {
    return this.#httpClient.post('/api/users', {
      ...user,
      purchases: Array.isArray(user.purchases) ? user.purchases : [],
    });
  }
}
