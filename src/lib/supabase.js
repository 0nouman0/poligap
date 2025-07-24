import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.DATABASE_URL;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('Database URL:', databaseUrl ? 'configured' : 'not configured');
console.log('API URL:', apiUrl);

// Create Neon database connection
let sql;

try {
  if (databaseUrl) {
    sql = neon(databaseUrl);
  } else {
    console.warn('DATABASE_URL not configured, using mock database');
    sql = () => Promise.resolve([]);
  }
} catch (error) {
  console.error('Failed to create Neon database connection:', error);
  sql = () => Promise.resolve([]);
}

// API client for authentication
class AuthAPI {
  constructor() {
    this.baseUrl = apiUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async signUp(email, password, metadata = {}) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: { email, password, ...metadata },
    });
  }

  async signIn(email, password) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
  }

  async signOut() {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/signout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getProfile() {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(updates) {
    const token = localStorage.getItem('authToken');
    return this.request('/auth/profile', {
      method: 'PUT',
      body: updates,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async resetPassword(email) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  }
}

export const authAPI = new AuthAPI();
export { sql };
