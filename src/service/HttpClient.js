export class HttpClient {
  async request(path, options = {}) {
    const response = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      let message = `Erro ${response.status}`;
      try {
        const error = await response.json();
        message = error.message || error.details || message;
      } catch {}
      throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(path, body) {
    return this.request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
}
