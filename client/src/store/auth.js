    //src/store/auth.js
import { reactive } from 'vue';
import { login as apiLogin, register as apiRegister } from '../services/auth.js';

const state = reactive({
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || null),
  error: null
});

export function useAuthStore() {
  const login = async (email, password) => {
    try {
      state.error = null;
      const { token, user } = await apiLogin(email, password);
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      state.error = error.message;
      throw error;
    }
  };

  const register = async (data) => {
    await apiRegister(data);
  };

  const logout = () => {
    state.token = '';
    state.user  = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { ...state, login, register, logout };
}