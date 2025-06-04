//src/services/auth.js
import client from '../apis/client.js';

export async function login(email, password, captchaToken) {
  const response = await client.post('/auth/login', { email, password, captchaToken });
  return response.data;
}

export async function register(data) {
  const response = await client.post('/auth/register', data);
  return response.data;
}